import './BudgetProgressBar.css';

export const BudgetProgressBar = ({ percentage, exceeded }) => {
  const displayPercentage = Math.min(percentage, 100);

  return (
    <div className={`progress-bar-container ${exceeded ? 'exceeded' : ''}`}>
      <div className="progress-bar">
        <div
          className={`progress-fill ${exceeded ? 'exceeded' : ''}`}
          style={{ width: `${displayPercentage}%` }}
        ></div>
      </div>
      <span className="progress-percentage">{Math.round(displayPercentage)}%</span>
    </div>
  );
};
