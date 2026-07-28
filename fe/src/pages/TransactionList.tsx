import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import { Plus, X } from 'lucide-react';

export default function TransactionList() {
  const { transactions, categories, wallets, loading, error, refetch } = useApp();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Popup form state
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [walletId, setWalletId] = useState('');
  const [fromWalletId, setFromWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const getCategoryName = (catId?: string) => {
    if (!catId) return '-';
    return categories.find((c) => c.id === catId)?.name || catId;
  };

  const getWalletName = (wId: string) => {
    return wallets.find((w) => w.id === wId)?.name || wId;
  };

  const filtered = transactions.filter((tx) => {
    if (!tx.createdAt) return true;
    const d = new Date(tx.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && d < from) return false;
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }
    if (typeFilter && tx.type !== typeFilter) return false;
    if (categoryFilter && tx.categoryId !== categoryFilter) return false;
    return true;
  });

  const clearFilter = () => {
    setFromDate('');
    setToDate('');
    setTypeFilter('');
    setCategoryFilter('');
  };

  const resetForm = () => {
    setAmount('');
    setType('EXPENSE');
    setWalletId('');
    setFromWalletId('');
    setToWalletId('');
    setCategoryId('');
    setNote('');
    setFormError('');
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const id = 'tx_' + Math.random().toString(36).slice(2, 10);

      if (type === 'EXPENSE') {
        await api.createExpense({ id, walletId, categoryId, amount: Number(amount), note });
      } else if (type === 'INCOME') {
        await api.createIncome({ id, walletId, categoryId, amount: Number(amount), note });
      } else {
        await api.createTransfer({ id, fromWalletId, toWalletId, amount: Number(amount), note });
      }

      resetForm();
      setShowModal(false);
      await refetch();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 light:text-gray-600 dark:text-gray-400">Đang tải...</div>;
  if (error) return <div className="text-red-600 py-20">Lỗi: {error}</div>;

  const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">Giao dịch</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm
        </button>
      </div>

      <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Từ ngày</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Đến ngày</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Loại</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={inputClass}>
              <option value="">Tất cả</option>
              <option value="EXPENSE">Chi tiêu</option>
              <option value="INCOME">Thu nhập</option>
              <option value="TRANSFER">Chuyển tiền</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={inputClass}>
              <option value="">Tất cả</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button type="button" onClick={clearFilter} className="border light:border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg light:text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Xoá lọc</button>
          </div>
        </div>
      </div>

      <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="light:bg-gray-50 dark:bg-gray-800 border-b light:border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Loại</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Số tiền</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Ví</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Ghi chú</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center light:text-gray-400 dark:text-gray-500">Chưa có giao dịch</td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="border-b light:border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.type === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      tx.type === 'EXPENSE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {tx.type === 'INCOME' ? 'Thu nhập' : tx.type === 'EXPENSE' ? 'Chi tiêu' : 'Chuyển tiền'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${tx.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{getCategoryName(tx.categoryId)}</td>
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{getWalletName(tx.walletId)}</td>
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{tx.note || '-'}</td>
                  <td className="px-4 py-3 light:text-gray-500 dark:text-gray-500">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 relative">
            <div className="flex justify-between items-center mb-5 border-b dark:border-gray-800 pb-3">
              <h3 className="text-xl font-bold dark:text-white">Thêm giao dịch mới</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Loại giao dịch</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                  <option value="EXPENSE">Chi tiêu</option>
                  <option value="INCOME">Thu nhập</option>
                  <option value="TRANSFER">Chuyển tiền</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Số tiền (VNĐ)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min={1} className={inputClass} />
              </div>

              {type === 'TRANSFER' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ví nguồn</label>
                    <select value={fromWalletId} onChange={(e) => setFromWalletId(e.target.value)} required className={inputClass}>
                      <option value="">Chọn ví...</option>
                      {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ví đích</label>
                    <select value={toWalletId} onChange={(e) => setToWalletId(e.target.value)} required className={inputClass}>
                      <option value="">Chọn ví...</option>
                      {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ví</label>
                    <select value={walletId} onChange={(e) => setWalletId(e.target.value)} required className={inputClass}>
                      <option value="">Chọn ví...</option>
                      {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Danh mục</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
                      <option value="">Chọn danh mục...</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ghi chú</label>
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50">
                  {submitting ? 'Đang lưu...' : 'Tạo giao dịch'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 border rounded-lg dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
