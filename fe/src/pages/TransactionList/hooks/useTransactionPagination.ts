import { useEffect, useMemo, useRef, useState } from 'react';
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
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  formatDateWithDay: (date: Date) => string;
  from: Date | null;
  displayFrom: Date | null;
  displayTo: Date | null;
};

export function useTransactionPagination(
  transactions: Transaction[],
  filters: TransactionFilterValues
): TransactionPaginationResult {
  // null = người dùng chưa chọn trang nào -> hệ thống tự động hiển thị
  // trang mới nhất (trang chứa ngày gần nhất).
  const [userSelectedPage, setUserSelectedPage] = useState<number | null>(null);
  const { fromDate, toDate, typeFilter, categoryFilter } = filters;

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

  // Trang hiện hành được suy dẫn đồng bộ ngay trong render: nếu người dùng
  // chưa chọn trang nào (null) thì luôn là trang mới nhất. Không cần effect
  // nhảy trang, không flash, không race condition khi dữ liệu load xong.
  const currentPage =
    userSelectedPage !== null
      ? Math.min(Math.max(0, userSelectedPage), Math.max(0, totalPages - 1))
      : Math.max(0, totalPages - 1);

  // Khi người dùng thay đổi bộ lọc (không phải lần mount đầu), đưa về trang đầu.
  // So sánh với giá trị trước để phân biệt "lần đầu mount" với "bộ lọc thay đổi",
  // tránh effect chạy trên mount ghi đè lên trang mới nhất vừa suy dẫn.
  const prevFilters = useRef({ fromDate, toDate, typeFilter, categoryFilter });
  useEffect(() => {
    const prev = prevFilters.current;
    const changed =
      prev.fromDate !== fromDate ||
      prev.toDate !== toDate ||
      prev.typeFilter !== typeFilter ||
      prev.categoryFilter !== categoryFilter;
    prevFilters.current = { fromDate, toDate, typeFilter, categoryFilter };
    if (changed) {
      setUserSelectedPage(0);
    }
  }, [fromDate, toDate, typeFilter, categoryFilter]);

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
    () => calendarGroups.slice(currentPage * daysPerPage, (currentPage + 1) * daysPerPage),
    [calendarGroups, currentPage]
  );
  const expenseByDate = useMemo(() => calendarGroups.reduce((map, group) => {
    const total = group.items
      .filter((tx) => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);
    map[group.dateKey] = total;
    return map;
  }, {} as Record<string, number>), [calendarGroups]);
  const goToPage = (page: number) => {
    setUserSelectedPage(Math.min(Math.max(0, page), Math.max(0, totalPages - 1)));
  };
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    calendarGroups,
    pagedGroups,
    expenseByDate,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    formatDateWithDay,
    from,
    displayFrom,
    displayTo,
  };
}
