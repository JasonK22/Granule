import { Target } from 'lucide-react';
import {
  calculateCategoryTotal,
  calculateBudgetStatus,
  isBudgetExceeded,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCategoryMeta } from '../../utils/categoryMeta';
import { BudgetProgressBar } from './BudgetProgressBar';
import './BudgetOverview.css';

export const BudgetOverview = ({ transactions, budgets, currency }) => {
  const scored = Object.entries(budgets)
    .map(([category, limit]) => {
      const spent = calculateCategoryTotal(transactions, category);
      const percentage = calculateBudgetStatus(spent, limit);
      return { category, limit, spent, percentage, exceeded: isBudgetExceeded(spent, limit) };
    })
    // Show whichever budgets need attention first, not insertion order.
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  if (scored.length === 0) {
    return (
      <div className="budget-overview-container">
        <h3>Budget overview</h3>
        <div className="empty-state chart-empty">
          <div className="empty-state-icon"><Target size={20} /></div>
          <h4>No budgets set for this month</h4>
          <p>Set a monthly limit on the Budgets page and your closest-to-the-edge categories will show up here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-overview-container">
      <h3>Budget overview</h3>
      <div className="budget-overview-list">
        {scored.map(({ category, limit, spent, percentage, exceeded }) => {
          const { icon: Icon, color } = getCategoryMeta(category);
          return (
            <div key={category} className="overview-item">
              <div className="overview-header">
                <span className="category-name">
                  <span className="category-dot" style={{ background: color }}>
                    <Icon size={11} />
                  </span>
                  {category}
                </span>
                <span className={`amount ${exceeded ? 'exceeded' : ''}`}>
                  {formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}
                </span>
              </div>
              <BudgetProgressBar percentage={percentage} exceeded={exceeded} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
