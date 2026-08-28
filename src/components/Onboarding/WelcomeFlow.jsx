import { useContext, useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Target,
  Settings as SettingsIcon,
  ArrowRight,
  Keyboard,
} from 'lucide-react';
import { BudgetContext } from '../../context/BudgetContext';
import { GranuleMark } from '../common/GranuleMark';
import './WelcomeFlow.css';

const TOUR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', hint: 'Your balance, spending, and budgets at a glance.' },
  { icon: Receipt, label: 'Transactions', hint: 'Every inflow and outflow, searchable and sortable.' },
  { icon: Target, label: 'Budgets', hint: 'A monthly limit per category, tracked automatically.' },
  { icon: SettingsIcon, label: 'Settings', hint: 'Categories, currency, and how Granule behaves.' },
];

export const WelcomeFlow = ({ onComplete }) => {
  const { state, dispatch } = useContext(BudgetContext);
  const [step, setStep] = useState(state.accounts.length > 0 ? 2 : 0);
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('cash');

  const handleCreateAccount = () => {
    if (!accountName.trim()) return;
    dispatch({ type: 'ADD_ACCOUNT', payload: { name: accountName.trim(), type: accountType } });
    setStep(2);
  };

  return (
    <div className="welcome-overlay">
      <div className="welcome-grain" />
      <div className="welcome-glow" />

      <div className="welcome-panel">
        <button className="welcome-skip" onClick={onComplete}>
          Skip intro
        </button>

        <div className="welcome-progress">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`welcome-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="welcome-step reveal reveal-1">
            <div className="welcome-mark"><GranuleMark size={40} /></div>
            <span className="welcome-kicker">WELCOME</span>
            <h1>This is Granule.</h1>
            <p className="welcome-body">
              A personal budget tracker that lives right here on your device — nothing to sync,
              nothing leaves your browser. Let's set up your first account so you can start
              logging what comes in and what goes out.
            </p>
            <button className="btn btn-primary welcome-cta" onClick={() => setStep(1)}>
              Let's go <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="welcome-step reveal reveal-1">
            <span className="welcome-kicker">STEP 1 OF 2</span>
            <h1>Name your first account</h1>
            <p className="welcome-body">
              Accounts keep your money organized — maybe "Cash", "Checking", or "Card".
              You can add more anytime from the account menu in the sidebar.
            </p>
            <div className="welcome-form">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Checking"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
                autoFocus
              />
              <select className="form-input" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>
            <button className="btn btn-primary welcome-cta" onClick={handleCreateAccount} disabled={!accountName.trim()}>
              Create account <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="welcome-step reveal reveal-1">
            <span className="welcome-kicker">STEP 2 OF 2</span>
            <h1>Here's where everything lives</h1>
            <div className="welcome-tour">
              {TOUR_ITEMS.map(({ icon: Icon, label, hint }) => (
                <div key={label} className="welcome-tour-item">
                  <Icon size={17} />
                  <div>
                    <strong>{label}</strong>
                    <span>{hint}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="welcome-shortcut">
              <Keyboard size={15} />
              <span>Press <kbd>N</kbd> anywhere to add a transaction fast.</span>
            </div>
            <button className="btn btn-primary welcome-cta" onClick={onComplete}>
              Enter Granule <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
