import { useApp } from '../contexts/AppContext';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { wallets, transactions, loading, error } = useApp();

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (error) return <div className="text-red-600 py-20">Lỗi: {error}</div>;

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Tổng số dư"
          value={totalBalance.toLocaleString('vi-VN') + ' VNĐ'}
          icon={Wallet}
          color="blue"
        />
        <StatCard
          label="Thu nhập"
          value={totalIncome.toLocaleString('vi-VN') + ' VNĐ'}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Chi tiêu"
          value={totalExpense.toLocaleString('vi-VN') + ' VNĐ'}
          icon={TrendingDown}
          color="red"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Giao dịch gần đây</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Số tiền</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ví</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Chưa có giao dịch
                </td>
              </tr>
            ) : (
              transactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.type === 'INCOME'
                          ? 'bg-green-100 text-green-700'
                          : tx.type === 'EXPENSE'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tx.type === 'INCOME' ? 'Thu nhập' : tx.type === 'EXPENSE' ? 'Chi tiêu' : 'Chuyển tiền'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-4 py-3">{tx.walletId}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</td>
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
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
