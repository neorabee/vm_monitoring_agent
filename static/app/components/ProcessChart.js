'use client';

import { useMemo } from 'react';

const PROCESS_COLORS = [
  { color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.35)', dim: 'rgba(0, 229, 255, 0.12)' },
  { color: '#b44eff', glow: 'rgba(180, 78, 255, 0.35)', dim: 'rgba(180, 78, 255, 0.12)' },
  { color: '#e040fb', glow: 'rgba(224, 64, 251, 0.35)', dim: 'rgba(224, 64, 251, 0.12)' },
  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.35)', dim: 'rgba(251, 191, 36, 0.12)' },
  { color: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', dim: 'rgba(16, 185, 129, 0.12)' },
  { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.35)', dim: 'rgba(59, 130, 246, 0.12)' },
  { color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.35)',  dim: 'rgba(244, 63, 94, 0.12)' },
  { color: '#f97316', glow: 'rgba(249, 115, 22, 0.35)', dim: 'rgba(249, 115, 22, 0.12)' },
  { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)',  dim: 'rgba(6, 182, 212, 0.12)' },
  { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.35)', dim: 'rgba(167, 139, 250, 0.12)' },
];

function formatMemory(bytes) {
  if (bytes == null) return '—';
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export default function ProcessChart({ processes }) {
  const sorted = useMemo(() => {
    if (!processes?.length) return [];
    return [...processes].sort((a, b) => (b.Memory ?? 0) - (a.Memory ?? 0));
  }, [processes]);

  const totalMemory = useMemo(
    () => sorted.reduce((sum, p) => sum + (p.Memory ?? 0), 0),
    [sorted]
  );

  // Build donut ring segments
  const donutData = useMemo(() => {
    if (!sorted.length || totalMemory === 0) return [];
    const radius = 62;
    const circumference = 2 * Math.PI * radius;
    const gap = 3; // px gap between arcs
    let offset = 0;
    return sorted.map((p, i) => {
      const pct = (p.Memory ?? 0) / totalMemory;
      const arcLen = pct * circumference - gap;
      const seg = {
        arcLen: Math.max(arcLen, 2),
        offset,
        circumference,
        radius,
        color: PROCESS_COLORS[i % PROCESS_COLORS.length],
      };
      offset += pct * circumference;
      return seg;
    });
  }, [sorted, totalMemory]);

  if (!sorted.length) {
    return (
      <div className="process-empty">
        <span className="process-empty-icon">⊘</span>
        <span>No process data available</span>
      </div>
    );
  }

  const maxMem = sorted[0]?.Memory ?? 1;

  return (
    <div className="process-chart-layout">
      {/* ── Left: Donut Ring ── */}
      <div className="process-donut-container">
        <svg viewBox="0 0 160 160" className="process-donut-svg">
          {/* Track */}
          <circle
            cx="80" cy="80" r="62"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="14"
          />
          {/* Segments */}
          {donutData.map((seg, i) => (
            <circle
              key={i}
              cx="80" cy="80" r={seg.radius}
              fill="none"
              stroke={seg.color.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${seg.arcLen} ${seg.circumference - seg.arcLen}`}
              strokeDashoffset={-seg.offset}
              style={{
                filter: `drop-shadow(0 0 6px ${seg.color.glow})`,
                transition: 'stroke-dasharray 600ms cubic-bezier(0.16,1,0.3,1), stroke-dashoffset 600ms cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="process-donut-center">
          <span className="process-donut-count">{sorted.length}</span>
          <span className="process-donut-label">Processes</span>
        </div>
      </div>

      {/* ── Right: Process List ── */}
      <div className="process-list">
        {sorted.map((p, i) => {
          const palette = PROCESS_COLORS[i % PROCESS_COLORS.length];
          const barPct = maxMem > 0 ? ((p.Memory ?? 0) / maxMem) * 100 : 0;
          const memPct = totalMemory > 0 ? (((p.Memory ?? 0) / totalMemory) * 100).toFixed(1) : '0.0';

          return (
            <div key={p.PID ?? i} className="process-row">
              {/* Color dot */}
              <span
                className="process-dot"
                style={{
                  background: palette.color,
                  boxShadow: `0 0 8px ${palette.glow}`,
                }}
              />
              {/* Name + PID */}
              <div className="process-info">
                <span className="process-name">{p.Name || 'unknown'}</span>
                <span className="process-pid">PID {p.PID}</span>
              </div>
              {/* Bar */}
              <div className="process-bar-track">
                <div
                  className="process-bar-fill"
                  style={{
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${palette.dim}, ${palette.color})`,
                    boxShadow: `0 0 10px ${palette.glow}`,
                  }}
                />
              </div>
              {/* Memory value */}
              <span className="process-mem">{formatMemory(p.Memory)}</span>
              {/* Percent badge */}
              <span
                className="process-pct"
                style={{
                  color: palette.color,
                  background: palette.dim,
                }}
              >
                {memPct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
