'use client';

export default function StatList({ items = [] }) {
  return (
    <div className="stat-grid">
      {items.map((item) => (
        <div className="stat-item" key={item.label}>
          <span className="stat-label">{item.label}</span>
          <span className="stat-value" style={item.color ? { color: item.color } : {}}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
