import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import CurrencyInput from '../../../components/CurrencyInput';
import type { Category, Transaction, Wallet } from '../../../contexts/AppContext';
import styles from '../TransactionModal.module.css';
import type { TransactionFormValues } from '../hooks/useTransactionForm';

type TransactionModalProps = {
  form: TransactionFormValues;
  categories: Category[];
  wallets: Wallet[];
  submitting: boolean;
  formError: string;
  onUpdate: <K extends keyof TransactionFormValues>(
    field: K,
    value: TransactionFormValues[K]
  ) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function TransactionModal({
  form,
  categories,
  wallets,
  submitting,
  formError,
  onUpdate,
  onClose,
  onSubmit,
}: TransactionModalProps) {
  const isTransfer = form.type === 'TRANSFER';
  const isExpense = form.type === 'EXPENSE';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Thêm giao dịch mới</h3>
          <button type="button" onClick={onClose} className={styles.iconButton} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Loại giao dịch</label>
            <select
              value={form.type}
              onChange={(event) => onUpdate('type', event.target.value as Transaction['type'])}
              className={styles.input}
            >
              <option value="EXPENSE">Chi tiêu</option>
              <option value="INCOME">Thu nhập</option>
              <option value="TRANSFER">Chuyển tiền</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Số tiền (VNĐ)</label>
            <CurrencyInput
              value={form.amount}
              onChange={(value) => onUpdate('amount', value)}
              required
              min={1}
              className={styles.input}
            />
          </div>
          {isTransfer ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ví nguồn</label>
                <select
                  value={form.fromWalletId}
                  onChange={(event) => onUpdate('fromWalletId', event.target.value)}
                  required
                  className={styles.input}
                >
                  <option value="">Chọn ví...</option>
                  {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ví đích</label>
                <select
                  value={form.toWalletId}
                  onChange={(event) => onUpdate('toWalletId', event.target.value)}
                  required
                  className={styles.input}
                >
                  <option value="">Chọn ví...</option>
                  {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ví</label>
                <select
                  value={form.walletId}
                  onChange={(event) => onUpdate('walletId', event.target.value)}
                  required
                  className={styles.input}
                >
                  <option value="">Chọn ví...</option>
                  {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                </select>
              </div>
              {isExpense && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Danh mục</label>
                  <select
                    value={form.categoryId}
                    onChange={(event) => onUpdate('categoryId', event.target.value)}
                    required
                    className={styles.input}
                  >
                    <option value="">Chọn danh mục...</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </div>
              )}
            </>
          )}
          <div className={styles.formGroup}>
            <label className={styles.label}>Ghi chú</label>
            <input
              type="text"
              value={form.note}
              onChange={(event) => onUpdate('note', event.target.value)}
              className={styles.input}
            />
          </div>
          {formError && <p className={styles.formError}>{formError}</p>}
          <div className={styles.actions}>
            <button type="submit" disabled={submitting} className={styles.submitButton}>
              {submitting ? 'Đang lưu...' : 'Tạo giao dịch'}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
