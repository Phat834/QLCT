import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus } from 'lucide-react';

export default function WalletList() {
  const { wallets, refetch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const id = 'w_' + Math.random().toString(36).slice(2, 10);
      await fetch('http://localhost:3000/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, balance: Number(initialBalance) }),
      });
      setName('');
      setInitialBalance('');
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
        <h2 className="text-2xl font-bold text-gray-800">Ví</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm ví
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-6 mb-6 max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên ví</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số dư ban đầu</label>
            <input type="number" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} required min={0} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((w) => (
          <div key={w.id} className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-800">{w.name}</h3>
            <p className="text-2xl font-bold text-gray-800">{w.balance.toLocaleString('vi-VN')} VNĐ</p>
          </div>
        ))}
        {wallets.length === 0 && (
          <p className="text-gray-400 col-span-3 text-center py-8">Chưa có ví nào</p>
        )}
      </div>
    </div>
  );
}
