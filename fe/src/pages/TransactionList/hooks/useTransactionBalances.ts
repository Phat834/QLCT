import { useMemo } from 'react';
import type { Transaction, Wallet } from '../../../contexts/AppContext';
import { calculateDayEndBalances } from '../utils/transactionUtils';
import type { TransactionGroup } from '../utils/transactionUtils';

export function useTransactionBalances(
  transactions: Transaction[],
  wallets: Wallet[],
  calendarGroups: TransactionGroup[],
  from: Date | null
) {
  const dayEndBalances = useMemo(
    () => calculateDayEndBalances(transactions, wallets, calendarGroups, from),
    [transactions, wallets, calendarGroups, from]
  );

  return { dayEndBalances };
}
