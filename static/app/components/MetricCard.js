'use client';

export default function MetricCard({ title, icon, iconColor = 'cyan', badge, span = 4, children, delayClass = '' }) {
  const accentMap = {
    cyan: 'var(--accent-cyan)',
    violet: 'var(--accent-violet)',
    emerald: 'var(--accent-emerald)',
    amber: 'var(--accent-amber)',
    rose: 'var(--accent-rose)',
  };

  return (
    <div
      className={`metric-card span-${span} fade-in ${delayClass}`}
      style={{ '--card-accent': accentMap[iconColor] || accentMap.cyan }}
    >
      <div className="card-header">
        <div className="card-label">
          <div className={`card-icon ${iconColor}`}>{icon}</div>
          <span className="card-title">{title}</span>
        </div>
        {badge && <span className="card-badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}
