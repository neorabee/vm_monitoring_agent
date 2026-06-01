'use client';

export default function LoadAverage({ load1, load5, load15 }) {
  const getLoadColor = (val) => {
    if (val > 5) return 'var(--accent-rose)';
    if (val > 2) return 'var(--accent-amber)';
    return 'var(--accent-emerald)';
  };

  const items = [
    { label: '1 Min', value: load1 },
    { label: '5 Min', value: load5 },
    { label: '15 Min', value: load15 },
  ];

  return (
    <div className="load-grid">
      {items.map((item) => (
        <div className="load-item" key={item.label}>
          <div className="load-period">{item.label}</div>
          <div
            className="load-value"
            style={{ color: getLoadColor(item.value ?? 0) }}
          >
            {item.value != null ? item.value.toFixed(2) : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}
