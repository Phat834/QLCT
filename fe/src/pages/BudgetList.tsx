import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import { api } from '../services/api';
import CurrencyInput from '../components/CurrencyInput';
import { parseCurrency, formatCurrency } from '../utils/currency';
import { Plus, Pencil, Trash2, X, Wallet, AlertTriangle, Calendar } from 'lucide-react';

export default function BudgetList() {
  const { budgets, categories, transactions, wallets, refetch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [walletIds, setWalletIds] = useState<string[]>([]);
  const [limitAmount, setLimitAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [, forceRefresh] = useState(0);

  const STORAGE_KEY = 'budgetReset_';

  const getResetBaseline = (budgetId: string): number => {
    const stored = localStorage.getItem(STORAGE_KEY + budgetId);
    return stored ? Number(stored) : 0;
  };

  const resetBudget = (budgetId: string, currentSpent: number) => {
    localStorage.setItem(STORAGE_KEY + budgetId, String(currentSpent));
    forceRefresh((n) => n + 1);
  };

  const getActualSpent = (catId: string, walletIds?: string[]) => {
    const ids = walletIds || [];
    const isSavings = categories.find(c => c.id === catId)?.name.toLowerCase().includes('tiết kiệm');

    if (isSavings) {
      return wallets
        .filter((w) => ids.includes(w.id))
        .reduce((sum, w) => sum + w.balance, 0);
    }

    return transactions
      .filter(t => t.type === 'EXPENSE' && t.categoryId === catId && (ids.length > 0 ? ids.includes(t.walletId) : true))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const parseDueDate = (due?: string | null): Date | null => {
    if (!due) return null;
    const datePart = due.split('T')[0];
    const parts = datePart.split('-').map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  const isDueDatePassed = (due?: string | null) => {
    const d = parseDueDate(due);
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d.getTime() <= today.getTime();
  };

  const formatDueDate = (due?: string | null) => {
    const d = parseDueDate(due);
    return d ? d.toLocaleDateString('vi-VN') : '';
  };

  const resetForm = () => { setCategoryId(''); setWalletIds([]); setLimitAmount(''); setDueDate(''); setEditingId(null); setError(''); };

  const handleAddClick = () => {
    if (wallets.length === 0) return setShowWarning(true);
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const body = editingId
      ? { categoryId, walletIds, limitAmount: parseCurrency(limitAmount), dueDate: dueDate || null }
      : { id: 'budget_' + Math.random().toString(36).slice(2, 10), categoryId, walletIds, limitAmount: parseCurrency(limitAmount), dueDate: dueDate || null };

    try {
      if (editingId) {
        await api.updateBudget(editingId, body);
      } else {
        await api.createBudget(body);
      }
      resetForm();
      setShowModal(false);
      await refetch();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await api.deleteBudget(id);
      await api.deleteBudget(id);
      await refetch();
    } catch (err: any) { setError(err.message); }
  };

  const startEdit = (b: any) => {
    setEditingId(b.id);
    setCategoryId(b.categoryId);
    setWalletIds(b.walletIds || []);
    setLimitAmount(formatCurrency(String(b.limitAmount)));
    setDueDate(b.dueDate ? b.dueDate.split('T')[0] : '');
    setError('');
    setShowModal(true);
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 bg-[#1a1f2b] border-gray-600 text-slate-200 font-sans focus:outline-none focus:border-cyan-500/50';

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-200 font-mono tracking-wide">Ngân sách</h2>
        <button
          onClick={handleAddClick}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium px-4 py-2 rounded-lg flex items-center gap-2 font-mono tracking-wide transition"
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      {/* Thẻ thống kê số dư */}
      <div className="border border-cyan-500/30 bg-[#0d121c]/90 rounded-2xl shadow-xl shadow-cyan-950/20 overflow-hidden backdrop-blur-md mb-8 p-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400"><Wallet size={24} /></div>
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block font-mono">Tổng số dư</span>
            <p className="text-xl font-bold text-slate-200 mt-0.5 font-mono">
              {wallets.reduce((s, w) => s + w.balance, 0).toLocaleString('vi-VN')} VNĐ
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách Ngân Sách */}
      <div className="space-y-4">
        {budgets.map((b) => {
          const cat = categories.find((c) => c.id === b.categoryId);
          const budgetWallets = wallets.filter((w) => (b as any).walletIds?.includes(w.id) || (b as any).walletIds?.includes(w.id));
          const rawSpent = getActualSpent(b.categoryId, (b as any).walletIds || []);
          const baseline = getResetBaseline(b.id);
          const spent = Math.max(0, rawSpent - baseline);
          const pct = b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0;

          const progressColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
          const badgeBg = pct >= 100 ? 'bg-red-500/10 text-red-400 border border-red-500/30' : pct >= 80 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';

          const due = isDueDatePassed(b.dueDate);

          return (
            <div key={b.id} className="border border-cyan-500/30 bg-[#0d121c]/90 rounded-2xl shadow-xl shadow-cyan-950/20 p-5 hover:border-cyan-400 transition-colors backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-lg text-slate-200 font-mono">{cat?.name || b.categoryId}</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/60 text-indigo-400 border border-indigo-800">
                    <Wallet size={12} /> {budgetWallets.length > 0 ? budgetWallets.map((w) => w.name).join(', ') : 'Chưa chọn ví'}
                  </span>
                  {b.dueDate && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${due ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'}`}>
                      <Calendar size={12} /> Hẹn trả: {formatDueDate(b.dueDate)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {pct >= 100 && (
                    <button
                      onClick={() => resetBudget(b.id, spent)}
                      className="px-2 py-1 text-xs text-white bg-amber-500 hover:bg-amber-400 rounded font-mono transition"
                      title="Reset về 0"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(b)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-[#1a1f2b] rounded-lg transition"
                    title="Sửa"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#1a1f2b] rounded-lg transition"
                    title="Xoá"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-200 font-mono">
                    {spent.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    / {b.limitAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${badgeBg}`}>
                  {pct.toFixed(1)}%
                </span>
              </div>

              <div className="w-full bg-[#1a1f2b] rounded-full h-2.5 overflow-hidden p-0.5">
                <div
                  className={`${progressColor} h-full rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
        {budgets.length === 0 && (
          <p className="text-slate-400 font-mono text-center py-8">Chưa có ngân sách nào</p>
        )}
      </div>

      {/* POP-UP MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0d121c] border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-950/30">
            <div className="flex justify-between items-center mb-5 border-b border-cyan-500/20 pb-3">
              <h3 className="text-xl font-bold text-cyan-300 font-mono uppercase tracking-widest">
                {editingId ? 'Cập nhật ngân sách' : 'Thêm ngân sách mới'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Danh mục</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
                  <option value="">Chọn...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Chọn ví</label>
                <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-600 rounded-lg p-2 bg-[#1a1f2b]">
                  {wallets.map((w) => (
                    <label key={w.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={walletIds.includes(w.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWalletIds([...walletIds, w.id]);
                          } else {
                            setWalletIds(walletIds.filter((id) => id !== w.id));
                          }
                        }}
                        className="rounded border-gray-500 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-slate-200 text-sm">{w.name}</span>
                    </label>
                  ))}
                  {wallets.length === 0 && (
                    <p className="text-slate-500 text-xs">Chưa có ví nào</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Hạn mức (VNĐ)</label>
                <CurrencyInput value={limitAmount} onChange={setLimitAmount} required min={1} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Ngày hẹn trả (tuỳ chọn)</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
              </div>
              {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium py-2.5 rounded-lg transition disabled:opacity-50 font-mono tracking-wide"
                >
                  {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Lưu'}
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

      {/* POP-UP MODAL CẢNH BÁO */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0d121c] border border-cyan-500/30 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center flex flex-col items-center">
            <div className="w-20 h-20 mb-5 bg-amber-500/10 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-amber-400 stroke-[2.5]" />
            </div>
            <p className="text-slate-200 font-bold text-base mb-6 leading-snug font-mono">
              Không thể hoàn tất thao tác. Bạn cần tạo ít nhất 1 ví trước!
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full text-red-400 font-semibold py-3 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition font-mono"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
