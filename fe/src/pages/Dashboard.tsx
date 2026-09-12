import { Fragment } from 'react';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, TrendingDown, Wallet, Layers } from 'lucide-react';

export default function Dashboard() {
  const { wallets, transactions, categories, budgets, loading, error } = useApp();

  if (loading) return <div className="text-center py-20 text-cyan-400 font-mono tracking-wider animate-pulse">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-400 py-20 font-mono text-center">Lỗi: {error}</div>;

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsWalletIds = new Set<string>();
  budgets.forEach((b) => {
    const catName = categories.find((c) => c.id === b.categoryId)?.name || '';
    if (catName.toLowerCase().includes('tiết kiệm')) {
      b.walletIds.forEach((wid) => savingsWalletIds.add(wid));
    }
  });

  const savingsBalance = wallets
    .filter((w) => savingsWalletIds.has(w.id))
    .reduce((sum, w) => sum + w.balance, 0);
  const availableBalance = wallets
    .filter((w) => !savingsWalletIds.has(w.id))
    .reduce((sum, w) => sum + w.balance, 0);

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || walletId;
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  const recentTransactions = transactions.slice(0, 10);

  const grouped = recentTransactions.reduce((groups, tx) => {
    const dateKey = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : 'Không rõ ngày';
    const last = groups[groups.length - 1];
    if (last && last.date === dateKey) {
      last.items.push(tx);
    } else {
      groups.push({ date: dateKey, items: [tx] });
    }
    return groups;
  }, [] as { date: string; items: typeof recentTransactions }[]);

  const expenseByDate = grouped.reduce((map, group) => {
    const total = group.items
      .filter((tx) => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);
    map[group.date] = total;
    return map;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans">
      {/* Grid thẻ thông số Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Số dư khả dụng"
          value={availableBalance.toLocaleString('vi-VN')}
          unit="VNĐ"
          icon={Wallet}
          theme="blue"
        />
        <StatCard
          label="Số dư tiết kiệm"
          value={savingsBalance.toLocaleString('vi-VN')}
          unit="VNĐ"
          icon={Layers}
          theme="purple"
        />
        <StatCard
          label="Tổng thu nhập"
          value={totalIncome.toLocaleString('vi-VN')}
          unit="VNĐ"
          icon={TrendingUp}
          theme="teal"
        />
        <StatCard
          label="Tổng chi tiêu"
          value={totalExpense.toLocaleString('vi-VN')}
          unit="VNĐ"
          icon={TrendingDown}
          theme="rose"
        />
      </div>

      {/* Transaction Records Container */}
      <div className="border border-cyan-500/30 bg-[#0d121c]/90 rounded-2xl shadow-xl shadow-cyan-950/20 overflow-hidden backdrop-blur-md">
        <div className="flex items-center px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
            <h3 className="font-mono uppercase tracking-widest text-sm font-semibold text-cyan-300">Giao dịch gần đây</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 font-mono text-xs uppercase bg-[#111827]/60">
                <th className="py-3 px-5">Loại</th>
                <th className="py-3 px-5">Số tiền</th>
                <th className="py-3 px-5">Ví nguồn</th>
                <th className="py-3 px-5">Danh mục</th>
                <th className="py-3 px-5">Ghi chú</th>
                <th className="py-3 px-5 text-right">Tổng tiêu trong ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-mono">
                    Chưa có giao dịch nào
                  </td>
                </tr>
              ) : (
                grouped.map((group) => (
                  <Fragment key={group.date}>
                    <tr>
                      <td colSpan={6} className="px-5 py-1">
                        <div className="border-t-2 border-cyan-500/30 my-1"></div>
                        <span className="font-mono text-[15px] font-semibold text-cyan-300 uppercase tracking-wider">
                          {group.date}
                        </span>
                        <div className="border-b border-cyan-500/10 mt-1"></div>
                      </td>
                    </tr>
                    {group.items.map((tx, txIndex) => {
                      const isIncome = tx.type === 'INCOME';
                      const isExpense = tx.type === 'EXPENSE';
                      const isLastInGroup = txIndex === group.items.length - 1;

                      return (
                        <tr key={tx.id} className="hover:bg-cyan-500/[0.04] transition-colors group">
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border ${
                                isIncome
                                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                                  : isExpense
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                              }`}
                            >
                              {isIncome ? 'Thu nhập' : isExpense ? 'Chi tiêu' : 'Chuyển tiền'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-mono font-semibold whitespace-nowrap">
                            <span className={isIncome ? 'text-teal-400' : isExpense ? 'text-rose-400' : 'text-cyan-400'}>
                              {isIncome ? '+' : '-'}
                              {tx.amount.toLocaleString('vi-VN')} <span className="text-[11px] text-slate-400">VNĐ</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-300 font-medium whitespace-nowrap">{getWalletName(tx.walletId)}</td>
                          <td className="py-3.5 px-5 text-slate-400 whitespace-nowrap">
                            {tx.type === 'INCOME'
                              ? 'Tiền vào'
                              : tx.type === 'TRANSFER'
                              ? 'Chuyển ví nội bộ'
                              : getCategoryName(tx.categoryId)}
                          </td>
                          <td className="py-3.5 px-5 text-slate-300 text-[15px] max-w-xs truncate">{tx.note || '—'}</td>
                          <td className="py-3.5 px-5 font-mono text-[15px] text-rose-400 text-right whitespace-nowrap">
                            {isLastInGroup
                              ? expenseByDate[group.date] > 0
                                ? `${expenseByDate[group.date].toLocaleString('vi-VN')} VNĐ`
                                : '0 VNĐ'
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  subText,
  icon: Icon,
  theme,
}: {
  label: string;
  value: string;
  unit: string;
  subText?: string;
  icon: any;
  theme: 'blue' | 'purple' | 'teal' | 'rose';
}) {
  const themes = {
    blue: {
      cardBg: 'from-[#101e38] via-[#0d1525] to-[#090d15]',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      iconBox: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      accentText: 'text-cyan-400',
    },
    purple: {
      cardBg: 'from-[#25123d] via-[#160c26] to-[#090d15]',
      border: 'border-purple-500/40 hover:border-purple-400',
      iconBox: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      accentText: 'text-purple-400',
    },
    teal: {
      cardBg: 'from-[#0b2b29] via-[#0b1c1d] to-[#090d15]',
      border: 'border-teal-500/40 hover:border-teal-400',
      iconBox: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      accentText: 'text-teal-400',
    },
    rose: {
      cardBg: 'from-[#381123] via-[#210c17] to-[#090d15]',
      border: 'border-rose-500/40 hover:border-rose-400',
      iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      accentText: 'text-rose-400',
    },
  };

  const style = themes[theme];

  return (
    <div
      className={`relative bg-gradient-to-r ${style.cardBg} border ${style.border} rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-cyan-950/40 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-slate-200 text-sm tracking-wide">{label}</h4>
          <div className={`p-1.5 rounded-lg border ${style.iconBox}`}>
            <Icon size={16} />
          </div>
        </div>
        {subText && <p className="text-[11px] text-slate-400 mb-4">{subText}</p>}
      </div>

      <div className="pt-2 border-t border-white/5 flex items-baseline gap-1">
        <span className={`font-mono text-xl md:text-2xl font-black ${style.accentText}`}>{value}</span>
        <span className="font-mono text-xs text-slate-400 font-semibold">{unit}</span>
      </div>
    </div>
  );
}