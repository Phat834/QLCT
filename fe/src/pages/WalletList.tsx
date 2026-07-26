import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function WalletList() {
  const { wallets, refetch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setBalance('');
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:3000/api/wallets/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, balance: Number(balance) }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
          throw new Error(err.error || res.statusText);
        }
      } else {
        const id = 'w_' + Math.random().toString(36).slice(2, 10);
        const res = await fetch('http://localhost:3000/api/wallets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name, balance: Number(balance) }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
          throw new Error(err.error || res.statusText);
        }
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

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá ví này?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/wallets/${id}`, {
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

  const startEdit = (w: any) => {
    setEditingId(w.id);
    setName(w.name);
    setBalance(String(w.balance));
    setShowForm(false);
    setError('');
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';
  const labelClass = 'block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">Ví</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm ví
        </button>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={handleSubmit} className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 max-w-md space-y-4">
          <div>
            <label className={labelClass}>Tên ví</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Số dư</label>
            <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} required min={0} className={inputClass} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((w) => (
          <div key={w.id} className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-5 flex justify-between items-start">
            <div>
              <h3 className="font-semibold light:text-gray-800 dark:text-white">{w.name}</h3>
              <p className="text-2xl font-bold light:text-gray-800 dark:text-white">{w.balance.toLocaleString('vi-VN')} VNĐ</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(w)} className="text-indigo-600 hover:text-indigo-800"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(w.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {wallets.length === 0 && (
          <p className="light:text-gray-400 dark:text-gray-500 col-span-3 text-center py-8">Chưa có ví nào</p>
        )}
      </div>
    </div>
  );
}
