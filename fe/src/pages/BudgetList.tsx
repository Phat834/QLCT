import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus } from 'lucide-react';

export default function BudgetList() {
  const { budgets, categories, wallets, refetch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await fetch('http://localhost:3000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, categoryId, walletId, limitAmount: Number(limitAmount) }),
      });
      setId('');
      setCategoryId('');
      setWalletId('');
      setLimitAmount('');
      setShowForm(false);
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ngân sách</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-6 mb-6 max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input value={id} onChange={(e) => setId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Chọn...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ví</label>
            <select value={walletId} onChange={(e) => setWalletId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Chọn...</option>
              {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn mức (VNĐ)</label>
            <input type="number" value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)} required min={1} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg">Hủy</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {budgets.map((b) => {
          const cat = categories.find((c) => c.id === b.categoryId);
          const percent = (b.currentSpent / b.limitAmount) * 100;
          const status = percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-yellow-500' : 'bg-green-500';
          return (
            <div key={b.id} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">{cat?.name || b.categoryId}</h3>
                <span className="text-sm font-medium text-gray-600">{b.currentSpent.toLocaleString('vi-VN')} / {b.limitAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${status} h-2 rounded-full transition-all`} style={{ width: `${Math.min(percent, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1 font-mono">{b.id}</p>
            </div>
          );
        })}
        {budgets.length === 0 && (
          <p className="text-gray-400 text-center py-8">Chưa có ngân sách nào</p>
        )}
      </div>
    </div>
  );
}
