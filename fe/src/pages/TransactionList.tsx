import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Transaction } from '../contexts/AppContext';
import styles from './TransactionList/TransactionList.module.css';
import PaginationControls from './TransactionList/components/PaginationControls';
import TransactionDetailModal from './TransactionList/components/TransactionDetailModal';
import TransactionFilter from './TransactionList/components/TransactionFilter';
import TransactionModal from './TransactionList/components/TransactionModal';
import TransactionTable from './TransactionList/components/TransactionTable';
import { useTransactionForm } from './TransactionList/hooks/useTransactionForm';
import { useTransactionBalances } from './TransactionList/hooks/useTransactionBalances';
import { useTransactionPagination } from './TransactionList/hooks/useTransactionPagination';
import type { TransactionFilterValues } from './TransactionList/utils/transactionUtils';
import ErrorState from '../components/ErrorState';

const emptyFilters: TransactionFilterValues = {
  fromDate: '',
  toDate: '',
  typeFilter: '',
  categoryFilter: '',
};

export default function TransactionList() {
  const { transactions, categories, wallets, loading, error, refetch } = useApp();
  const [filters, setFilters] = useState<TransactionFilterValues>(emptyFilters);
  const [detailModal, setDetailModal] = useState<{ open: boolean; tx: Transaction | null }>({
    open: false,
    tx: null,
  });
  const pagination = useTransactionPagination(transactions, filters);
  const { dayEndBalances } = useTransactionBalances(
    transactions,
    wallets,
    pagination.calendarGroups,
    pagination.from
  );
  const form = useTransactionForm({ refetch });

  const updateFilter = <K extends keyof TransactionFilterValues>(
    field: K,
    value: TransactionFilterValues[K]
  ) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };
  const clearFilters = () => setFilters(emptyFilters);
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    return categories.find((category) => category.id === categoryId)?.name || categoryId;
  };
  const getWalletName = (walletId: string) => {
    return wallets.find((wallet) => wallet.id === walletId)?.name || walletId;
  };
  const openDetail = (tx: Transaction) => setDetailModal({ open: true, tx });
  const closeDetail = () => setDetailModal({ open: false, tx: null });

  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <ErrorState message="Không thể tải danh sách giao dịch khi chưa thực hiện giao dịch nào." />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Giao dịch</h2>
        <button type="button" onClick={form.openModal} className={styles.addButton}>
          <Plus size={16} /> Thêm
        </button>
      </header>

      <TransactionFilter
        filters={filters}
        categories={categories}
        onChange={updateFilter}
        onClear={clearFilters}
      />

      <TransactionTable
        groups={pagination.pagedGroups}
        expenseByDate={pagination.expenseByDate}
        dayEndBalances={dayEndBalances}
        formatDateWithDay={pagination.formatDateWithDay}
        getCategoryName={getCategoryName}
        getWalletName={getWalletName}
        onOpenDetail={openDetail}
      />

      <PaginationControls
        groups={pagination.pagedGroups}
        currentPage={pagination.safeCurrentPage}
        totalPages={pagination.totalPages}
        formatDateWithDay={pagination.formatDateWithDay}
        onPageChange={pagination.goToPage}
      />

      {form.showModal && (
        <TransactionModal
          form={form.form}
          categories={categories}
          wallets={wallets}
          submitting={form.submitting}
          formError={form.formError}
          onUpdate={form.updateForm}
          onClose={form.closeModal}
          onSubmit={form.handleCreateTransaction}
        />
      )}

      {detailModal.open && detailModal.tx && (
        <TransactionDetailModal
          tx={detailModal.tx}
          categories={categories}
          wallets={wallets}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
