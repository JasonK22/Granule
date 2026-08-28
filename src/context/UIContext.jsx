import { createContext, useCallback, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ToastStack } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

// eslint-disable-next-line react-refresh/only-export-components
export const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('granule-sidebar-collapsed', false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  const openAccountCreation = useCallback(() => {
    setAccountMenuOpen(true);
    setAddAccountOpen(true);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        title: options.title || 'Are you sure?',
        danger: options.danger || false,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        resolve,
      });
    });
  }, []);

  const handleConfirmResult = useCallback((result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  }, [confirmState]);

  return (
    <UIContext.Provider
      value={{
        addToast,
        confirm,
        sidebarCollapsed,
        setSidebarCollapsed,
        showOnboarding,
        setShowOnboarding,
        quickAddOpen,
        setQuickAddOpen,
        accountMenuOpen,
        setAccountMenuOpen,
        addAccountOpen,
        setAddAccountOpen,
        openAccountCreation,
      }}
    >
      {children}
      <ToastStack toasts={toasts} onDismiss={removeToast} />
      {confirmState && <ConfirmDialog {...confirmState} onResult={handleConfirmResult} />}
    </UIContext.Provider>
  );
};
