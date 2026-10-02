import { Wallet } from 'lucide-react';
import styles from '../BudgetList.module.css';

type BudgetSummaryProps = {
  totalBalance: number;
};

/**
 * Renders the total wallet balance as a compact inline chip for the page header.
 * It is intentionally not a standalone card - it sits between the title and the
 * "+ Thêm" button so the list below can take the full remaining height.
 */
export default function BudgetSummary({ totalBalance }: BudgetSummaryProps) {
  return (
    <div className={styles.balanceChip}>
      <span className={styles.balanceIcon}>
        <Wallet size={22} />
      </span>
      <span className={styles.balanceText}>
        <span className={styles.balanceLabel}>Tổng số dư</span>
        <span className={styles.balanceValue}>
          {totalBalance.toLocaleString('vi-VN')} VNĐ
        </span>
      </span>
    </div>
  );
}