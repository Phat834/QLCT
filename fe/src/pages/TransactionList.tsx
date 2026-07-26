import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Plus } from 'lucide-react';

export default function TransactionList() {
  const { transactions, categories, wallets, loading, error } = useApp();

  if (loading) return <div className="text-center py-20 light:text-gray-600 dark:text-gray-400">Đang tải...</div>;
  if (error) return <div className="text-red-600 py-20">Lỗi: {error}</div>;

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || walletId;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-white">Giao dịch</h2>
        <Link to="/transactions/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm
        </Link>
      </div>

      <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="light:bg-gray-50 dark:bg-gray-800 border-b light:border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Loại</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Số tiền</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Ví</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Ghi chú</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center light:text-gray-400 dark:text-gray-500">Chưa có giao dịch</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b light:border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.type === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      tx.type === 'EXPENSE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {tx.type === 'INCOME' ? 'Thu nhập' : tx.type === 'EXPENSE' ? 'Chi tiêu' : 'Chuyển tiền'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${tx.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{getCategoryName(tx.categoryId)}</td>
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{getWalletName(tx.walletId)}</td>
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{tx.note || '-'}</td>
                  <td className="px-4 py-3 light:text-gray-500 dark:text-gray-500">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}