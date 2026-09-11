import { useContext, useMemo, useState } from 'react';
import { Plus, Receipt, Wallet, FilterX } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';
import { useTransactions } from '../../hooks/useTransactions';
import { PageHeader } from '../Layout/PageHeader';
import { Modal } from '../common/Modal';
import { TransactionForm } from './TransactionForm';
import { TransactionItem } from './TransactionItem';
import './TransactionList.css';

const DEFAULT_FILTERS = { type: 'all', category: 'all', sort: 'date-desc' };

export const TransactionList = () => {
  const { state } = useContext(BudgetContext);
  const { openAccountCreation, addToast } = useContext(UIContext);
  const { transactions } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const currentAccount = state.accounts.find(acc => acc.id === state.currentAccountId);

  const filtersActive = filters.type !== 'all' || filters.category !== 'all';

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    result.sort((a, b) => {
      switch (filters.sort) {
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        case 'date-desc':
        default: return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }, [transactions, filters]);

  const handleEdit = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  if (!currentAccount) {
    return (
      <div className="transactions-page">
        <div className="empty-state dashboard-empty">
          <div className="empty-state-icon"><Wallet size={22} /></div>
          <h4>Add an account first</h4>
          <p>Transactions are logged under an account. Create one to start your ledger.</p>
          <button className="btn btn-primary" onClick={openAccountCreation}>
            Create account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <PageHeader
        kicker="ACTIVITY"
        title="Transactions"
        subtitle="Every inflow and outflow, clearly accounted for."
      >
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add transaction
        </button>
      </PageHeader>

      <div className="transactions-filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="form-input filter-select"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="form-input filter-select"
        >
          <option value="all">All categories</option>
          {state.categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          className="form-input filter-select"
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>

        {filtersActive && (
          <button className="btn-icon clear-filters" onClick={() => setFilters(DEFAULT_FILTERS)} title="Clear filters">
            <FilterX size={15} /> Clear
          </button>
        )}
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Receipt size={22} /></div>
          {filtersActive ? (
            <>
              <h4>No transactions match these filters</h4>
              <p>Try widening the type or category filter, or clear them to see everything.</p>
              <button className="btn btn-secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear filters
              </button>
            </>
          ) : (
            <>
              <h4>Nothing logged yet</h4>
              <p>Add your first transaction to start building your ledger.</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Add transaction
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="transaction-list card-surface">
          {filteredTransactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingId ? 'Edit transaction' : 'Add transaction'}
        subtitle="Log what came in or went out. It'll show up on your dashboard instantly."
      >
        <TransactionForm
          editingId={editingId}
          onClose={handleCloseForm}
          onSuccess={(message) => addToast(message)}
        />
      </Modal>
    </div>
  );
};
