export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateNetBalance = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

export const calculateCategoryTotal = (transactions, category) => {
  return transactions
    .filter(t => t.category === category && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateCategorySpending = (transactions) => {
  const spending = {};
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      spending[transaction.category] = (spending[transaction.category] || 0) + transaction.amount;
    }
  });
  return spending;
};

export const calculateBudgetStatus = (spent, limit) => {
  if (limit === 0) return 0;
  return Math.min((spent / limit) * 100, 100);
};

export const isBudgetExceeded = (spent, limit) => {
  return spent > limit;
};

export const getMonthTransactions = (transactions, year, month) => {
  // Compare the "YYYY-MM-DD" string's own year/month directly instead of
  // parsing it into a Date object. `new Date('2026-01-01')` is parsed as
  // UTC midnight, which can shift into the wrong month once converted to
  // a negative-UTC-offset local time (e.g. anywhere in the Americas).
  return transactions.filter(t => {
    const [tYear, tMonth] = t.date.split('-').map(Number);
    return tYear === year && tMonth - 1 === month;
  });
};

export const formatDateRange = (year, month) => {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};
