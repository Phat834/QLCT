import { Wallet } from 'lucide-react';
import styles from '../BudgetList.module.css';

type BudgetSummaryProps = {
  totalBalance: number;
};

export default function BudgetSummary({ totalBalance }: BudgetSummaryProps) {
  return (
    <div className={styles.summaryCard}>
      <div className={styles.summaryContent}>
        <div className={styles.summaryIcon}><Wallet size={24} /></div>
        <div>
          <span className={styles.summaryLabel}>Tổng số dư</span>
          <p className={styles.summaryValue}>
            {totalBalance.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
      </div>
    </div>
  );
}
