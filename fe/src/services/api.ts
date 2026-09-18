const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
  getWallets: () => fetchJson<any[]>(`${API_BASE}/wallets`),
  getCategories: () => fetchJson<any[]>(`${API_BASE}/categories`),
  getTransactions: () => fetchJson<any[]>(`${API_BASE}/transactions/all`),
  getBudgets: () => fetchJson<any[]>(`${API_BASE}/budgets`),
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
