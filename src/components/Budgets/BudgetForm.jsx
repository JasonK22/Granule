import { useContext, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import './BudgetForm.css';

export const BudgetForm = ({ editingCategory, onClose, onSuccess }) => {
  const { state, dispatch } = useContext(BudgetContext);
  const [selectedCategory, setSelectedCategory] = useState(editingCategory || '');
  const [monthlyLimit, setMonthlyLimit] = useState(
    editingCategory ? state.budgets[editingCategory] || '' : ''
  );
  const [errors, setErrors] = useState({});

  const availableCategories = state.categories.filter(
    cat => !state.budgets[cat] || cat === editingCategory
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!selectedCategory) nextErrors.category = 'Pick a category for this budget.';
    const parsedLimit = parseFloat(monthlyLimit);
    if (!monthlyLimit || Number.isNaN(parsedLimit) || parsedLimit <= 0) {
      nextErrors.limit = 'Enter a limit greater than zero.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch({
      type: 'SET_BUDGET',
      payload: { category: selectedCategory, monthlyLimit: parsedLimit },
    });
    onSuccess?.(editingCategory ? 'Budget updated.' : 'Budget saved.');
    onClose();
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setErrors(prev => ({ ...prev, category: null })); }}
          className="form-input"
          disabled={!!editingCategory}
        >
          <option value="">Select a category</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="field-error"><CircleAlert size={13} />{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="limit">Monthly limit</label>
        <input
          id="limit"
          type="number"
          value={monthlyLimit}
          onChange={(e) => { setMonthlyLimit(e.target.value); setErrors(prev => ({ ...prev, limit: null })); }}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="form-input"
        />
        {errors.limit && <span className="field-error"><CircleAlert size={13} />{errors.limit}</span>}
        <span className="field-hint">Spending resets against this limit at the start of every month.</span>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingCategory ? 'Save changes' : 'Add budget'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};
