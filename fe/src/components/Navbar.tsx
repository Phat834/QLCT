import { NavLink } from 'react-router-dom';
import { Wallet, LayoutDashboard, List, PiggyBank, Target, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Giao dịch', icon: List },
  { to: '/wallets', label: 'Ví', icon: Wallet },
  { to: '/categories', label: 'Danh mục', icon: Target },
  { to: '/budgets', label: 'Ngân sách', icon: PiggyBank },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex-shrink-0 h-16 border-b border-[#1a2333] bg-[#0d121c] flex items-center font-sans select-none">
      {/* Brand Header */}
      <div className="px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"></div>
          <span className="font-mono text-xs font-bold tracking-wider text-cyan-400 uppercase">
            FIN-SYSTEM
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex items-center gap-1.5 px-4 overflow-x-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                  : 'text-slate-400 border-transparent hover:bg-white/[0.03] hover:text-slate-200 hover:border-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/20'
                      : 'text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="tracking-wide uppercase">{label}</span>

                {isActive && (
                  <span className="absolute bottom-1.5 right-2.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Theme Toggle */}
      <div className="flex items-center gap-4 px-6">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
              : 'bg-slate-100 text-slate-600 border-gray-300'
          }`}
          title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
