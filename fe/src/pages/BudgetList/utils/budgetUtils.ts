import type { Budget, Category, Transaction, Wallet } from '../../../contexts/AppContext';

export type BudgetDueStatus = 'normal' | 'warning' | 'danger';

export type BudgetFormValues = {
  categoryId: string;
  walletIds: string[];
  limitAmount: string;
  dueDate: string;
};

export type BudgetCardData = {
  budget: Budget;
  categoryName: string;
  budgetWallets: Wallet[];
  spent: number;
  limitAmount: number;
  pct: number;
  dueStatus: BudgetDueStatus;
};

export function getResetBaseline(budgetId: string): number {
  const stored = localStorage.getItem('budgetReset_' + budgetId);
  return stored ? Number(stored) : 0;
}

export function getActualSpent(
  categoryId: string,
  walletIds: string[] | undefined,
  categories: Category[],
  transactions: Transaction[],
  wallets: Wallet[]
): number {
  const ids = walletIds || [];
  const isSavings = categories.find((category) => category.id === categoryId)?.name.toLowerCase().includes('tiết kiệm');
  if (isSavings) {
    return wallets
      .filter((wallet) => ids.includes(wallet.id))
      .reduce((sum, wallet) => sum + wallet.balance, 0);
  }
  return transactions
    .filter((transaction) => transaction.type === 'EXPENSE'
      && transaction.categoryId === categoryId
      && (ids.length > 0 ? ids.includes(transaction.walletId) : true))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function parseDueDate(dueDate?: string | null): Date | null {
  if (!dueDate) return null;
  const datePart = dueDate.split('T')[0];
  const parts = datePart.split('-').map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function isDueDatePassed(dueDate?: string | null): boolean {
  const date = parseDueDate(dueDate);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() <= today.getTime();
}

export function getDueDateStatus(dueDate?: string | null): BudgetDueStatus {
  const date = parseDueDate(dueDate);
  if (!date) return 'normal';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.ceil((date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (daysUntilDue <= 0) return 'danger';
  if (daysUntilDue <= 6) return 'warning';
  return 'normal';
}

export function formatDueDate(dueDate?: string | null): string {
  const date = parseDueDate(dueDate);
  return date ? date.toLocaleDateString('vi-VN') : '';
}

export function addMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
}

export function formatDueDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function buildBudgetCardData(
  budget: Budget,
  categories: Category[],
  transactions: Transaction[],
  wallets: Wallet[]
): BudgetCardData {
  const category = categories.find((item) => item.id === budget.categoryId);
  const walletIds = budget.walletIds || [];
  const budgetWallets = wallets.filter((wallet) => walletIds.includes(wallet.id));
  const rawSpent = getActualSpent(budget.categoryId, walletIds, categories, transactions, wallets);
  const baseline = getResetBaseline(budget.id);
  const spent = Math.max(0, rawSpent - baseline);
  const pct = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;
  return {
    budget,
    categoryName: category?.name || budget.categoryId,
    budgetWallets,
    spent,
    limitAmount: budget.limitAmount,
    pct,
    dueStatus: getDueDateStatus(budget.dueDate),
  };
}
