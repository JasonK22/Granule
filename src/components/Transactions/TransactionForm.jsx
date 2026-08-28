import { useContext, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import './TransactionForm.css';

function getDefaultFormData() {
  const today = new Date().toISOString().split('T')[0];
  return {
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: today,
  };
}

export const TransactionForm = ({ editingId, onClose, onSuccess }) => {
  const { state, dispatch } = useContext(BudgetContext);
  const [formData, setFormData] = useState(() => {
    if (editingId) {
      const transaction = state.transactions.find(t => t.id === editingId);
      return transaction ? { ...transaction } : getDefaultFormData();
    }
    return getDefaultFormData();
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const nextErrors = {};
    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = 'Enter an amount greater than zero.';
    }
    if (!formData.description.trim()) {
      nextErrors.description = 'Give this transaction a short description.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...formData, amount: parseFloat(formData.amount) };

    if (editingId) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: { id: editingId, data: payload } });
      onSuccess?.('Transaction updated.');
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload });
      onSuccess?.('Transaction added.');
    }

    onClose();
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="form-input"
        />
        {errors.amount && <span className="field-error"><CircleAlert size={13} />{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="form-input"
        >
          {state.categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What was this for?"
          className="form-input"
        />
        {errors.description && <span className="field-error"><CircleAlert size={13} />{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Save changes' : 'Add transaction'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};
