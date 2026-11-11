export const COLORS = { High: '#C94C4C', Moderate: '#D69A36', Low: '#287C78' };
export const RISKS = ['High', 'Moderate', 'Low'];

export const RiskBadge = ({ risk = '' }) => (
  <span className={`badge ${risk.toLowerCase()}`}>{risk || 'Unknown'}</span>
);
export const Card = ({ title, right, children, className = '' }) => (
  <section className={`card ${className}`}>
    {(title || right) && <div className="card-head"><h3>{title}</h3>{right}</div>}
    {children}
  </section>
);
export const Stat = ({ icon: Icon, label, value, tone = '' }) => (
  <div className={`stat ${tone}`}>
    <Icon size={20} />
    <div><span className="muted">{label}</span><strong>{value}</strong></div>
  </div>
);
