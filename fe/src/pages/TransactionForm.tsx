import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useApp } from '../contexts/AppContext';

export default function TransactionForm() {
  const navigate = useNavigate();
  const { wallets, categories, refetch } = useApp();
  const [type, setType] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>('EXPENSE');
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
      const id = 'tx_' + Math.random().toString(36).slice(2, 10);
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

  const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';
  const labelClass = 'block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div>
      <h2 className="text-2xl font-bold light:text-gray-800 dark:text-white mb-6">
        {type === 'EXPENSE' ? 'Tạo chi tiêu' : type === 'INCOME' ? 'Tạo thu nhập' : 'Chuyển tiền'}
      </h2>

      <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Loại giao dịch</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className={inputClass}>
              <option value="EXPENSE">Chi tiêu</option>
              <option value="INCOME">Thu nhập</option>
              <option value="TRANSFER">Chuyển tiền</option>
            </select>
          </div>

          {type !== 'TRANSFER' && (
            <>
              <div>
                <label className={labelClass}>Ví</label>
                <select value={walletId} onChange={(e) => setWalletId(e.target.value)} required className={inputClass}>
                  <option value="">Chọn ví...</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Danh mục</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
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
                <label className={labelClass}>Ví nguồn</label>
                <select value={fromWalletId} onChange={(e) => setFromWalletId(e.target.value)} required className={inputClass}>
                  <option value="">Chọn ví nguồn...</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Ví đích</label>
                <select value={toWalletId} onChange={(e) => setToWalletId(e.target.value)} required className={inputClass}>
                  <option value="">Chọn ví đích...</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Số tiền (VNĐ)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min={1} className={inputClass} placeholder="50000" />
          </div>

          <div>
            <label className={labelClass}>Ghi chú</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} placeholder="Tùy chọn" />
          </div>

          {error && <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={() => navigate('/transactions')} className="border light:border-gray-300 dark:border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 light:text-gray-700 dark:text-gray-300">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}