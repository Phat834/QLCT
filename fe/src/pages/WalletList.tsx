import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import { api } from '../services/api';
import CurrencyInput from '../components/CurrencyInput';
import { parseCurrency, formatCurrency } from '../utils/currency';
import { Plus, Pencil, Trash2, X, Wallet } from 'lucide-react';

type WalletType = 'AVAILABLE' | 'SAVINGS';

export default function WalletList() {
  const { wallets, refetch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<WalletType>('AVAILABLE');

  const resetForm = () => {
    setName('');
    setBalance('');
    setType('AVAILABLE');
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        await api.updateWallet(editingId, { name, balance: parseCurrency(balance), type });
      } else {
        const id = 'w_' + Math.random().toString(36).slice(2, 10);
        await api.createWallet({ id, name, balance: parseCurrency(balance), type });
        await api.createWallet({ id, name, balance: parseCurrency(balance), type });
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
      await api.deleteWallet(id);
      await api.deleteWallet(id);
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
    setType(w.type || 'AVAILABLE');
    setShowModal(true);
    setError('');
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 bg-[#1a1f2b] border-gray-600 text-slate-200 font-sans focus:outline-none focus:border-cyan-500/50';

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-200 font-mono tracking-wide">Ví</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium px-4 py-2 rounded-lg flex items-center gap-2 font-mono tracking-wide transition"
        >
          <Plus size={16} /> Thêm ví
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((w) => (
          <div
            key={w.id}
            className="border border-cyan-500/30 bg-[#0d121c]/90 rounded-2xl shadow-xl shadow-cyan-950/20 p-5 flex justify-between items-start backdrop-blur-md hover:border-cyan-400 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-slate-200 text-lg flex items-center gap-2 font-mono">
                <Wallet size={16} className="text-cyan-400" />
                {w.name}
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono ${
                    w.type === 'SAVINGS'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {w.type === 'SAVINGS' ? 'Tiết kiệm' : 'Khả dụng'}
                </span>
              </h3>
              <p className="text-2xl font-bold text-slate-200 mt-2 font-mono">
                {w.balance.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(w)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-[#1a1f2b] rounded-lg transition"
                title="Sửa"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(w.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#1a1f2b] rounded-lg transition"
                title="Xoá"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {wallets.length === 0 && (
          <p className="text-slate-400 font-mono text-center py-8 col-span-3">Chưa có ví nào</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0d121c] border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-950/30">
            <div className="flex justify-between items-center mb-5 border-b border-cyan-500/20 pb-3">
              <h3 className="text-xl font-bold text-cyan-300 font-mono uppercase tracking-widest">
                {editingId ? 'Cập nhật ví' : 'Thêm ví mới'}
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
                <label className="block text-sm font-medium mb-1 text-slate-300">Tên ví</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Số dư</label>
                <CurrencyInput value={balance} onChange={setBalance} required min={0} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Loại ví</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as WalletType)}
                  className={inputClass}
                >
                  <option value="AVAILABLE">Số dư khả dụng</option>
                  <option value="SAVINGS">Số dư tiết kiệm</option>
                </select>
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
    </div>
  );
}
