import { useContext } from 'react';
import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCategoryMeta } from '../../utils/categoryMeta';
import './TransactionItem.css';

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const TransactionItem = ({ transaction, onEdit }) => {
  const { dispatch } = useContext(BudgetContext);
  const { state } = useContext(BudgetContext);
  const { confirm, addToast } = useContext(UIContext);
  const { icon: Icon, color } = getCategoryMeta(transaction.category);
  const isIncome = transaction.type === 'income';

  const handleDelete = async () => {
    const ok = await confirm('Delete this transaction? This can\u2019t be undone.', {
      title: 'Delete transaction',
      danger: true,
      confirmLabel: 'Delete',
    });
    if (ok) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id });
      addToast('Transaction deleted.', 'info');
    }
  };

  return (
    <div className="transaction-item">
      <span className="transaction-icon" style={{ background: color }}>
        <Icon size={15} />
      </span>

      <div className="transaction-details">
        <p className="transaction-description">{transaction.description}</p>
        <div className="transaction-meta">
          <span className="transaction-category">{transaction.category}</span>
          <span className="meta-dot">&middot;</span>
          <span className="transaction-date">{formatDate(transaction.date)}</span>
        </div>
      </div>

      <div className={`transaction-amount ${isIncome ? 'transaction-amount-income' : 'transaction-amount-expense'}`}>
        {isIncome ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, state.currency)}
      </div>

      <div className="transaction-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(transaction.id)} title="Edit transaction">
          <Pencil size={14} />
        </button>
        <button className="action-btn delete-btn" onClick={handleDelete} title="Delete transaction">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
