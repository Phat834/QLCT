import { Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Budget } from '../contexts/AppContext';
import styles from './BudgetList/BudgetList.module.css';
import BudgetCard from './BudgetList/components/BudgetCard';
import BudgetModal from './BudgetList/components/BudgetModal';
import BudgetSummary from './BudgetList/components/BudgetSummary';
import WarningModal from './BudgetList/components/WarningModal';
import { useBudgetAutoReset } from './BudgetList/hooks/useBudgetAutoReset';
import { useBudgetForm } from './BudgetList/hooks/useBudgetForm';
import type { BudgetCardData } from './BudgetList/utils/budgetUtils';

export default function BudgetList() {
  const { budgets, categories, transactions, wallets, refetch } = useApp();

  const {
    categories: formCategories,
    showModal,
    showWarning,
    editingId,
    form,
    error,
    loading,
    openAdd,
    closeModal,
    closeWarning,
    updateForm,
    handleSubmit,
    handleDelete,
    startEdit,
  } = useBudgetForm({ categories, wallets, refetch });

  useBudgetAutoReset({
    budgets,
    categories,
    transactions,
    wallets,
    refetch,
  });

  const totalBalance = wallets.reduce((sum: number, wallet: { balance: number }) => sum + wallet.balance, 0);

  const buildCardData = (budget: Budget): BudgetCardData => {
    const category = categories.find((item: { id: string; name: string }) => item.id === budget.categoryId);
    const walletIds = budget.walletIds || [];
    const budgetWallets = wallets.filter((wallet: { id: string }) => walletIds.includes(wallet.id));
    const rawSpent = transactions
      .filter((tx: { type: string; categoryId?: string; walletId: string; amount: number }) => tx.type === 'EXPENSE'
        && tx.categoryId === budget.categoryId
        && (walletIds.length > 0 ? walletIds.includes(tx.walletId) : true))
      .reduce((sum: number, tx: { amount: number }) => sum + tx.amount, 0);
    const isSavings = category?.name.toLowerCase().includes('tiết kiệm');
    let spent: number;
    if (isSavings) {
      spent = wallets
        .filter((wallet: { id: string }) => walletIds.includes(wallet.id))
        .reduce((sum: number, wallet: { balance: number }) => sum + wallet.balance, 0);
    } else {
      const baseline = localStorage.getItem('budgetReset_' + budget.id) ? Number(localStorage.getItem('budgetReset_' + budget.id)) : 0;
      spent = Math.max(0, rawSpent - baseline);
    }
    const pct = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;

    let dueStatus: 'normal' | 'warning' | 'danger' = 'normal';
    if (budget.dueDate) {
      const [year, month, day] = budget.dueDate.split('T')[0].split('-').map(Number);
      const dueDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      if (daysUntilDue <= 0) dueStatus = 'danger';
      else if (daysUntilDue <= 6) dueStatus = 'warning';
    }

    return {
      budget,
      categoryName: category?.name || budget.categoryId,
      budgetWallets,
      spent,
      limitAmount: budget.limitAmount,
      pct,
      dueStatus,
    };
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Ngân sách</h2>
        <button type="button" onClick={openAdd} className={styles.addButton}>
          <Plus size={16} /> Thêm
        </button>
      </header>

      <BudgetSummary totalBalance={totalBalance} />

      <div className={styles.cardList}>
        {budgets.map((budget: Budget) => {
          const data = buildCardData(budget);
          return (
            <BudgetCard
              key={budget.id}
              data={data}
              onReset={(id: string, spent: number) => {
                localStorage.setItem('budgetReset_' + id, String(spent));
                window.location.reload();
              }}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          );
        })}
        {budgets.length === 0 && <p className={styles.emptyState}>Chưa có ngân sách nào</p>}
      </div>

      {showModal && (
        <BudgetModal
          form={form}
          categories={formCategories}
          wallets={wallets}
          loading={loading}
          error={error}
          isEditing={!!editingId}
          onUpdate={updateForm}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      <WarningModal open={showWarning} onClose={closeWarning} />
    </div>
  );
}