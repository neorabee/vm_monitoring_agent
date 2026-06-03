'use client';

const RADIUS = 68;
const STROKE = 10;
const SIZE = 180;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularGauge({
  value = 0,
  label,
  color = '#00e5ff',
  colorEnd,
  glowColor = 'rgba(0, 229, 255, 0.3)',
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const gradientId = `gauge-grad-${label?.replace(/\s+/g, '-') || 'default'}`;
  const endColor = colorEnd || color;

  return (
    <div className="gauge-container" id={`gauge-${label?.replace(/\s+/g, '-')?.toLowerCase() || 'default'}`}>
      <div className="gauge-wrapper" style={{ width: SIZE, height: SIZE }}>
        <svg
          className="gauge-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>

          {/* Decorative outer ring */}
          <circle
            cx={CX} cy={CY} r={RADIUS + 14}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Background track */}
          <circle
            className="gauge-track"
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />

          {/* Fill arc */}
          <circle
            className="gauge-fill"
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 10px ${glowColor})`,
              transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Inner subtle echo */}
          <circle
            cx={CX} cy={CY} r={RADIUS - 12}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE * 0.85}
            strokeDashoffset={offset * 0.9}
            style={{
              opacity: 0.2,
              transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>
        <div className="gauge-center">
          <span className="gauge-value">
            {clamped.toFixed(1)}
            <span className="gauge-unit">%</span>
          </span>
        </div>
      </div>
      {label && <span className="gauge-label">{label}</span>}
    </div>
  );
}
