import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BudgetProvider, BudgetContext } from './context/BudgetContext';
import { UIProvider, UIContext } from './context/UIContext';
import { Sidebar } from './components/Layout/Sidebar';
import { QuickAddButton } from './components/common/QuickAddButton';
import { WelcomeFlow } from './components/Onboarding/WelcomeFlow';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TransactionList } from './components/Transactions/TransactionList';
import { Budgets } from './components/Budgets/Budgets';
import { Settings } from './components/Settings/Settings';
import './App.css';

const ONBOARDED_KEY = 'granule-onboarded';

function AppShell() {
  const { state } = useContext(BudgetContext);
  const { sidebarCollapsed, showOnboarding, setShowOnboarding, quickAddOpen, setQuickAddOpen } = useContext(UIContext);

  // Decide, once state has hydrated from localStorage, whether this is a
  // genuinely first-time visitor (no accounts yet) or a returning user
  // whose data simply predates the onboarding flow.
  useEffect(() => {
    if (!state.isHydrated) return;
    const alreadyOnboarded = localStorage.getItem(ONBOARDED_KEY) === 'true';
    if (alreadyOnboarded) return;

    if (state.accounts.length > 0) {
      localStorage.setItem(ONBOARDED_KEY, 'true');
    } else {
      setShowOnboarding(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isHydrated]);

  // Global "N" shortcut to open the quick-add modal from anywhere,
  // ignored while typing in a field or while another overlay is open.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable;
      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === 'n' && !quickAddOpen && !showOnboarding) {
        e.preventDefault();
        setQuickAddOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [quickAddOpen, showOnboarding, setQuickAddOpen]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDED_KEY, 'true');
    setShowOnboarding(false);
  };

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="grain-overlay" />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <QuickAddButton />
      {showOnboarding && <WelcomeFlow onComplete={handleOnboardingComplete} />}
    </div>
  );
}

function App() {
  return (
    <BudgetProvider>
      <UIProvider>
        <Router>
          <AppShell />
        </Router>
      </UIProvider>
    </BudgetProvider>
  );
}

export default App;
