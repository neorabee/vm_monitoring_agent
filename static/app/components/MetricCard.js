'use client';

export default function MetricCard({
  title,
  icon,
  iconColor = 'cyan',
  badge,
  span = 4,
  children,
  delayClass = '',
  accent,
}) {
  const accentName = accent || iconColor;

  return (
    <div
      className={`metric-card span-${span} fade-in ${delayClass}`}
      data-accent={accentName}
      id={`card-${title?.replace(/\s+/g, '-')?.toLowerCase() || 'default'}`}
    >
      <div className="card-header">
        <div className="card-label">
          <div className={`card-icon ${iconColor}`}>{icon}</div>
          <span className="card-title">{title}</span>
        </div>
        {badge && <span className="card-badge">{badge}</span>}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

