import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Plus } from 'lucide-react';

export default function TransactionList() {
  const { transactions, loading, error } = useApp();

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (error) return <div className="text-red-600 py-20">Lỗi: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Giao dịch</h2>
        <Link to="/transactions/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Số tiền</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ví</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Chưa có giao dịch</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.type === 'INCOME' ? 'bg-green-100 text-green-700' :
                      tx.type === 'EXPENSE' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {tx.type === 'INCOME' ? 'Thu nhập' : tx.type === 'EXPENSE' ? 'Chi tiêu' : 'Chuyển tiền'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-4 py-3">{tx.categoryId || '-'}</td>
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
