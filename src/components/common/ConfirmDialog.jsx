import { useEffect } from 'react';
import { TriangleAlert, CircleHelp } from 'lucide-react';
import './ConfirmDialog.css';

export const ConfirmDialog = ({ title, message, danger, confirmLabel, cancelLabel, onResult }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onResult(false);
      if (e.key === 'Enter') onResult(true);
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onResult]);

  const Icon = danger ? TriangleAlert : CircleHelp;

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onResult(false);
      }}
    >
      <div className="confirm-panel" role="alertdialog" aria-modal="true">
        <div className={`confirm-icon ${danger ? 'confirm-icon-danger' : ''}`}>
          <Icon size={20} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={() => onResult(false)}>
            {cancelLabel || 'Cancel'}
          </button>
          <button
            className={danger ? 'btn btn-danger confirm-danger-solid' : 'btn btn-primary'}
            onClick={() => onResult(true)}
            autoFocus
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
