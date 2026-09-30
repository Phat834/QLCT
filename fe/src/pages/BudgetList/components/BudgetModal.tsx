import type { FormEvent } from 'react';
import CurrencyInput from '../../../components/CurrencyInput';
import { X } from 'lucide-react';
import type { Category, Wallet } from '../../../contexts/AppContext';
import styles from '../BudgetModal.module.css';
import type { BudgetFormValues } from '../utils/budgetUtils';

type BudgetModalProps = {
  form: BudgetFormValues;
  categories: Category[];
  wallets: Wallet[];
  loading: boolean;
  error: string;
  isEditing: boolean;
  onUpdate: <K extends keyof BudgetFormValues>(
    field: K,
    value: BudgetFormValues[K]
  ) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function BudgetModal({
  form,
  categories,
  wallets,
  loading,
  error,
  isEditing,
  onUpdate,
  onClose,
  onSubmit,
}: BudgetModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {isEditing ? 'Cập nhật ngân sách' : 'Thêm ngân sách mới'}
          </h3>
          <button type="button" onClick={onClose} className={styles.iconButton} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Danh mục</label>
            <select
              value={form.categoryId}
              onChange={(event) => onUpdate('categoryId', event.target.value)}
              required
              className={styles.input}
            >
              <option value="">Chọn...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Chọn ví</label>
            <div className={styles.walletList}>
              {wallets.map((wallet) => (
                <label key={wallet.id} className={styles.walletItem}>
                  <input
                    type="checkbox"
                    checked={form.walletIds.includes(wallet.id)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onUpdate('walletIds', [...form.walletIds, wallet.id]);
                      } else {
                        onUpdate('walletIds', form.walletIds.filter((id) => id !== wallet.id));
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span className={styles.walletName}>{wallet.name}</span>
                </label>
              ))}
              {wallets.length === 0 && <p className={styles.noWallets}>Chưa có ví nào</p>}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Hạn mức (VNĐ)</label>
            <CurrencyInput
              value={form.limitAmount}
              onChange={(value) => onUpdate('limitAmount', value)}
              required
              min={1}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày hẹn trả (tuỳ chọn)</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => onUpdate('dueDate', event.target.value)}
              className={styles.input}
            />
          </div>
          {error && <p className={styles.formError}>{error}</p>}
          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Lưu'}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}