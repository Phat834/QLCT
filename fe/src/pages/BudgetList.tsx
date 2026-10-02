import { useApp } from '../contexts/AppContext';
import type { Budget } from '../contexts/AppContext';
import { useCallback } from 'react';
import BudgetCard from './BudgetList/components/BudgetCard';
import BudgetModal from './BudgetList/components/BudgetModal';
import BudgetSummary from './BudgetList/components/BudgetSummary';
import WarningModal from './BudgetList/components/WarningModal';
import { useBudgetAutoReset } from './BudgetList/hooks/useBudgetAutoReset';
import { useBudgetForm } from './BudgetList/hooks/useBudgetForm';
import type { BudgetCardData } from './BudgetList/utils/budgetUtils';
import SortableList from '../components/SortableList';
import { api } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import PageShell from '../components/PageShell';

export default function BudgetList() {
  const { budgets, categories, transactions, wallets, refetch, setBudgets } = useApp();

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
    deleteConfirm,
    closeDeleteConfirm,
    handleDeleteConfirm,
  } = useBudgetForm({ categories, wallets, refetch });

  useBudgetAutoReset({
    budgets,
    categories,
    transactions,
    wallets,
    refetch,
  });

  const handleReorderBudgets = useCallback(async (newBudgets: Budget[]) => {
    // Optimistic update: update UI immediately
    setBudgets(newBudgets);
    
    const items = newBudgets.map((budget, index) => ({ id: budget.id, sortOrder: index }));
    try {
      await api.reorderBudgets(items);
    } catch (err) {
      console.error('Reorder failed:', err);
      // Rollback on error
      await refetch();
    }
  }, [refetch, setBudgets]);

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

  const renderBudgetCard = (budget: Budget) => {
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
  };

  return (
    <PageShell
      title="Ngân sách"
      count={budgets.length}
      onAdd={openAdd}
      headerExtra={<BudgetSummary totalBalance={totalBalance} />}
    >
      <SortableList
        items={budgets}
        getId={(budget) => budget.id}
        renderItem={renderBudgetCard}
        onReorder={handleReorderBudgets}
        emptyMessage="Chưa có ngân sách nào"
      />

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

      <ConfirmModal
        open={deleteConfirm.open}
        title="Xoá ngân sách"
        message="Bạn có chắc chắn muốn xoá ngân sách này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteConfirm}
        confirmText="Xoá"
        cancelText="Hủy"
        variant="danger"
      />
    </PageShell>
  );
}