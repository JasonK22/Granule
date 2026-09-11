import { useContext, useMemo } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import { getMonthTransactions } from '../utils/calculations';

/**
 * Returns transactions for the current account. Pass { year, month } to
 * additionally scope the result to that calendar month, used by pages
 * that track spending against a monthly budget.
 */
export const useTransactions = (monthFilter) => {
  const { state } = useContext(BudgetContext);

  const currentAccountTransactions = useMemo(
    () => state.transactions.filter(t => t.accountId === state.currentAccountId),
    [state.transactions, state.currentAccountId]
  );

  // Depend on the primitive year/month rather than the monthFilter object
  // itself, since callers typically pass a freshly-created object each
  // render, using the object would defeat this memoization entirely.
  const scopedTransactions = useMemo(() => {
    if (!monthFilter) return currentAccountTransactions;
    return getMonthTransactions(currentAccountTransactions, monthFilter.year, monthFilter.month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccountTransactions, monthFilter?.year, monthFilter?.month]);

  const transactionsByCategory = useMemo(() => {
    const grouped = {};
    scopedTransactions.forEach(transaction => {
      if (!grouped[transaction.category]) {
        grouped[transaction.category] = [];
      }
      grouped[transaction.category].push(transaction);
    });
    return grouped;
  }, [scopedTransactions]);

  return {
    transactions: scopedTransactions,
    allTransactions: currentAccountTransactions,
    transactionsByCategory,
  };
};
