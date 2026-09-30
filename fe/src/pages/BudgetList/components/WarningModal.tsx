import { AlertTriangle } from 'lucide-react';
import styles from '../BudgetModal.module.css';

type WarningModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function WarningModal({ open, onClose }: WarningModalProps) {
  if (!open) return null;
  return (
    <div className={styles.warningOverlay}>
      <div className={styles.warningModal}>
        <div className={styles.warningIcon}>
          <AlertTriangle className={styles.warningTriangle} />
        </div>
        <p className={styles.warningText}>
          Không thể hoàn tất thao tác. Bạn cần tạo ít nhất 1 ví trước!
        </p>
        <button type="button" onClick={onClose} className={styles.warningButton}>Đóng</button>
      </div>
    </div>
  );
}