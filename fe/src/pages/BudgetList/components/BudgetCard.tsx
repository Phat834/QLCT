import { Calendar, Pencil, Trash2, Wallet } from 'lucide-react';
import type { Budget } from '../../../contexts/AppContext';
import styles from '../BudgetList.module.css';
import { formatDueDate, type BudgetCardData } from '../utils/budgetUtils';

type BudgetCardProps = {
  data: BudgetCardData;
  onReset: (id: string, spent: number) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
};

export default function BudgetCard({ data, onReset, onEdit, onDelete }: BudgetCardProps) {
  const { budget, categoryName, budgetWallets, spent, limitAmount, pct, dueStatus } = data;
  const progressClass = pct >= 100
    ? styles.progressDanger
    : pct >= 80
      ? styles.progressWarning
      : styles.progressNormal;
  const badgeClass = pct >= 100
    ? styles.badgeDanger
    : pct >= 80
      ? styles.badgeWarning
      : styles.badgeNormal;
  const dueClass = dueStatus === 'danger'
    ? styles.dueDanger
    : dueStatus === 'warning'
      ? styles.dueWarning
      : styles.dueNormal;
  const dueLabel = dueStatus === 'danger'
    ? 'Đến hạn trả:'
    : dueStatus === 'warning'
      ? 'Sắp đến hạn trả:'
      : 'Hẹn trả:';

  return (
    <div className={styles.budgetCard}>
      <div className={styles.cardTop}>
        <div className={styles.cardTitleGroup}>
          <h3 className={styles.cardTitle}>{categoryName}</h3>
          <span className={styles.walletPill}>
            <Wallet size={12} /> {budgetWallets.length > 0 ? budgetWallets.map((wallet) => wallet.name).join(', ') : 'Chưa chọn ví'}
          </span>
          {budget.dueDate && (
            <span className={`${styles.duePill} ${dueClass}`}>
              <Calendar size={12} /> {dueLabel} {formatDueDate(budget.dueDate)}
            </span>
          )}
        </div>
        <div className={styles.cardActions}>
          {pct >= 100 && (
            <button type="button" onClick={() => onReset(budget.id, spent)} className={styles.resetButton} title="Reset về 0">
              Reset
            </button>
          )}
          <button type="button" onClick={() => onEdit(budget)} className={styles.editButton} title="Sửa">
            <Pencil size={16} /> Sửa
          </button>
          <button type="button" onClick={() => onDelete(budget.id)} className={styles.deleteButton} title="Xoá">
            <Trash2 size={16} /> Xoá
          </button>
        </div>
      </div>
      <div className={styles.amountRow}>
        <div className={styles.amountGroup}>
          <span className={styles.spentAmount}>{spent.toLocaleString('vi-VN')}</span>
          <span className={styles.limitAmount}>/ {limitAmount.toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <span className={`${styles.percentageBadge} ${badgeClass}`}>{pct.toFixed(1)}%</span>
      </div>
      <div className={styles.progressTrack}>
        <div className={`${styles.progressFill} ${progressClass}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}
