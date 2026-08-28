import { CircleCheck, CircleAlert, Info, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
};

export const ToastStack = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || ICONS.success;
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={17} className="toast-icon" />
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
            <span className="toast-progress" />
          </div>
        );
      })}
    </div>
  );
};
