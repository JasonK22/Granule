import { createContext, useReducer, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const BudgetContext = createContext();

const initialState = {
  accounts: [],
  currentAccountId: null,
  transactions: [],
  budgets: {},
  categories: ['Food', 'Rent', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'],
  currency: 'USD',
  isHydrated: false,
};

const budgetReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'HYDRATE':
      return { ...state, isHydrated: true };

    case 'ADD_ACCOUNT': {
      const newAccount = {
        id: Date.now().toString(),
        name: action.payload.name,
        type: action.payload.type, // 'cash' or 'card'
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        accounts: [...state.accounts, newAccount],
        currentAccountId: newAccount.id,
      };
    }

    case 'DELETE_ACCOUNT': {
      const filteredAccounts = state.accounts.filter(acc => acc.id !== action.payload);
      const newCurrentId = state.currentAccountId === action.payload
        ? filteredAccounts[0]?.id || null
        : state.currentAccountId;
      return {
        ...state,
        accounts: filteredAccounts,
        currentAccountId: newCurrentId,
        transactions: state.transactions.filter(t => t.accountId !== action.payload),
      };
    }

    case 'SET_CURRENT_ACCOUNT':
      return {
        ...state,
        currentAccountId: action.payload,
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          ...state.transactions,
          {
            id: Date.now().toString(),
            accountId: state.currentAccountId,
            ...action.payload,
          },
        ],
      };

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case 'SET_BUDGET':
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.category]: action.payload.monthlyLimit,
        },
      };

    case 'DELETE_BUDGET': {
      const remainingBudgets = { ...state.budgets };
      delete remainingBudgets[action.payload];
      return {
        ...state,
        budgets: remainingBudgets,
      };
    }

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...new Set([...state.categories, action.payload])],
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c !== action.payload),
      };

    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload,
      };

    case 'RESET_ALL':
      return { ...initialState, isHydrated: true };

    default:
      return state;
  }
};

export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Load from localStorage on mount. Saved data is merged over the
  // defaults (not swapped in wholesale) so fields added after a user's
  // first save, like currency, always have a sane value.
  useEffect(() => {
    const savedState = localStorage.getItem('budgetAppState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'SET_STATE', payload: { ...initialState, ...parsed, isHydrated: true } });
      } catch (e) {
        console.error('Failed to load state from localStorage:', e);
        dispatch({ type: 'HYDRATE' });
      }
    } else {
      dispatch({ type: 'HYDRATE' });
    }
  }, []);

  // Save to localStorage on state change, but only once hydration has
  // completed, otherwise the very first render's empty initial state
  // would briefly overwrite whatever was already saved.
  useEffect(() => {
    if (!state.isHydrated) return;
    localStorage.setItem('budgetAppState', JSON.stringify(state));
  }, [state]);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
};
