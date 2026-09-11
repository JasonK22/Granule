import { useContext } from 'react';
import { TrendingUp, TrendingDown, Scale, PiggyBank, Wallet } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';
import { useTransactions } from '../../hooks/useTransactions';
import { useMonthFilter } from '../../hooks/useMonthFilter';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
} from '../../utils/calculations';
import { PageHeader } from '../Layout/PageHeader';
import { MonthSwitcher } from '../common/MonthSwitcher';
import { SummaryCard } from './SummaryCard';
import { SpendingChart } from './SpendingChart';
import { BudgetOverview } from '../Budgets/BudgetOverview';
import './Dashboard.css';

export const Dashboard = () => {
  const { state } = useContext(BudgetContext);
  const { openAccountCreation } = useContext(UIContext);
  const monthFilter = useMonthFilter();
  const { transactions, allTransactions } = useTransactions({ year: monthFilter.year, month: monthFilter.month });

  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netBalance = calculateNetBalance(transactions);
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
  const savingsTone = savingsRate >= 20 ? 'rate-good' : savingsRate >= 0 ? 'rate-ok' : 'rate-bad';

  const currentAccount = state.accounts.find(acc => acc.id === state.currentAccountId);

  if (!currentAccount) {
    return (
      <div className="dashboard">
        <div className="empty-state dashboard-empty">
          <div className="empty-state-icon"><Wallet size={22} /></div>
          <h4>Add your first account to start tracking</h4>
          <p>Give it a name, such as "Checking" or "Cash", whatever fits how you spend, and Granule takes it from there.</p>
          <button className="btn btn-primary" onClick={openAccountCreation}>
            Create account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <PageHeader
        kicker="OVERVIEW"
        title="Dashboard"
        subtitle="A calm, clear view of where your money's been moving."
      >
        <MonthSwitcher
          label={monthFilter.label}
          isCurrent={monthFilter.isCurrent}
          onPrevious={monthFilter.goToPrevious}
          onNext={monthFilter.goToNext}
          onCurrent={monthFilter.goToCurrent}
        />
      </PageHeader>

      <div className="summary-cards">
        <SummaryCard title="Income" amount={totalIncome} type="income" icon={TrendingUp} />
        <SummaryCard title="Expenses" amount={totalExpenses} type="expense" icon={TrendingDown} />
        <SummaryCard
          title="Net balance"
          amount={netBalance}
          type={netBalance >= 0 ? 'positive' : 'negative'}
          icon={Scale}
        />
        <SummaryCard
          title="Savings rate"
          amount={savingsRate}
          type={savingsTone}
          icon={PiggyBank}
          suffix="%"
        />
      </div>

      <div className="dashboard-grid">
        <SpendingChart transactions={transactions} allTransactions={allTransactions} currency={state.currency} />
        <BudgetOverview transactions={transactions} budgets={state.budgets} currency={state.currency} />
      </div>
    </div>
  );
};
