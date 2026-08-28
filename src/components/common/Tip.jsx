import { Lightbulb, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './Tip.css';

export const Tip = ({ id, children }) => {
  const [dismissed, setDismissed] = useLocalStorage(`granule-tip-${id}`, false);

  if (dismissed) return null;

  return (
    <div className="tip-card reveal reveal-4">
      <Lightbulb size={16} className="tip-icon" />
      <p>{children}</p>
      <button className="tip-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss tip">
        <X size={14} />
      </button>
    </div>
  );
};
