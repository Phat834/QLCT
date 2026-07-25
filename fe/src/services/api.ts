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
};