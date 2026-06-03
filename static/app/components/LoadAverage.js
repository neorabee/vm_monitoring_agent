'use client';

export default function LoadAverage({ load1, load5, load15 }) {
  const getLoadColor = (val) => {
    if (val == null) return '#6b7280';
    if (val > 5) return '#ff4757';
    if (val > 2) return '#ffa502';
    return '#10b981';
  };

  const items = [
    { label: '1 Min', value: load1, accent: 'magenta' },
    { label: '5 Min', value: load5, accent: 'violet' },
    { label: '15 Min', value: load15, accent: 'blue' },
  ];

  return (
    <div className="load-grid" id="load-average">
      {items.map((item) => (
        <div className="load-item" key={item.label} data-accent={item.accent}>
          <div className="load-period">{item.label}</div>
          <div
            className="load-value"
            style={{ color: getLoadColor(item.value) }}
          >
            {item.value != null ? item.value.toFixed(2) : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}
