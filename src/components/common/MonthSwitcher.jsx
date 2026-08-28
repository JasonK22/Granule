import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MonthSwitcher.css';

export const MonthSwitcher = ({ label, isCurrent, onPrevious, onNext, onCurrent }) => (
  <div className="month-switcher">
    <button className="month-switcher-arrow" onClick={onPrevious} aria-label="Previous month">
      <ChevronLeft size={16} />
    </button>
    <span className="month-switcher-label">{label}</span>
    <button className="month-switcher-arrow" onClick={onNext} aria-label="Next month">
      <ChevronRight size={16} />
    </button>
    {!isCurrent && (
      <button className="month-switcher-current" onClick={onCurrent}>
        Today
      </button>
    )}
  </div>
);
