import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Target,
  Settings as SettingsIcon,
  Wallet,
  CreditCard,
  ChevronDown,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';
import { GranuleMark } from '../common/GranuleMark';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true, hint: 'Your balance, spending, and budgets at a glance' },
  { to: '/transactions', label: 'Transactions', icon: Receipt, hint: 'Every inflow and outflow you\u2019ve logged' },
  { to: '/budgets', label: 'Budgets', icon: Target, hint: 'Monthly limits per category, tracked automatically' },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, hint: 'Categories, currency, and how Granule behaves' },
];

export const Sidebar = () => {
  const { state, dispatch } = useContext(BudgetContext);
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    accountMenuOpen,
    setAccountMenuOpen,
    addAccountOpen,
    setAddAccountOpen,
    addToast,
    confirm,
  } = useContext(UIContext);

  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('cash');

  const currentAccount = state.accounts.find(acc => acc.id === state.currentAccountId);

  const handleAddAccount = () => {
    if (!newAccountName.trim()) return;
    dispatch({
      type: 'ADD_ACCOUNT',
      payload: { name: newAccountName.trim(), type: newAccountType },
    });
    addToast(`"${newAccountName.trim()}" is ready to track.`);
    setNewAccountName('');
    setNewAccountType('cash');
    setAddAccountOpen(false);
  };

  const handleSwitchAccount = (accountId) => {
    dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accountId });
    setAccountMenuOpen(false);
  };

  const handleDeleteAccount = async (account) => {
    const ok = await confirm(
      `Delete "${account.name}"? This permanently removes the account and every transaction logged under it.`,
      { title: 'Delete account', danger: true, confirmLabel: 'Delete account' }
    );
    if (ok) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: account.id });
      addToast(`"${account.name}" was deleted.`, 'info');
      setAccountMenuOpen(false);
    }
  };

  return (
    <nav className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <GranuleMark size={22} />
            {!sidebarCollapsed && <span className="sidebar-logo-text">GRANULE</span>}
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <div className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, hint }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? label : hint}
            >
              <Icon size={18} className="nav-link-icon" />
              {!sidebarCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-account">
          <div className="account-selector">
            <button
              className="account-button"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              title={currentAccount?.name || 'Select account'}
            >
              {currentAccount?.type === 'card' ? <CreditCard size={16} /> : <Wallet size={16} />}
              {!sidebarCollapsed && (
                <>
                  <span className="account-name">{currentAccount?.name || 'Select account'}</span>
                  <ChevronDown size={14} className="dropdown-arrow" />
                </>
              )}
            </button>

            {accountMenuOpen && (
              <div className="account-menu">
                <div className="account-menu-header">
                  <span>Your accounts</span>
                  <button className="btn-icon" onClick={() => setAccountMenuOpen(false)} aria-label="Close">
                    <X size={14} />
                  </button>
                </div>

                {state.accounts.length === 0 && (
                  <p className="account-menu-empty">No accounts yet. Add one below to start tracking.</p>
                )}

                <div className="account-list">
                  {state.accounts.map(account => (
                    <div key={account.id} className="account-item">
                      <button
                        className={`account-select ${account.id === state.currentAccountId ? 'active' : ''}`}
                        onClick={() => handleSwitchAccount(account.id)}
                      >
                        {account.type === 'card' ? <CreditCard size={15} /> : <Wallet size={15} />}
                        <span>{account.name}</span>
                      </button>
                      {state.accounts.length > 1 && (
                        <button
                          className="account-delete"
                          onClick={() => handleDeleteAccount(account)}
                          title="Delete account"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="account-divider" />

                {!addAccountOpen ? (
                  <button className="add-account-btn" onClick={() => setAddAccountOpen(true)}>
                    + Add account
                  </button>
                ) : (
                  <div className="add-account-form">
                    <input
                      type="text"
                      placeholder="e.g. Checking, Cash, Card"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()}
                      className="account-input"
                      autoFocus
                    />
                    <select
                      value={newAccountType}
                      onChange={(e) => setNewAccountType(e.target.value)}
                      className="account-input"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                    </select>
                    <div className="form-buttons">
                      <button className="btn btn-primary" onClick={handleAddAccount} disabled={!newAccountName.trim()}>
                        Create
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setAddAccountOpen(false);
                          setNewAccountName('');
                          setNewAccountType('cash');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
