import './PageHeader.css';

export const PageHeader = ({ kicker, title, subtitle, children }) => (
  <div className="page-header">
    <div className="page-header-text">
      <span className="page-header-kicker reveal reveal-1">{kicker}</span>
      <h1 className="page-header-title reveal reveal-2">{title}</h1>
      {subtitle && <p className="page-header-subtitle reveal reveal-3">{subtitle}</p>}
    </div>
    {children && <div className="page-header-actions reveal reveal-3">{children}</div>}
  </div>
);
