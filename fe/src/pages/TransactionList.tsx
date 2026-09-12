import { useState, Fragment } from 'react';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import CurrencyInput from '../components/CurrencyInput';
import { parseCurrency } from '../utils/currency';
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

  const grouped = filtered.reduce((groups, tx) => {
    const dateKey = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : 'Không rõ ngày';
    const last = groups[groups.length - 1];
    if (last && last.date === dateKey) {
      last.items.push(tx);
    } else {
      groups.push({ date: dateKey, items: [tx] });
    }
    return groups;
  }, [] as { date: string; items: typeof filtered }[]);

  const expenseByDate = grouped.reduce((map, group) => {
    const total = group.items
      .filter((tx) => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);
    map[group.date] = total;
    return map;
  }, {} as Record<string, number>);

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
        await api.createExpense({ id, walletId, categoryId, amount: parseCurrency(amount), note });
      } else if (type === 'INCOME') {
        await api.createIncome({ id, walletId, categoryId: categoryId || undefined, amount: parseCurrency(amount), note });
      } else {
        await api.createTransfer({ id, fromWalletId, toWalletId, amount: parseCurrency(amount), note });
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

  if (loading) return <div className="text-center py-20 text-cyan-400 font-mono tracking-wider animate-pulse">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-400 py-20 font-mono text-center">Lỗi: {error}</div>;

  const inputClass = 'w-full border rounded-lg px-3 py-2 bg-[#1a1f2b] border-gray-600 text-slate-200 font-sans focus:outline-none focus:border-cyan-500/50';

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-200 font-mono tracking-wide">Giao dịch</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium px-4 py-2 rounded-lg flex items-center gap-2 font-mono tracking-wide transition"
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      <div className="border border-cyan-500/30 bg-[#0d121c]/90 rounded-2xl shadow-xl shadow-cyan-950/20 overflow-hidden backdrop-blur-md mb-6">
        <div className="flex items-center px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
            <h3 className="font-mono uppercase tracking-widest text-sm font-semibold text-cyan-300">Bộ lọc</h3>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Từ ngày</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Đến ngày</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Loại</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={inputClass}>
                <option value="">Tất cả</option>
                <option value="EXPENSE">Chi tiêu</option>
                <option value="INCOME">Thu nhập</option>
                <option value="TRANSFER">Chuyển tiền</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Danh mục</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={inputClass}>
                <option value="">Tất cả</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilter}
                className="w-full border border-cyan-500/30 px-4 py-2 rounded-lg text-slate-300 font-mono hover:bg-cyan-950/30 transition"
              >Xoá lọc</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-cyan-500/30 bg-[#0d121c]/90 rounded-2xl shadow-xl shadow-cyan-950/20 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 font-mono text-xs uppercase bg-[#111827]/60">
                <th className="py-3 px-5">Loại</th>
                <th className="py-3 px-5">Số tiền</th>
                <th className="py-3 px-5">Danh mục</th>
                <th className="py-3 px-5">Ví</th>
                <th className="py-3 px-5">Ghi chú</th>
                <th className="py-3 px-5 text-right">Tổng tiêu trong ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-mono">
                    Chưa có giao dịch nào
                  </td>
                </tr>
              ) : (
                grouped.map((group) => (
                  <Fragment key={group.date}>
                    <tr>
                      <td colSpan={6} className="px-5 py-1">
                        <div className="border-t-2 border-cyan-500/30 my-1"></div>
                        <span className="font-mono text-[15px] font-semibold text-cyan-300 uppercase tracking-wider">
                          {group.date}
                        </span>
                        <div className="border-b border-cyan-500/10 mt-1"></div>
                      </td>
                    </tr>
                    {group.items.map((tx, txIndex) => {
                      const isIncome = tx.type === 'INCOME';
                      const isExpense = tx.type === 'EXPENSE';
                      const isLastInGroup = txIndex === group.items.length - 1;
                      const typeColor =
                        isIncome
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                          : isExpense
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                      const amountColor = isIncome ? 'text-teal-400' : isExpense ? 'text-rose-400' : 'text-cyan-400';

                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-cyan-500/[0.04] transition-colors group"
                        >
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border ${typeColor}`}
                            >
                              {isIncome ? 'Thu nhập' : isExpense ? 'Chi tiêu' : 'Chuyển tiền'}
                            </span>
                          </td>
                          <td className={`py-3.5 px-5 font-mono font-semibold whitespace-nowrap ${amountColor}`}>
                            {isIncome ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} <span className="text-[11px] text-slate-400">VNĐ</span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-300 whitespace-nowrap">
                            {tx.type === 'INCOME'
                              ? 'Tiền vào'
                              : tx.type === 'TRANSFER'
                                ? 'Chuyển ví nội bộ'
                                : getCategoryName(tx.categoryId)}
                          </td>
                          <td className="py-3.5 px-5 text-slate-300 whitespace-nowrap">{getWalletName(tx.walletId)}</td>
                          <td className="py-3.5 px-5 text-slate-300 text-[15px] max-w-xs truncate">{tx.note || '—'}</td>
                          <td className="py-3.5 px-5 font-mono text-[15px] text-rose-400 text-right whitespace-nowrap">
                            {isLastInGroup
                              ? expenseByDate[group.date] > 0
                                ? `${expenseByDate[group.date].toLocaleString('vi-VN')} VNĐ`
                                : '0 VNĐ'
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0d121c] border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-950/30">
            <div className="flex justify-between items-center mb-5 border-b border-cyan-500/20 pb-3">
              <h3 className="text-xl font-bold text-cyan-300 font-mono uppercase tracking-widest">Thêm giao dịch mới</h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Loại giao dịch</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                  <option value="EXPENSE">Chi tiêu</option>
                  <option value="INCOME">Thu nhập</option>
                  <option value="TRANSFER">Chuyển tiền</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Số tiền (VNĐ)</label>
                <CurrencyInput value={amount} onChange={setAmount} required min={1} className={inputClass} />
              </div>

              {type === 'TRANSFER' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">Ví nguồn</label>
                    <select value={fromWalletId} onChange={(e) => setFromWalletId(e.target.value)} required className={inputClass}>
                      <option value="">Chọn ví...</option>
                      {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">Ví đích</label>
                    <select value={toWalletId} onChange={(e) => setToWalletId(e.target.value)} required className={inputClass}>
                      <option value="">Chọn ví...</option>
                      {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">Ví</label>
                    <select value={walletId} onChange={(e) => setWalletId(e.target.value)} required className={inputClass}>
                      <option value="">Chọn ví...</option>
                      {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  {type === 'EXPENSE' && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Danh mục</label>
                      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
                        <option value="">Chọn danh mục...</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Ghi chú</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={inputClass}
                />
              </div>

              {formError && <p className="text-red-400 text-sm font-mono">{formError}</p>}

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium py-2.5 rounded-lg transition disabled:opacity-50 font-mono tracking-wide"
                >
                  {submitting ? 'Đang lưu...' : 'Tạo giao dịch'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2.5 border border-cyan-500/30 rounded-lg text-slate-300 font-mono hover:bg-cyan-950/30 transition"
                >
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
