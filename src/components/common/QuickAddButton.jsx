import { useContext } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from './Modal';
import { TransactionForm } from '../Transactions/TransactionForm';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';

export const QuickAddButton = () => {
  const { state } = useContext(BudgetContext);
  const { quickAddOpen, setQuickAddOpen, openAccountCreation, addToast } = useContext(UIContext);

  const hasAccount = Boolean(state.currentAccountId);

  const handleOpen = () => {
    if (!hasAccount) {
      addToast('Add an account first, then you can log transactions.', 'info');
      openAccountCreation();
      return;
    }
    setQuickAddOpen(true);
  };

  return (
    <>
      <button
        className="quick-add-fab"
        onClick={handleOpen}
        aria-label="Add transaction"
        title="Add transaction (press N)"
      >
        <Plus size={24} />
      </button>

      <Modal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        title="Add transaction"
        subtitle="Log what came in or went out. It'll show up on your dashboard instantly."
      >
        <TransactionForm
          onClose={() => setQuickAddOpen(false)}
          onSuccess={(message) => addToast(message)}
        />
      </Modal>
    </>
  );
};
