import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../TransactionList.module.css';
import type { TransactionGroup } from '../utils/transactionUtils';

type PaginationControlsProps = {
  groups: TransactionGroup[];
  currentPage: number;
  totalPages: number;
  formatDateWithDay: (date: Date) => string;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  groups,
  currentPage,
  totalPages,
  formatDateWithDay,
  onPageChange,
}: PaginationControlsProps) {
  const firstDate = groups[0]?.date;
  const lastDate = groups[groups.length - 1]?.date;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={styles.paginationButton}
      >
        <ChevronLeft size={16} /> Trước
      </button>
      <div className={styles.pageInfo}>
        <div className={styles.pageLabel}>Trang {currentPage + 1} / {totalPages}</div>
        {firstDate && lastDate && (
          <div className={styles.pageRange}>
            {formatDateWithDay(firstDate)} → {formatDateWithDay(lastDate)}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={styles.paginationButton}
      >
        Sau <ChevronRight size={16} />
      </button>
    </div>
  );
}
