import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import CurrencyInput from '../components/CurrencyInput';
import { parseCurrency, formatCurrency } from '../utils/currency';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function WalletList() {
  const { wallets, refetch } = useApp();
  const [showModal, setShowModal] = useState(false);
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
          body: JSON.stringify({ name, balance: parseCurrency(balance) }),
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
          body: JSON.stringify({ id, name, balance: parseCurrency(balance) }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
          throw new Error(err.error || res.statusText);
        }
      }
      resetForm();
      setShowModal(false);
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
    setBalance(formatCurrency(String(w.balance)));
    setShowModal(true);
    setError('');
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-gray-100 dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">Ví</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm ví
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((w) => (
          <div key={w.id} className="light:bg-gray-100 dark:bg-gray-900 rounded-lg shadow p-5 flex justify-between items-start">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 relative">
            <div className="flex justify-between items-center mb-5 border-b dark:border-gray-800 pb-3">
              <h3 className="text-xl font-bold dark:text-white">{editingId ? 'Cập nhật ví' : 'Thêm ví mới'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tên ví</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Số dư</label>
                <CurrencyInput value={balance} onChange={setBalance} required min={0} className={inputClass} />
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
    </div>
  );
}
