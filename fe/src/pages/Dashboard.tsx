import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, TrendingDown, Wallet, Layers, Calendar, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const { wallets, transactions, categories, loading, error } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || walletId;
  };

  const monthExpenses = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return transactions.filter((tx) => {
      if (tx.type !== 'EXPENSE' || !tx.createdAt) return false;
      const d = new Date(tx.createdAt);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }, [transactions, selectedMonth]);

  const totalMonthExpense = monthExpenses.reduce((sum, tx) => sum + tx.amount, 0);

  const expensesByCategory = useMemo(() => {
    const map = new Map<string, number>();
    monthExpenses.forEach((tx) => {
      const catName = !tx.categoryId
        ? 'Chưa phân loại'
        : (categories.find((c) => c.id === tx.categoryId)?.name || tx.categoryId);
      map.set(catName, (map.get(catName) || 0) + tx.amount);
    });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [monthExpenses, categories]);

  const topExpense = expensesByCategory.length > 0 ? expensesByCategory[0] : null;

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const expensesByCategoryDetail = useMemo(() => {
    const map = new Map<string, typeof monthExpenses>();
    monthExpenses.forEach((tx) => {
      const catName = !tx.categoryId
        ? 'Chưa phân loại'
        : (categories.find((c) => c.id === tx.categoryId)?.name || tx.categoryId);
      if (!map.has(catName)) map.set(catName, []);
      map.get(catName)!.push(tx);
    });
    // Sort transactions within each category by date (newest first)
    map.forEach((txs) => txs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
    return map;
  }, [monthExpenses, categories]);

  if (loading) return <div className="text-center py-20 text-cyan-400 font-mono tracking-wider animate-pulse">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-400 py-20 font-mono text-center">Lỗi: {error}</div>;

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsBalance = wallets
    .filter((w) => w.type === 'SAVINGS')
    .reduce((sum, w) => sum + w.balance, 0);
  const availableBalance = wallets
    .filter((w) => w.type !== 'SAVINGS')
    .reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-white p-6 font-sans">
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

      {/* Chi tiêu trong tháng */}
      <div className="border border-cyan-500/30 bg-[var(--bg-card-overlay)] rounded-2xl shadow-xl shadow-cyan-950/20 overflow-hidden backdrop-blur-md mb-8">
        <div className="flex items-center px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
            <h3 className="font-mono uppercase tracking-widest text-sm font-semibold text-cyan-300">Chi tiêu trong tháng</h3>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-200">
              <Calendar size={16} className="text-cyan-400" />
              Chọn tháng:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-700 rounded-lg px-3 py-2 bg-[#0d131f] text-white font-sans focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="mb-6">
            <span className="font-mono text-sm text-slate-300 uppercase">Tổng chi tiêu: </span>
            <span className="font-mono text-2xl font-bold text-rose-400">
              {totalMonthExpense.toLocaleString('vi-VN')} VNĐ
            </span>
            {topExpense && (
              <span className="ml-3 font-mono text-[15px] text-slate-300">
                (cao nhất: {topExpense.name} - {topExpense.total.toLocaleString('vi-VN')} VNĐ)
              </span>
            )}
          </div>

          {expensesByCategory.length === 0 ? (
            <p className="text-slate-400 font-mono text-center py-8">Chưa có chi tiêu nào trong tháng này</p>
          ) : (
            <div className="space-y-3">
              {expensesByCategory.map((cat, idx) => {
                const pct = totalMonthExpense > 0 ? (cat.total / totalMonthExpense) * 100 : 0;
                const isHighest = idx === 0;
                const isExpanded = expandedCategory === cat.name;
                const detailTxs = expensesByCategoryDetail.get(cat.name) || [];

                return (
                  <div key={cat.name} className="space-y-1">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-cyan-500/[0.04] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-mono ${isHighest ? 'text-rose-400' : 'text-white'}`}>
                          {cat.name}
                        </span>
                        {isHighest && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">
                            cao nhất
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-mono font-semibold ${isHighest ? 'text-rose-400' : 'text-slate-200'}`}>
                          {cat.total.toLocaleString('vi-VN')} VNĐ ({pct.toFixed(1)}%)
                        </span>
                        <span className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown size={18} />
                        </span>
                      </div>
                    </button>

                    <div className="w-full bg-[#0d131f] rounded-full h-3 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all ${isHighest ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]' : 'bg-cyan-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {isExpanded && detailTxs.length > 0 && (
                      <div className="mt-2 ml-4 pl-4 border-l border-cyan-500/20 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {detailTxs.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between py-2 px-3 bg-[#080c14] rounded-lg hover:bg-cyan-500/[0.04] transition-colors"
                          >
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-mono text-rose-400 font-semibold whitespace-nowrap">
                                  -{tx.amount.toLocaleString('vi-VN')} VNĐ
                                </span>
                                <span className="text-[13px] text-slate-200">
                                  {getWalletName(tx.walletId)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[12px] text-slate-400">
                                <Calendar size={12} />
                                <span>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : '—'}</span>
                                {tx.note && (
                                  <>
                                    <span className="text-cyan-500/60">•</span>
                                    <span className="truncate max-w-xs">{tx.note}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  theme,
}: {
  label: string;
  value: string;
  unit: string;
  icon: any;
  theme: 'blue' | 'purple' | 'teal' | 'rose';
}) {
  const gradVars = {
    blue: { from: '--grad-blue-from', via: '--grad-blue-via', to: '--grad-blue-to' },
    purple: { from: '--grad-purple-from', via: '--grad-purple-via', to: '--grad-purple-to' },
    teal: { from: '--grad-teal-from', via: '--grad-teal-via', to: '--grad-teal-to' },
    rose: { from: '--grad-rose-from', via: '--grad-rose-via', to: '--grad-rose-to' },
  };

  const accentMap = {
    blue: { border: 'border-cyan-500/40', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    purple: { border: 'border-purple-500/40', text: 'text-purple-400', bg: 'bg-purple-500/10' },
    teal: { border: 'border-teal-500/40', text: 'text-teal-400', bg: 'bg-teal-500/10' },
    rose: { border: 'border-rose-500/40', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  };

  const { from, via, to } = gradVars[theme];
  const accent = accentMap[theme];

  return (
    <div
      className={`relative bg-gradient-to-r from-[var(${from})] via-[var(${via})] to-[var(${to})] border ${accent.border} rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-cyan-950/40 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-white text-sm tracking-wide">{label}</h4>
          <div className={`p-1.5 rounded-lg border ${accent.bg} ${accent.text} border-cyan-500/30`}>
            <Icon size={16} />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-baseline gap-1">
        <span className={`font-mono text-xl md:text-2xl font-black ${accent.text}`}>{value}</span>
        <span className="font-mono text-xs font-semibold text-slate-300">{unit}</span>
      </div>
    </div>
  );
}