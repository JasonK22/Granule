import { useContext, useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';
import { useTransactions } from '../../hooks/useTransactions';
import { useMonthFilter } from '../../hooks/useMonthFilter';
import { PageHeader } from '../Layout/PageHeader';
import { MonthSwitcher } from '../common/MonthSwitcher';
import { Modal } from '../common/Modal';
import { Tip } from '../common/Tip';
import { BudgetForm } from './BudgetForm';
import { BudgetList } from './BudgetList';
import './Budgets.css';

export const Budgets = () => {
  const { state } = useContext(BudgetContext);
  const { openAccountCreation, addToast } = useContext(UIContext);
  const monthFilter = useMonthFilter();
  const { transactions } = useTransactions({ year: monthFilter.year, month: monthFilter.month });

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const currentAccount = state.accounts.find(acc => acc.id === state.currentAccountId);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (!currentAccount) {
    return (
      <div className="budgets-page">
        <div className="empty-state dashboard-empty">
          <div className="empty-state-icon"><Wallet size={22} /></div>
          <h4>Add an account first</h4>
          <p>Budgets live under an account, so create one before setting your first monthly limit.</p>
          <button className="btn btn-primary" onClick={openAccountCreation}>
            Create account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="budgets-page">
      <PageHeader
        kicker="PLANNING"
        title="Budgets"
        subtitle="Set a clear monthly limit for each category, then watch it track itself."
      >
        <MonthSwitcher
          label={monthFilter.label}
          isCurrent={monthFilter.isCurrent}
          onPrevious={monthFilter.goToPrevious}
          onNext={monthFilter.goToNext}
          onCurrent={monthFilter.goToCurrent}
        />
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add budget
        </button>
      </PageHeader>

      {Object.keys(state.budgets).length === 0 && (
        <Tip id="budgets-intro">
          A budget is a recurring monthly cap on a category. Set it once, and Granule measures
          each new month's spending against it from a clean slate.
        </Tip>
      )}

      <BudgetList
        onEdit={handleEdit}
        transactions={transactions}
        budgets={state.budgets}
        currency={state.currency}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingCategory ? `Edit ${editingCategory} budget` : 'New budget'}
        subtitle="Set the monthly limit. Spending against it resets automatically each month."
      >
        <BudgetForm
          editingCategory={editingCategory}
          onClose={handleCloseForm}
          onSuccess={(message) => addToast(message)}
        />
      </Modal>
    </div>
  );
};
