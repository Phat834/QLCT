import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useApp } from '../contexts/AppContext';

export default function TransactionForm() {
  const navigate = useNavigate();
  const { wallets, categories, refetch } = useApp();
  const [type, setType] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>('EXPENSE');
  const [id, setId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fromWalletId, setFromWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'EXPENSE') {
        await api.createExpense({ id, walletId, categoryId, amount: Number(amount), note });
      } else if (type === 'INCOME') {
        await api.createIncome({ id, walletId, categoryId, amount: Number(amount), note });
      } else {
        await api.createTransfer({ id, fromWalletId, toWalletId, amount: Number(amount), note });
      }
      await refetch();
      navigate('/transactions');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {type === 'EXPENSE' ? 'Tạo chi tiêu' : type === 'INCOME' ? 'Tạo thu nhập' : 'Chuyển tiền'}
      </h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại giao dịch</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="EXPENSE">Chi tiêu</option>
              <option value="INCOME">Thu nhập</option>
              <option value="TRANSFER">Chuyển tiền</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input value={id} onChange={(e) => setId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="tx_001" />
          </div>

          {type !== 'TRANSFER' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ví</label>
                <select value={walletId} onChange={(e) => setWalletId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Chọn ví...</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name} (SN: {w.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Chọn danh mục...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type === 'TRANSFER' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ví nguồn</label>
                <select value={fromWalletId} onChange={(e) => setFromWalletId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Chọn ví nguồn...</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ví đích</label>
                <select value={toWalletId} onChange={(e) => setToWalletId(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Chọn ví đích...</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min={1} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="50000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Tùy chọn" />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={() => navigate('/transactions')} className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
