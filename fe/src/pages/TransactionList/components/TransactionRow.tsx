import type { Transaction } from '../../../contexts/AppContext';
import styles from '../TransactionList.module.css';

type TransactionRowProps = {
  tx: Transaction;
  isLastInGroup: boolean;
  expenseTotal: number;
  categoryName: string;
  walletName: string;
  onOpenDetail: (tx: Transaction) => void;
};

export default function TransactionRow({
  tx,
  isLastInGroup,
  expenseTotal,
  categoryName,
  walletName,
  onOpenDetail,
}: TransactionRowProps) {
  const isIncome = tx.type === 'INCOME';
  const isExpense = tx.type === 'EXPENSE';
  const typeClass = isIncome
    ? styles.typeIncome
    : isExpense
      ? styles.typeExpense
      : styles.typeTransfer;
  const amountClass = isIncome
    ? styles.amountIncome
    : isExpense
      ? styles.amountExpense
      : styles.amountTransfer;
  const amount = isIncome ? '+' : '-';

  return (
    <tr className={styles.row} onClick={() => onOpenDetail(tx)}>
      <td className={styles.cell}>
        <span className={`${styles.typeBadge} ${typeClass}`}>
          {isIncome ? 'Thu nhập' : isExpense ? 'Chi tiêu' : 'Chuyển tiền'}
        </span>
      </td>
      <td className={`${styles.cell} ${styles.amountCell} ${amountClass}`}>
        {amount}{tx.amount.toLocaleString('vi-VN')} <span className={styles.amountUnit}>VNĐ</span>
      </td>
      <td className={`${styles.cell} ${styles.textCell}`}>{categoryName}</td>
      <td className={`${styles.cell} ${styles.textCell}`}>{walletName}</td>
      <td className={`${styles.cell} ${styles.noteCell}`}>{tx.note || '—'}</td>
      <td className={`${styles.cell} ${styles.totalCell}`}>
        {isLastInGroup
          ? expenseTotal > 0
            ? `${expenseTotal.toLocaleString('vi-VN')} VNĐ`
            : '0 VNĐ'
          : '—'}
      </td>
    </tr>
  );
}
