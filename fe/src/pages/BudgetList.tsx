import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import CurrencyInput from '../components/CurrencyInput';
import { parseCurrency, formatCurrency } from '../utils/currency';
import { Plus, Pencil, Trash2, X, Wallet, AlertTriangle, Calendar } from 'lucide-react';

export default function BudgetList() {
  const { budgets, categories, transactions, wallets, refetch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const getActualSpent = (catId: string, wId?: string) => {
    const isSavings = categories.find(c => c.id === catId)?.name.toLowerCase().includes('tiết kiệm');
    return transactions
      .filter(t => wId ? (t.walletId === wId || t.targetWalletId === wId) : true)
      .filter(t => isSavings
        ? ((t.type === 'INCOME' && t.categoryId === catId) || (t.type === 'TRANSFER' && t.targetWalletId === wId) || (t.type === 'EXPENSE' && t.categoryId === catId))
        : ((t.type === 'EXPENSE' && t.categoryId === catId && (wId ? t.walletId === wId : true)) || (t.type === 'TRANSFER' && !!wId && t.targetWalletId === wId))
      )
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

  const resetForm = () => { setCategoryId(''); setWalletId(''); setLimitAmount(''); setDueDate(''); setEditingId(null); setError(''); };

  const handleAddClick = () => {
    if (wallets.length === 0) return setShowWarning(true);
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const url = editingId ? `http://localhost:3000/api/budgets/${editingId}` : 'http://localhost:3000/api/budgets';
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId 
      ? { categoryId, walletId, limitAmount: parseCurrency(limitAmount), dueDate: dueDate || null } 
      : { id: 'budget_' + Math.random().toString(36).slice(2, 10), categoryId, walletId, limitAmount: parseCurrency(limitAmount), dueDate: dueDate || null };

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
      resetForm();
      setShowModal(false);
      await refetch();
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await fetch(`http://localhost:3000/api/budgets/${id}`, { method: 'DELETE' });
      await refetch();
    } catch (err: any) { setError(err.message); }
  };

  const startEdit = (b: any) => {
    setEditingId(b.id); setCategoryId(b.categoryId); setWalletId(b.walletId || '');     setLimitAmount(formatCurrency(String(b.limitAmount))); setDueDate(b.dueDate || '');
    setError('');
    setShowModal(true);
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-gray-100 dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">Ngân sách</h2>
        <button onClick={handleAddClick} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium">
          <Plus size={16} /> Thêm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="light:bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Wallet size={24} /></div>
          <div>
            <span className="text-xs font-medium light:text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Tổng số dư</span>
            <p className="text-xl font-bold light:text-gray-800 dark:text-white mt-0.5">
              {wallets.reduce((s, w) => s + w.balance, 0).toLocaleString('vi-VN')} VNĐ
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách Ngân Sách - Đã tối ưu hiển thị số liệu */}
      <div className="space-y-4">
        {budgets.map((b) => {
          const cat = categories.find((c) => c.id === b.categoryId);
          const wallet = wallets.find((w) => w.id === b.walletId);
          const spent = getActualSpent(b.categoryId, b.walletId);
          const pct = b.limitAmount > 0 ? (spent / b.limitAmount) * 100 : 0;
          
          // Màu sắc trạng thái tiến độ
          const progressColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
          const badgeBg = pct >= 100 ? 'bg-red-500/10 text-red-400 border-red-500/20' : pct >= 80 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

          const due = isDueDatePassed(b.dueDate);

          return (
            <div key={b.id} className="light:bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5 hover:border-gray-700 transition-all">
              
              {/* Dòng 1: Tên danh mục, Ví & Nút Thao tác */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg light:text-gray-800 dark:text-gray-100">{cat?.name || b.categoryId}</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                    <Wallet size={12} /> {wallet?.name || b.walletId}
                  </span>
                  {b.dueDate && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${due ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/50'}`}>
                      <Calendar size={12} /> Hẹn trả: {formatDueDate(b.dueDate)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(b)} className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"><Trash2 size={15} /></button>
                </div>
              </div>

              {/* Dòng 2: Hiển thị Số tiền RÕ RÀNG & NỔI BẬT */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  {/* Số tiền đã dùng: To + Đậm + Sáng */}
                  <span className="text-lg font-bold light:text-gray-900 dark:text-white">
                    {spent.toLocaleString('vi-VN')}
                  </span>
                  {/* Hạn mức: Nhạt hơn để tạo tương phản tầng bậc */}
                  <span className="text-sm font-medium text-gray-400 dark:text-gray-400">
                    / {b.limitAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                {/* % Tiến độ: Được đóng khung nổi bật */}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${badgeBg}`}>
                  {pct.toFixed(1)}%
                </span>
              </div>

              {/* Dòng 3: Thanh Progress Bar nổi bật */}
              <div className="w-full light:bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden p-0.5">
                <div 
                  className={`${progressColor} h-full rounded-full transition-all duration-300`} 
                  style={{ width: `${Math.min(pct, 100)}%` }} 
                />
              </div>

            </div>
          );
        })}
      </div>

      {/* POP-UP MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 relative">
            <div className="flex justify-between items-center mb-5 border-b dark:border-gray-800 pb-3">
              <h3 className="text-xl font-bold dark:text-white">{editingId ? 'Cập nhật ngân sách' : 'Thêm ngân sách mới'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Danh mục</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
                  <option value="">Chọn...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ví</label>
                <select value={walletId} onChange={(e) => setWalletId(e.target.value)} required className={inputClass}>
                  <option value="">Chọn...</option>
                  {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hạn mức (VNĐ)</label>
                <CurrencyInput value={limitAmount} onChange={setLimitAmount} required min={1} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ngày hẹn trả (tuỳ chọn)</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50">
                  {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Lưu'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2.5 border rounded-lg dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
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
          <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center flex flex-col items-center">
            <div className="w-20 h-20 mb-5 bg-amber-100/80 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 stroke-[2.5]" />
            </div>
            <p className="text-gray-900 dark:text-white font-bold text-base mb-6 leading-snug">
              Không thể hoàn tất thao tác. Bạn cần tạo ít nhất 1 ví trước!
            </p>
            <button onClick={() => setShowWarning(false)} className="w-full text-red-600 font-semibold py-3 rounded-xl border border-red-200 hover:bg-gray-50 transition">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
