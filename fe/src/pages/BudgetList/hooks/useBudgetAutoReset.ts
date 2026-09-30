import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';
import type { Budget, Category, Transaction, Wallet } from '../../../contexts/AppContext';
import {
  addMonth,
  formatDueDateForApi,
  getActualSpent,
  getResetBaseline,
  isDueDatePassed,
  parseDueDate,
} from '../utils/budgetUtils';

type UseBudgetAutoResetProps = {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  wallets: Wallet[];
  refetch: () => Promise<void>;
};

export function useBudgetAutoReset({
  budgets,
  categories,
  transactions,
  wallets,
  refetch,
}: UseBudgetAutoResetProps) {
  const [, forceRefresh] = useState(0);
  const getBudgetSpent = useCallback((categoryId: string, walletIds?: string[]) => (
    getActualSpent(categoryId, walletIds, categories, transactions, wallets)
  ), [categories, transactions, wallets]);
  const resetBudget = useCallback((budgetId: string, currentSpent: number) => {
    localStorage.setItem('budgetReset_' + budgetId, String(currentSpent));
    forceRefresh((current) => current + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      for (const budget of budgets) {
        const rawSpent = getBudgetSpent(budget.categoryId, budget.walletIds || []);
        const baseline = getResetBaseline(budget.id);
        const spent = Math.max(0, rawSpent - baseline);
        const pct = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;
        const due = isDueDatePassed(budget.dueDate);

        if (pct >= 100 && due && budget.dueDate) {
          const currentDue = parseDueDate(budget.dueDate);
          if (currentDue) {
            const nextDue = addMonth(currentDue);
            resetBudget(budget.id, rawSpent);
            try {
              await api.updateBudget(budget.id, {
                categoryId: budget.categoryId,
                walletIds: budget.walletIds || [],
                limitAmount: budget.limitAmount,
                dueDate: formatDueDateForApi(nextDue),
              });
              if (!mounted) return;
              await refetch();
            } catch (err) {
              console.error('Auto reset budget failed:', err);
            }
          }
        }
      }
    })();
    return () => { mounted = false; };
  }, [budgets, categories, transactions, wallets, refetch, getBudgetSpent, resetBudget]);

  return { resetBudget };
}
