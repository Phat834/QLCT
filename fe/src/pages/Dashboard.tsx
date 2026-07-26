import { useApp } from '../contexts/AppContext';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { wallets, transactions, categories, loading, error } = useApp();

  if (loading) return <div className="text-center py-20 light:text-gray-500 dark:text-gray-400">Đang tải...</div>;
  if (error) return <div className="text-red-600 py-20">Lỗi: {error}</div>;

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || walletId;
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Tổng số dư" value={totalBalance.toLocaleString('vi-VN') + ' VNĐ'} icon={Wallet} color="blue" />
        <StatCard label="Thu nhập" value={totalIncome.toLocaleString('vi-VN') + ' VNĐ'} icon={TrendingUp} color="green" />
        <StatCard label="Chi tiêu" value={totalExpense.toLocaleString('vi-VN') + ' VNĐ'} icon={TrendingDown} color="red" />
      </div>

      <h3 className="text-lg font-semibold light:text-gray-700 dark:text-black-300 mb-4">Giao dịch gần đây</h3>
      <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="light:bg-gray-50 dark:bg-gray-800 border-b light:border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Loại</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Số tiền</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Ví</th>
              <th className="text-left px-4 py-3 font-medium light:text-gray-600 dark:text-gray-400">Danh mục</th>
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
              transactions.slice(0, 10).map((tx) => (
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
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{getWalletName(tx.walletId)}</td>
                  <td className="px-4 py-3 light:text-gray-600 dark:text-gray-400">{getCategoryName(tx.categoryId)}</td>
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

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <div className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <span className="text-sm light:text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold light:text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}