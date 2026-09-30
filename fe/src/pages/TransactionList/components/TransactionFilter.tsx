import type { Category } from '../../../contexts/AppContext';
import styles from '../TransactionList.module.css';
import type { TransactionFilterValues } from '../utils/transactionUtils';

type TransactionFilterProps = {
  filters: TransactionFilterValues;
  categories: Category[];
  onChange: <K extends keyof TransactionFilterValues>(
    field: K,
    value: TransactionFilterValues[K]
  ) => void;
  onClear: () => void;
};

export default function TransactionFilter({
  filters,
  categories,
  onChange,
  onClear,
}: TransactionFilterProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <span className={styles.statusDot} />
          <h3 className={styles.cardTitle}>Bộ lọc</h3>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.filterGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Từ ngày</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(event) => onChange('fromDate', event.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Đến ngày</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(event) => onChange('toDate', event.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Loại</label>
            <select
              value={filters.typeFilter}
              onChange={(event) => onChange('typeFilter', event.target.value)}
              className={styles.input}
            >
              <option value="">Tất cả</option>
              <option value="EXPENSE">Chi tiêu</option>
              <option value="INCOME">Thu nhập</option>
              <option value="TRANSFER">Chuyển tiền</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Danh mục</label>
            <select
              value={filters.categoryFilter}
              onChange={(event) => onChange('categoryFilter', event.target.value)}
              className={styles.input}
            >
              <option value="">Tất cả</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.fieldEnd}>
            <button type="button" onClick={onClear} className={styles.clearButton}>
              Xoá lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
