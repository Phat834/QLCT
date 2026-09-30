import { useEffect, useMemo, useState } from 'react';
import type { Transaction } from '../../../contexts/AppContext';
import {
  endOfDay,
  filterAndSortTransactions,
  formatDateWithDay,
  getDateFromKey,
  getLocalDayTime,
  groupTransactionsByDate,
  startOfDay,
  startOfWeek,
} from '../utils/transactionUtils';
import type { TransactionFilterValues, TransactionGroup } from '../utils/transactionUtils';

const daysPerPage = 7;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export type TransactionPaginationResult = {
  calendarGroups: TransactionGroup[];
  pagedGroups: TransactionGroup[];
  expenseByDate: Record<string, number>;
  currentPage: number;
  totalPages: number;
  safeCurrentPage: number;
  goToPage: (page: number) => void;
  formatDateWithDay: (date: Date) => string;
  from: Date | null;
};

export function useTransactionPagination(
  transactions: Transaction[],
  filters: TransactionFilterValues
): TransactionPaginationResult {
  const [currentPage, setCurrentPage] = useState(0);
  const { fromDate, toDate, typeFilter, categoryFilter } = filters;

  useEffect(() => {
    setCurrentPage(0);
  }, [fromDate, toDate, typeFilter, categoryFilter]);

  const from = useMemo(() => (fromDate ? startOfDay(fromDate) : null), [fromDate]);
  const to = useMemo(() => (toDate ? endOfDay(toDate) : null), [toDate]);
  const filtered = useMemo(
    () => filterAndSortTransactions(transactions, from, to, typeFilter, categoryFilter),
    [transactions, from, to, typeFilter, categoryFilter]
  );
  const transactionsByDate = useMemo(() => groupTransactionsByDate(filtered), [filtered]);
  const sortedDateKeys = useMemo(() => [...transactionsByDate.keys()].sort(), [transactionsByDate]);
  const firstDate = useMemo(
    () => (sortedDateKeys.length > 0
      ? getDateFromKey(sortedDateKeys[0])
      : from || new Date()),
    [sortedDateKeys, from]
  );
  const lastDate = useMemo(
    () => (sortedDateKeys.length > 0
      ? getDateFromKey(sortedDateKeys[sortedDateKeys.length - 1])
      : firstDate),
    [sortedDateKeys, firstDate]
  );
  const firstPageDate = useMemo(() => startOfWeek(firstDate), [firstDate]);
  const totalDays = Math.max(
    daysPerPage,
    Math.floor((getLocalDayTime(lastDate) - getLocalDayTime(firstPageDate)) / millisecondsPerDay) + 1
  );
  const totalPages = Math.ceil(totalDays / daysPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const calendarGroups = useMemo(() => Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(firstPageDate);
    date.setDate(date.getDate() + index);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return {
      date,
      dateKey,
      items: transactionsByDate.get(dateKey) || [],
    };
  }), [firstPageDate, totalDays, transactionsByDate]);
  const pagedGroups = useMemo(
    () => calendarGroups.slice(safeCurrentPage * daysPerPage, (safeCurrentPage + 1) * daysPerPage),
    [calendarGroups, safeCurrentPage]
  );
  const expenseByDate = useMemo(() => calendarGroups.reduce((map, group) => {
    const total = group.items
      .filter((tx) => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);
    map[group.dateKey] = total;
    return map;
  }, {} as Record<string, number>), [calendarGroups]);
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  return {
    calendarGroups,
    pagedGroups,
    expenseByDate,
    currentPage,
    totalPages,
    safeCurrentPage,
    goToPage,
    formatDateWithDay,
    from,
  };
}
