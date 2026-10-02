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
  displayFrom: Date | null;
  displayTo: Date | null;
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
  const firstTxDate = useMemo(
    () => (sortedDateKeys.length > 0 ? getDateFromKey(sortedDateKeys[0]) : null),
    [sortedDateKeys]
  );
  const lastTxDate = useMemo(
    () => (sortedDateKeys.length > 0 ? getDateFromKey(sortedDateKeys[sortedDateKeys.length - 1]) : null),
    [sortedDateKeys]
  );

  // Determine the display date range
  // Priority: filter dates > transaction dates > today
  const displayFrom = useMemo(() => {
    if (from) return from;
    if (firstTxDate) return startOfWeek(firstTxDate);
    return startOfWeek(new Date());
  }, [from, firstTxDate]);

  const displayTo = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (to) return to < today ? to : today;
    if (lastTxDate) return lastTxDate > today ? today : lastTxDate;
    return today;
  }, [to, lastTxDate]);

  const firstPageDate = useMemo(() => startOfWeek(displayFrom), [displayFrom]);
  const totalDays = useMemo(() => {
    const diff = getLocalDayTime(displayTo) - getLocalDayTime(firstPageDate);
    return Math.max(daysPerPage, Math.floor(diff / millisecondsPerDay) + 1);
  }, [firstPageDate, displayTo]);
  const totalPages = Math.ceil(totalDays / daysPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const calendarGroups = useMemo(() => {
    const allGroups = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(firstPageDate);
      date.setDate(date.getDate() + index);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return {
        date,
        dateKey,
        items: transactionsByDate.get(dateKey) || [],
      };
    });
    // Filter: only show dates within display range (from filter or transaction bounds)
    return allGroups.filter((group) => {
      const groupTime = getLocalDayTime(group.date);
      const fromTime = getLocalDayTime(displayFrom);
      const toTime = getLocalDayTime(displayTo);
      return groupTime >= fromTime && groupTime <= toTime;
    });
  }, [firstPageDate, totalDays, transactionsByDate, displayFrom, displayTo]);
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
    displayFrom,
    displayTo,
  };
}
