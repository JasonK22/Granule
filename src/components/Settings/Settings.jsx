import { useContext, useState } from 'react';
import { Plus, X, Sparkles, TriangleAlert, Info, Tags, Coins } from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { UIContext } from '../../context/UIContext';
import { PageHeader } from '../Layout/PageHeader';
import { getCategoryMeta } from '../../utils/categoryMeta';
import { SUPPORTED_CURRENCIES } from '../../utils/currencies';
import './Settings.css';

export const Settings = () => {
  const { state, dispatch } = useContext(BudgetContext);
  const { setShowOnboarding, confirm, addToast } = useContext(UIContext);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (state.categories.includes(trimmed)) {
      addToast(`"${trimmed}" already exists.`, 'error');
      return;
    }
    dispatch({ type: 'ADD_CATEGORY', payload: trimmed });
    addToast(`"${trimmed}" added.`);
    setNewCategory('');
  };

  const handleDeleteCategory = async (category) => {
    const ok = await confirm(
      `Delete "${category}"? Existing transactions keep the label — it just won't be selectable for new ones.`,
      { title: 'Delete category', danger: true, confirmLabel: 'Delete' }
    );
    if (ok) {
      dispatch({ type: 'DELETE_CATEGORY', payload: category });
      addToast(`"${category}" removed.`, 'info');
    }
  };

  const handleCurrencyChange = (e) => {
    dispatch({ type: 'SET_CURRENCY', payload: e.target.value });
    addToast('Currency updated.');
  };

  const handleReplayOnboarding = () => setShowOnboarding(true);

  const handleResetAll = async () => {
    const ok = await confirm(
      'Reset Granule? This permanently deletes every account, transaction, and budget on this device. There\u2019s no undo.',
      { title: 'Reset all data', danger: true, confirmLabel: 'Reset everything' }
    );
    if (ok) {
      dispatch({ type: 'RESET_ALL' });
      localStorage.removeItem('granule-onboarded');
      addToast('Granule has been reset.', 'info');
    }
  };

  return (
    <div className="settings-page">
      <PageHeader
        kicker="PREFERENCES"
        title="Settings"
        subtitle="Shape Granule around the way you think about money."
      />

      <div className="settings-section">
        <div className="section-heading">
          <Coins size={16} />
          <h3>Currency</h3>
        </div>
        <p className="section-description">Amounts across Granule will display in this currency.</p>
        <select value={state.currency} onChange={handleCurrencyChange} className="form-input currency-select">
          {SUPPORTED_CURRENCIES.map(({ code, label }) => (
            <option key={code} value={code}>{code} — {label}</option>
          ))}
        </select>
      </div>

      <div className="settings-section">
        <div className="section-heading">
          <Tags size={16} />
          <h3>Categories</h3>
        </div>
        <p className="section-description">
          Categories group your transactions so charts and budgets know where to sort things.
        </p>

        <div className="category-tags">
          {state.categories.map(category => {
            const { icon: Icon, color } = getCategoryMeta(category);
            return (
              <div key={category} className="category-tag">
                <span className="category-tag-dot" style={{ background: color }}>
                  <Icon size={11} />
                </span>
                {category}
                <button onClick={() => handleDeleteCategory(category)} title={`Delete ${category}`}>
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>

        <form className="add-category-form" onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary" disabled={!newCategory.trim()}>
            <Plus size={15} /> Add
          </button>
        </form>
      </div>

      <div className="settings-section">
        <div className="section-heading">
          <Sparkles size={16} />
          <h3>Welcome guide</h3>
        </div>
        <p className="section-description">Replay the first-run tour of accounts and navigation.</p>
        <button className="btn btn-secondary" onClick={handleReplayOnboarding}>
          Show welcome guide again
        </button>
      </div>

      <div className="settings-section">
        <div className="section-heading">
          <Info size={16} />
          <h3>About</h3>
        </div>
        <p className="about-text">
          Granule is a personal budget tracker that lives entirely on this device — no accounts,
          no servers, no one else sees your numbers. Add what you earn and spend, set limits for
          the categories that matter, and let the dashboard do the arithmetic.
        </p>
        <p className="about-version">Granule &middot; Personal Budget Tracker &middot; v1.0</p>
      </div>

      <div className="settings-section danger-zone">
        <div className="section-heading danger-heading">
          <TriangleAlert size={16} />
          <h3>Danger zone</h3>
        </div>
        <p className="section-description">
          Permanently erase every account, transaction, budget, and category on this device.
        </p>
        <button className="btn btn-danger" onClick={handleResetAll}>
          Reset all data
        </button>
      </div>
    </div>
  );
};
