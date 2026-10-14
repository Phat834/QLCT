import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export type WalletType = 'AVAILABLE' | 'SAVINGS';

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  type: WalletType;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  categoryId?: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  targetWalletId?: string;
  note?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  walletIds: string[];
  limitAmount: number;
  currentSpent: number;
  dueDate?: string | null;
}

export interface ApiError {
  error: string;
}

interface AppContextType {
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const [w, c, t, b] = await Promise.all([
        api.getWallets(),
        api.getCategories(),
        api.getTransactions(),
        api.getBudgets(),
      ]);
      setWallets(w);
      setCategories(c);
      setTransactions(t);
      setBudgets(b);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // 1. Tải dữ liệu lần đầu khi mở app
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [w, c, t, b] = await Promise.all([
          api.getWallets(),
          api.getCategories(),
          api.getTransactions(),
          api.getBudgets(),
        ]);
        if (!cancelled) {
          setWallets(w);
          setCategories(c);
          setTransactions(t);
          setBudgets(b);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // 2. Lắng nghe sự kiện Real-time (SSE) từ Backend
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const eventSource = new EventSource(`${API_BASE}/events`);

    eventSource.onmessage = () => {
      // Hễ Backend báo có thay đổi (từ điện thoại hoặc thiết bị khác) -> tải lại dữ liệu ngầm
      refetch();
    };

    // Tự động đồng bộ lại khi người dùng quay lại tab web hoặc mở sáng màn hình điện thoại
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', refetch);

    return () => {
      eventSource.close();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refetch);
    };
  }, [refetch]);

  return (
    <AppContext.Provider value={{ wallets, categories, transactions, budgets, loading: initialLoading, error, refetch, setWallets, setCategories, setBudgets }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}