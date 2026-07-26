import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Plus } from 'lucide-react';

export default function TransactionList() {
  const { transactions, categories, wallets, loading, error } = useApp();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || walletId;
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

  if (loading) return <div className="text-center py-20 light:text-gray-600 dark:text-gray-400">Đang tải...</div>;
  if (error) return <div className="text-red-600 py-20">Lỗi: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">Giao dịch</h2>
        <Link to="/transactions/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm
        </Link>
      </div>

      <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Từ ngày</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Đến ngày</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Loại</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white">
              <option value="">Tất cả</option>
              <option value="EXPENSE">Chi tiêu</option>
              <option value="INCOME">Thu nhập</option>
              <option value="TRANSFER">Chuyển tiền</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white">
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
    </div>
  );
}