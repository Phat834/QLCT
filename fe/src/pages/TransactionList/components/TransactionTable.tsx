import { Fragment } from 'react';
import type { Transaction } from '../../../contexts/AppContext';
import styles from '../TransactionList.module.css';
import type { TransactionGroup } from '../utils/transactionUtils';
import TransactionRow from './TransactionRow';

type TransactionTableProps = {
  groups: TransactionGroup[];
  expenseByDate: Record<string, number>;
  dayEndBalances: Record<string, number>;
  formatDateWithDay: (date: Date) => string;
  getCategoryName: (categoryId?: string) => string;
  getWalletName: (walletId: string) => string;
  onOpenDetail: (tx: Transaction) => void;
};

export default function TransactionTable({
  groups,
  expenseByDate,
  dayEndBalances,
  formatDateWithDay,
  getCategoryName,
  getWalletName,
  onOpenDetail,
}: TransactionTableProps) {
  const hasTransactions = groups.some((group) => group.items.length > 0);

  if (!hasTransactions) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerContent}>
            <span className={styles.statusDot} />
            <h3 className={styles.cardTitle}>Giao dịch gần đây</h3>
          </div>
        </div>
        <div className={styles.emptyState}>Hiện tại chưa có giao dịch nào để hiển thị</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <span className={styles.statusDot} />
          <h3 className={styles.cardTitle}>Giao dịch gần đây</h3>
        </div>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>Loại</th>
              <th className={styles.headerCell}>Số tiền</th>
              <th className={styles.headerCell}>Danh mục</th>
              <th className={styles.headerCell}>Ví</th>
              <th className={styles.headerCell}>Ghi chú</th>
              <th className={`${styles.headerCell} ${styles.rightCell}`}>Tổng tiêu trong ngày</th>
            </tr>
          </thead>
          <tbody className={styles.body}>
            {groups.map((group) => {
              const expenseTotal = expenseByDate[group.dateKey] || 0;

              return (
                <Fragment key={group.dateKey}>
                  <tr>
                    <td colSpan={6} className={styles.dateCell}>
                      <div className={styles.dateLineTop} />
                      <span className={styles.dateLabel}>{formatDateWithDay(group.date)}</span>
                      <div className={styles.dateLineBottom} />
                    </td>
                  </tr>
                  {group.items.map((tx, txIndex) => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      isLastInGroup={txIndex === group.items.length - 1}
                      expenseTotal={expenseTotal}
                      categoryName={tx.type === 'INCOME'
                        ? 'Tiền vào'
                        : tx.type === 'TRANSFER'
                          ? 'Chuyển ví nội bộ'
                          : getCategoryName(tx.categoryId)}
                      walletName={getWalletName(tx.walletId)}
                      onOpenDetail={onOpenDetail}
                    />
                  ))}
                  <tr>
                    <td colSpan={6} className={styles.balanceRow}>
                      Số dư khả dụng cuối ngày:{' '}
                      <span className={styles.balanceValue}>
                        {dayEndBalances[group.dateKey] !== undefined
                          ? `${dayEndBalances[group.dateKey].toLocaleString('vi-VN')} VNĐ`
                          : '0 VNĐ'}
                      </span>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
