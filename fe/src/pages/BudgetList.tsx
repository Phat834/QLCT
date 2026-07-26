import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Pencil, Trash2, Wallet } from 'lucide-react';

export default function BudgetList() {
  const { budgets, categories, transactions, wallets, refetch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getActualSpent = (catId: string, walletId?: string) => {
    const category = categories.find((c) => c.id === catId);
    
    // Kiểm tra xem đây có phải là danh mục Tiết kiệm hay không (dựa theo tên hoặc loại)
    const isSavingsCategory = category?.name.toLowerCase().includes('tiết kiệm');
  
    if (isSavingsCategory) {
      // 💡 LOGIC CHO TIẾT KIỆM:
      // Tính tổng tiền Thu nhập (INCOME) nạp thẳng vào ví tiết kiệm 
      // HOẶC tiền Chuyển khoản (TRANSFER) chuyển tới ví tiết kiệm đó
      return transactions
        .filter((t) => {
          const isTargetWallet = walletId ? (t.walletId === walletId || t.targetWalletId === walletId) : true;
          const isSavingsCat = t.categoryId === catId;
  
          // Giao dịch nạp tiền/thu nhập vào danh mục tiết kiệm OR chuyển khoản tới ví tiết kiệm
          const isSavingsDeposit = 
            (t.type === 'INCOME' && isSavingsCat) ||
            (t.type === 'TRANSFER' && t.targetWalletId === walletId) ||
            (t.type === 'EXPENSE' && isSavingsCat); // Phòng trường hợp bạn lỡ tạo loại EXPENSE cho tiết kiệm
  
          return isTargetWallet && isSavingsDeposit;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    }
  
    // 💡 LOGIC CHO CHI TIÊU THƯỜNG (Tiền nhà, Ăn uống, Sinh hoạt...):
    return transactions
      .filter((t) => {
        const isExpense = t.type === 'EXPENSE';
        const isSameCategory = t.categoryId === catId;
        // Nếu ngân sách có chọn ví cụ thể thì lọc theo ví, nếu không thì tính tất cả ví
        const isSameWallet = walletId ? t.walletId === walletId : true;
  
        return isExpense && isSameCategory && isSameWallet;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const resetForm = () => {
    setCategoryId('');
    setWalletId('');
    setLimitAmount('');
    setEditingId(null);
    setError('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const id = 'budget_' + Math.random().toString(36).slice(2, 10);
      const res = await fetch('http://localhost:3000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, categoryId, walletId, limitAmount: Number(limitAmount) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
        throw new Error(err.error || res.statusText);
      }
      resetForm();
      setShowForm(false);
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/budgets/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, walletId, limitAmount: Number(limitAmount) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
        throw new Error(err.error || res.statusText);
      }
      resetForm();
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá ngân sách này?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/budgets/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
        throw new Error(err.error || res.statusText);
      }
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (b: any) => {
    setEditingId(b.id);
    setCategoryId(b.categoryId);
    setWalletId(b.walletId || '');
    setLimitAmount(String(b.limitAmount));
    setShowForm(false);
    setError('');
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';
  const labelClass = 'block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">Ngân sách</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Wallet size={24} />
            </div>
            <span className="text-sm light:text-gray-500 dark:text-gray-400">Tổng số dư</span>
          </div>
          <p className="text-2xl font-bold light:text-gray-800 dark:text-white">{totalBalance.toLocaleString('vi-VN')} VNĐ</p>
        </div>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={editingId ? handleUpdate : handleCreate} className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 max-w-lg space-y-4">
          <div>
            <label className={labelClass}>Danh mục</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
              <option value="">Chọn...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Ví</label>
            <select value={walletId} onChange={(e) => setWalletId(e.target.value)} required className={inputClass}>
              <option value="">Chọn...</option>
              {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Hạn mức (VNĐ)</label>
            <input type="number" value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)} required min={1} className={inputClass} />
          </div>
          {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Lưu'}
            </button>
            <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="border light:border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg light:text-gray-700 dark:text-gray-300">Hủy</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {budgets.map((b) => {
          const cat = categories.find((c) => c.id === b.categoryId);
          const wallet = wallets.find((w) => w.id === b.walletId);
          const actualSpent = getActualSpent(b.categoryId, b.walletId);
          const percent = b.limitAmount > 0 ? (actualSpent / b.limitAmount) * 100 : 0;
          const status = percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-yellow-500' : 'bg-green-500';
          return (
            <div key={b.id} className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-5">
              {/* CODE MỚI CƠ CẤU LẠI 3 CỘT */}
              <div className="grid grid-cols-3 items-center mb-2">
                {/* Cột trái: Tên danh mục */}
                <div>
                  <h3 className="font-semibold light:text-gray-800 dark:text-white">{cat?.name || b.categoryId}</h3>
                </div>

                {/* Cột giữa: Tên ví (Được thiết kế nổi bật và căn giữa) */}
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                    <Wallet size={13} />
                    {wallet?.name || b.walletId}
                  </span>
                </div>

                {/* Cột phải: Số tiền + Nút hành động */}
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm font-medium light:text-gray-600 dark:text-gray-400">
                    {actualSpent.toLocaleString('vi-VN')} / {b.limitAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <button onClick={() => startEdit(b)} className="text-indigo-600 hover:text-indigo-800">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
               <div className="w-full light:bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`${status} h-2 rounded-full transition-all`} style={{ width: `${Math.min(percent, 100)}%` }} />
              </div>
              <p className="text-xs light:text-gray-400 dark:text-gray-500 mt-1">{percent.toFixed(1)}%</p>
            </div>
          );
        })}
        {budgets.length === 0 && (
          <p className="light:text-gray-400 dark:text-gray-500 text-center py-8">Chưa có ngân sách nào</p>
        )}
      </div>
    </div>
  );
}
