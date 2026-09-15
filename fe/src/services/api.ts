import type { Budget, Category, Transaction, Wallet } from '../contexts/AppContext';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://daxton-jasmined-unstubbornly.ngrok-free.dev/api';

type WalletInput = Omit<Wallet, 'createdAt'>;
type WalletUpdateInput = Omit<WalletInput, 'id'>;
type CategoryInput = Pick<Category, 'id' | 'name'> & { icon?: string };
type CategoryUpdateInput = Omit<CategoryInput, 'id'>;
type BudgetInput = Omit<Budget, 'currentSpent'>;
type BudgetUpdateInput = Omit<BudgetInput, 'id'>;
type TransactionInput = {
  id: string;
  walletId: string;
  amount: number;
  categoryId?: string;
  note?: string;
};
type ExpenseInput = TransactionInput & { categoryId: string };
type TransferInput = Omit<TransactionInput, 'walletId' | 'categoryId'> & {
  fromWalletId: string;
  toWalletId: string;
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getWallets: () => fetchJson<Wallet[]>(`${API_BASE}/wallets`),
  getCategories: () => fetchJson<Category[]>(`${API_BASE}/categories`),
  getTransactions: () => fetchJson<Transaction[]>(`${API_BASE}/transactions/all`),
  getBudgets: () => fetchJson<Budget[]>(`${API_BASE}/budgets`),
  getBudgetByCategory: (categoryId: string) =>
    fetchJson<Budget | null>(`${API_BASE}/budgets/category/${encodeURIComponent(categoryId)}`),
  createWallet: (body: WalletInput) =>
    fetchJson<unknown>(`${API_BASE}/wallets`, { method: 'POST', body: JSON.stringify(body) }),
  updateWallet: (id: string, body: WalletUpdateInput) =>
    fetchJson<unknown>(`${API_BASE}/wallets/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteWallet: (id: string) =>
    fetchJson<unknown>(`${API_BASE}/wallets/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createCategory: (body: CategoryInput) =>
    fetchJson<unknown>(`${API_BASE}/categories`, { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: string, body: CategoryUpdateInput) =>
    fetchJson<unknown>(`${API_BASE}/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteCategory: (id: string) =>
    fetchJson<unknown>(`${API_BASE}/categories/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createBudget: (body: BudgetInput) =>
    fetchJson<unknown>(`${API_BASE}/budgets`, { method: 'POST', body: JSON.stringify(body) }),
  updateBudget: (id: string, body: BudgetUpdateInput) =>
    fetchJson<unknown>(`${API_BASE}/budgets/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteBudget: (id: string) =>
    fetchJson<unknown>(`${API_BASE}/budgets/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createExpense: (body: ExpenseInput) =>
    fetchJson<unknown>(`${API_BASE}/transactions/expense`, { method: 'POST', body: JSON.stringify(body) }),
  createIncome: (body: TransactionInput) =>
    fetchJson<unknown>(`${API_BASE}/transactions/income`, { method: 'POST', body: JSON.stringify(body) }),
  createTransfer: (body: TransferInput) =>
    fetchJson<unknown>(`${API_BASE}/transactions/transfer`, { method: 'POST', body: JSON.stringify(body) }),
};
