'use client';

export default function ProgressBar({ percentage = 0, usedLabel, totalLabel, color = 'var(--accent-cyan)' }) {
  const clamped = Math.min(100, Math.max(0, percentage));

  const getGradient = () => {
    if (clamped > 90) return `linear-gradient(90deg, var(--accent-rose), #ff6b6b)`;
    if (clamped > 75) return `linear-gradient(90deg, var(--accent-amber), #fbbf24)`;
    return `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color}, white 25%))`;
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-percentage">{clamped.toFixed(1)}%</span>
        <span className="progress-detail">
          {usedLabel} / {totalLabel}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            background: getGradient(),
          }}
        />
      </div>
    </div>
  );
}
