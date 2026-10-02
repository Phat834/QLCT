import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
};

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Xoá',
  cancelText = 'Hủy',
  variant = 'danger',
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <AlertTriangle className={styles.icon} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${styles.button} ${styles.confirmButton} ${variant === 'danger' ? styles.danger : styles.warning}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}