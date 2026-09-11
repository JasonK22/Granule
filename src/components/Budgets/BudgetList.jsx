import { useContext } from 'react';
import { Pencil, Trash2, Target } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';
import {
  calculateCategoryTotal,
  calculateBudgetStatus,
  isBudgetExceeded,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCategoryMeta } from '../../utils/categoryMeta';
import { BudgetProgressBar } from './BudgetProgressBar';
import './BudgetList.css';

export const BudgetList = ({ onEdit, transactions, budgets, currency }) => {
  const { dispatch } = useContext(BudgetContext);
  const { confirm, addToast } = useContext(UIContext);

  const handleDeleteBudget = async (category) => {
    const ok = await confirm(
      `Remove the budget for "${category}"? Your spending history stays. The monthly limit just goes away.`,
      { title: 'Remove budget', danger: true, confirmLabel: 'Remove budget' }
    );
    if (ok) {
      dispatch({ type: 'DELETE_BUDGET', payload: category });
      addToast(`Budget for "${category}" removed.`, 'info');
    }
  };

  if (Object.keys(budgets).length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Target size={22} /></div>
        <h4>No budgets yet</h4>
        <p>Pick a category and set a monthly limit. Granule tracks your spending against it automatically.</p>
      </div>
    );
  }

  return (
    <div className="budget-list">
      {Object.entries(budgets).map(([category, limit]) => {
        const spent = calculateCategoryTotal(transactions, category);
        const percentage = calculateBudgetStatus(spent, limit);
        const exceeded = isBudgetExceeded(spent, limit);
        const remaining = limit - spent;
        const { icon: Icon, color } = getCategoryMeta(category);

        return (
          <div key={category} className={`budget-item ${exceeded ? 'exceeded' : ''}`}>
            <div className="budget-header">
              <div className="budget-category">
                <span className="category-dot" style={{ background: color }}>
                  <Icon size={13} />
                </span>
                <div>
                  <h3>{category}</h3>
                  <p className="budget-amounts">
                    {formatCurrency(spent, currency)} of {formatCurrency(limit, currency)}
                    {exceeded && (
                      <span className="exceeded-label"> - over by {formatCurrency(Math.abs(remaining), currency)}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="budget-actions">
                <button className="action-btn edit-btn" onClick={() => onEdit(category)} title="Edit budget">
                  <Pencil size={15} />
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteBudget(category)} title="Remove budget">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <BudgetProgressBar percentage={percentage} exceeded={exceeded} />
          </div>
        );
      })}
    </div>
  );
};
