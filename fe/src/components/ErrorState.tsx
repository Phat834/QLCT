import { AlertTriangle } from 'lucide-react';
import styles from './ErrorState.module.css';

type ErrorStateProps = {
  message?: string;
};

export default function ErrorState({ message = 'Không thể tải dữ liệu. Vui lòng thử lại sau.' }: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <AlertTriangle className={styles.icon} />
      </div>
      <p className={styles.text}>{message}</p>
    </div>
  );
}