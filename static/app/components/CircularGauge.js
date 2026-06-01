'use client';

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularGauge({ value = 0, label, color = 'var(--accent-cyan)', glowColor = 'rgba(0, 212, 255, 0.2)' }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = CIRCUMFERENCE - (clampedValue / 100) * CIRCUMFERENCE;

  return (
    <div className="gauge-container">
      <div className="gauge-wrapper">
        <svg className="gauge-svg" viewBox="0 0 180 180"
          style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}>
          <circle
            className="gauge-track"
            cx="90"
            cy="90"
            r={RADIUS}
          />
          <circle
            className="gauge-fill"
            cx="90"
            cy="90"
            r={RADIUS}
            style={{
              stroke: color,
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="gauge-center">
          <span className="gauge-value">
            {clampedValue.toFixed(1)}
            <span className="gauge-unit">%</span>
          </span>
        </div>
      </div>
      {label && <span className="gauge-label">{label}</span>}
    </div>
  );
}
