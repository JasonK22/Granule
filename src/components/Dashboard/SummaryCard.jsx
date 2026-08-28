import { useContext } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCountUp } from '../../hooks/useCountUp';
import { BudgetContext } from '../../context/BudgetContext';
import './SummaryCard.css';

export const SummaryCard = ({ title, amount, type, icon: Icon, suffix }) => {
  const { state } = useContext(BudgetContext);
  const animatedAmount = useCountUp(amount);

  const display = suffix
    ? `${animatedAmount.toFixed(1)}${suffix}`
    : formatCurrency(animatedAmount, state.currency);

  return (
    <div className={`summary-card summary-card-${type}`}>
      <div className="card-content">
        <div className="card-header">
          <span className="card-icon"><Icon size={18} /></span>
          <h3 className="card-title">{title}</h3>
        </div>
        <div className="card-amount">{display}</div>
      </div>
    </div>
  );
};
