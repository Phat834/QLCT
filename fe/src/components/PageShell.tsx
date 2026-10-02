import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import styles from './PageShell.module.css';

type PageShellProps = {
  title: string;
  count: number;
  onAdd: () => void;
  addLabel?: string;
  /** Rendered between the title and the add button, e.g. a balance chip. */
  headerExtra?: ReactNode;
  children: ReactNode;
};

/**
 * Shared page chrome for the sortable card-list pages (Ví, Ngân sách, Danh mục).
 *
 * All three must share identical box metrics, otherwise switching tabs shifts
 * the layout: the container width, the header height and the gap under the
 * header are all defined here once rather than per page.
 */
export default function PageShell({
  title,
  count,
  onAdd,
  addLabel = 'Thêm',
  headerExtra,
  children,
}: PageShellProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>
            {title}
            <span className={styles.count}>{count}</span>
          </h2>
          {headerExtra}
        </div>
        <button type="button" onClick={onAdd} className={styles.addButton}>
          <Plus size={16} /> {addLabel}
        </button>
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  );
}