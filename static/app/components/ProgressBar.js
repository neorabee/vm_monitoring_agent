'use client';

export default function ProgressBar({
  percentage = 0,
  usedLabel,
  totalLabel,
  color = '#ff7b2d',
  colorEnd,
}) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const endColor = colorEnd || color;

  const getGradient = () => {
    if (clamped > 90) return 'linear-gradient(90deg, #ff4757, #ff6b81)';
    if (clamped > 75) return 'linear-gradient(90deg, #ffa502, #fbbf24)';
    return `linear-gradient(90deg, ${color}, ${endColor})`;
  };

  return (
    <div className="progress-container" id="progress-bar">
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
