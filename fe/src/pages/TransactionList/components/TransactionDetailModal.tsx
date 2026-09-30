import { X } from 'lucide-react';
import type { Category, Transaction, Wallet } from '../../../contexts/AppContext';
import styles from '../TransactionModal.module.css';

type TransactionDetailModalProps = {
  tx: Transaction;
  categories: Category[];
  wallets: Wallet[];
  onClose: () => void;
};

const typeLabels: Record<Transaction['type'], string> = {
  INCOME: 'Thu nhập',
  EXPENSE: 'Chi tiêu',
  TRANSFER: 'Chuyển tiền',
};

export default function TransactionDetailModal({
  tx,
  categories,
  wallets,
  onClose,
}: TransactionDetailModalProps) {
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Chưa phân loại';
    return categories.find((category) => category.id === categoryId)?.name || categoryId;
  };
  const getWalletName = (walletId: string) => {
    return wallets.find((wallet) => wallet.id === walletId)?.name || walletId;
  };
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${day}/${month}/${year} - ${weekdays[date.getDay()]} ${hour}:${minute}`;
  };

  const isIncome = tx.type === 'INCOME';
  const isTransfer = tx.type === 'TRANSFER';
  const typeClass = isIncome
    ? styles.typeIncome
    : isTransfer
      ? styles.typeTransfer
      : styles.typeExpense;
  const amountClass = isIncome
    ? styles.detailAmountIncome
    : isTransfer
      ? styles.detailAmountTransfer
      : styles.detailAmountExpense;
  const amountSign = isIncome ? '+' : '-';

  return (
    <div className={styles.overlay}>
      <div className={styles.detailModal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Chi tiết giao dịch</h3>
          <button type="button" onClick={onClose} className={styles.iconButton} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className={styles.detailBody}>
          <div className={styles.detailSummary}>
            <span className={`${styles.typeBadge} ${typeClass}`}>{typeLabels[tx.type]}</span>
            <span className={`${styles.detailAmount} ${amountClass}`}>
              {amountSign}{tx.amount.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label className={styles.detailLabel}>Thời gian</label>
              <p className={styles.detailValue}>{formatDate(tx.createdAt)}</p>
            </div>
            <div className={styles.detailItem}>
              <label className={styles.detailLabel}>{isTransfer ? 'Loại' : 'Danh mục'}</label>
              <p className={styles.detailValue}>
                {isIncome
                  ? 'Tiền vào'
                  : isTransfer
                    ? 'Chuyển ví nội bộ'
                    : getCategoryName(tx.categoryId)}
              </p>
            </div>
            <div className={styles.detailItem}>
              <label className={styles.detailLabel}>{isTransfer ? 'Ví nguồn' : 'Ví'}</label>
              <p className={styles.detailValue}>{getWalletName(tx.walletId)}</p>
            </div>
            {isTransfer && tx.targetWalletId && (
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Ví đích</label>
                <p className={styles.detailValue}>{getWalletName(tx.targetWalletId)}</p>
              </div>
            )}
            <div className={styles.detailItemFull}>
              <label className={styles.detailLabel}>Mã giao dịch</label>
              <p className={styles.transactionId}>{tx.id}</p>
            </div>
          </div>
          <div className={styles.noteSection}>
            <label className={styles.detailLabel}>Ghi chú</label>
            <div className={styles.noteBox}>
              {tx.note && tx.note.trim() ? (
                <p className={styles.noteText}>{tx.note}</p>
              ) : (
                <p className={styles.noteEmpty}>— Không có ghi chú —</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
