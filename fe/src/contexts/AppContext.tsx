import { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

const API_BASE = 'http://localhost:3000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  getWallets: () => fetchJson<Wallet[]>(`${API_BASE}/wallets`),
  getCategories: () => fetchJson<Category[]>(`${API_BASE}/categories`),
  getTransactions: () => fetchJson<Transaction[]>(`${API_BASE}/transactions/all`),
  getBudgets: () => fetchJson<Budget[]>(`${API_BASE}/budgets`),
  getBudgetByCategory: (categoryId: string) =>
    fetchJson<Budget | null>(`${API_BASE}/budgets/category/${categoryId}`),
  createExpense: (body: any) =>
    fetchJson<any>(`${API_BASE}/transactions/expense`, { method: 'POST', body: JSON.stringify(body) }),
  createIncome: (body: any) =>
    fetchJson<any>(`${API_BASE}/transactions/income`, { method: 'POST', body: JSON.stringify(body) }),
  createTransfer: (body: any) =>
    fetchJson<any>(`${API_BASE}/transactions/transfer`, { method: 'POST', body: JSON.stringify(body) }),
};

interface AppContextType {
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  return (
    <AppContext.Provider value={{ wallets, categories, transactions, budgets, loading: initialLoading, error, refetch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
