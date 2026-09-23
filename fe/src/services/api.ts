const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
  getWallets: () =>
    fetchJson<any[]>(`${API_BASE}/wallets`).then((data) =>
      data.map((w: any) => ({
        ...w,
        createdAt: w.createdAt ?? w.created_at,
        walletType: w.walletType ?? w.type,
      }))
    ),
  getCategories: () =>
    fetchJson<any[]>(`${API_BASE}/categories`).then((data) =>
      data.map((c: any) => ({
        ...c,
        createdAt: c.createdAt ?? c.created_at,
      }))
    ),
  getTransactions: () =>
    fetchJson<any[]>(`${API_BASE}/transactions/all`).then((data) =>
      data.map((t: any) => ({
        ...t,
        walletId: t.walletId ?? t.wallet_id,
        categoryId: t.categoryId ?? t.category_id,
        targetWalletId: t.targetWalletId ?? t.target_wallet_id,
        createdAt: t.createdAt ?? t.created_at,
      }))
    ),
  getBudgets: () =>
    fetchJson<any[]>(`${API_BASE}/budgets`).then((data) =>
      data.map((b: any) => ({
        ...b,
        categoryId: b.categoryId ?? b.category_id,
        walletIds: b.walletIds ?? b.wallet_ids,
        limitAmount: b.limitAmount ?? b.limit_amount,
        dueDate: b.dueDate ?? b.due_date,
        createdAt: b.createdAt ?? b.created_at,
      }))
    ),
  getBudgetByCategory: (categoryId: string) => fetchJson<any>(`${API_BASE}/budgets/category/${categoryId}`),
  createExpense: (body: any) =>
    fetchJson<any>(`${API_BASE}/transactions/expense`, { method: 'POST', body: JSON.stringify(body) }),
  createIncome: (body: any) =>
    fetchJson<any>(`${API_BASE}/transactions/income`, { method: 'POST', body: JSON.stringify(body) }),
  createTransfer: (body: any) =>
    fetchJson<any>(`${API_BASE}/transactions/transfer`, { method: 'POST', body: JSON.stringify(body) }),
  createCategory: (body: { id: string; name: string; icon?: string }) =>
    fetchJson<any>(`${API_BASE}/categories`, { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: string, body: { name: string }) =>
    fetchJson<any>(`${API_BASE}/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id: string) =>
    fetchJson<any>(`${API_BASE}/categories/${id}`, { method: 'DELETE' }),
  createWallet: (body: any) =>
    fetchJson<any>(`${API_BASE}/wallets`, { method: 'POST', body: JSON.stringify(body) }),
  updateWallet: (id: string, body: any) =>
    fetchJson<any>(`${API_BASE}/wallets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteWallet: (id: string) =>
    fetchJson<any>(`${API_BASE}/wallets/${id}`, { method: 'DELETE' }),
  createBudget: (body: any) =>
    fetchJson<any>(`${API_BASE}/budgets`, { method: 'POST', body: JSON.stringify(body) }),
  updateBudget: (id: string, body: any) =>
    fetchJson<any>(`${API_BASE}/budgets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBudget: (id: string) =>
    fetchJson<any>(`${API_BASE}/budgets/${id}`, { method: 'DELETE' }),
};
