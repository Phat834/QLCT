import type { Transaction, Wallet } from '../../../contexts/AppContext';

export type TransactionGroup = {
  date: Date;
  dateKey: string;
  items: Transaction[];
};

export type TransactionFilterValues = {
  fromDate: string;
  toDate: string;
  typeFilter: string;
  categoryFilter: string;
};

const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export function getTransactionTime(tx: Transaction): number | null {
  if (!tx.createdAt) return null;
  const timestamp = new Date(tx.createdAt).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function startOfDay(dateStr: string): Date {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(dateStr: string): Date {
  const date = new Date(dateStr);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function getDateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getLocalDayTime(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const daysFromMonday = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - daysFromMonday);
  return result;
}

export function formatDateWithDay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year} - ${weekdays[date.getDay()]}`;
}

export function filterAndSortTransactions(
  transactions: Transaction[],
  from: Date | null,
  to: Date | null,
  typeFilter: string,
  categoryFilter: string
): Transaction[] {
  return [...transactions]
    .filter((tx) => {
      if (!tx.createdAt) return true;
      const date = new Date(tx.createdAt);
      if (from && date < from) return false;
      if (to && date > to) return false;
      if (typeFilter && tx.type !== typeFilter) return false;
      if (categoryFilter && tx.categoryId !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const aTime = getTransactionTime(a);
      const bTime = getTransactionTime(b);
      if (aTime === null && bTime === null) return 0;
      if (aTime === null) return 1;
      if (bTime === null) return -1;
      return aTime - bTime;
    });
}

export function groupTransactionsByDate(transactions: Transaction[]): Map<string, Transaction[]> {
  const groups = new Map<string, Transaction[]>();
  transactions.forEach((tx) => {
    const timestamp = getTransactionTime(tx);
    if (timestamp === null) return;
    const date = new Date(timestamp);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const items = groups.get(dateKey) || [];
    items.push(tx);
    groups.set(dateKey, items);
  });
  return groups;
}

export function calculateDayEndBalances(
  transactions: Transaction[],
  wallets: Wallet[],
  calendarGroups: TransactionGroup[],
  from: Date | null
): Record<string, number> {
  const walletTypes = new Map(wallets.map((wallet) => [wallet.id, wallet.type]));
  const availableBalance = wallets
    .filter((wallet) => wallet.type !== 'SAVINGS')
    .reduce((sum, wallet) => sum + wallet.balance, 0);

  const getAvailableDelta = (tx: Transaction): number => {
    const fromSavings = walletTypes.get(tx.walletId) === 'SAVINGS';
    const toSavings = tx.targetWalletId ? walletTypes.get(tx.targetWalletId) === 'SAVINGS' : false;
    if (tx.type === 'INCOME') return fromSavings ? 0 : tx.amount;
    if (tx.type === 'EXPENSE') return fromSavings ? 0 : -tx.amount;
    return (fromSavings ? 0 : -tx.amount) + (toSavings ? 0 : tx.amount);
  };

  const openingAvailable = availableBalance - transactions.reduce((sum, tx) => sum + getAvailableDelta(tx), 0);
  const allTransactionsSorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  );

  let balanceAtWindowStart = openingAvailable;
  if (from) {
    for (const tx of allTransactionsSorted) {
      if (!tx.createdAt) continue;
      const date = new Date(tx.createdAt);
      if (date >= from) break;
      balanceAtWindowStart += getAvailableDelta(tx);
    }
  }

  const balances: Record<string, number> = {};
  let cumulative = balanceAtWindowStart;
  calendarGroups.forEach((group) => {
    const sortedItems = [...group.items].sort((a, b) => {
      const aTime = getTransactionTime(a);
      const bTime = getTransactionTime(b);
      return (aTime || 0) - (bTime || 0);
    });
    sortedItems.forEach((tx) => {
      cumulative += getAvailableDelta(tx);
    });
    balances[group.dateKey] = cumulative;
  });
  return balances;
}
