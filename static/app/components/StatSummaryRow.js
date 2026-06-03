'use client';

export default function StatSummaryRow({ metrics }) {
  const fmt = (val, unit = 'GB') => val != null ? `${val.toFixed(1)} ${unit}` : '—';

  const cards = [
    {
      id: 'cpu-summary',
      label: 'CPU Usage',
      value: metrics?.cpu_usage != null ? `${metrics.cpu_usage.toFixed(1)}` : '—',
      unit: '%',
      accent: 'cyan',
      icon: '⚡',
      subtitle: 'Current load',
    },
    {
      id: 'ram-summary',
      label: 'Memory Usage',
      value: metrics?.ram_usage != null ? `${metrics.ram_usage.toFixed(1)}` : '—',
      unit: '%',
      accent: 'violet',
      icon: '▦',
      subtitle: fmt(metrics?.ram_used) + ' used',
    },
    {
      id: 'disk-summary',
      label: 'Disk Usage',
      value: metrics?.disk_total > 0
        ? `${((metrics.disk_used / metrics.disk_total) * 100).toFixed(1)}`
        : '—',
      unit: '%',
      accent: 'amber',
      icon: '◉',
      subtitle: fmt(metrics?.disk_used) + ' used',
    },
    {
      id: 'network-summary',
      label: 'Network',
      value: metrics?.download_kbps != null
        ? (metrics.download_kbps < 1024
            ? `${metrics.download_kbps.toFixed(0)}`
            : `${(metrics.download_kbps / 1024).toFixed(1)}`)
        : '—',
      unit: metrics?.download_kbps != null
        ? (metrics.download_kbps < 1024 ? 'KB/s' : 'MB/s')
        : '',
      accent: 'emerald',
      icon: '↕',
      subtitle: 'Download speed',
    },
  ];

  return (
    <div className="stat-summary-row" id="stat-summary">
      {cards.map((card, i) => (
        <div
          key={card.id}
          id={card.id}
          className={`stat-summary-card fade-in fade-in-${i + 1}`}
          data-accent={card.accent}
        >
          <div className="stat-summary-icon-wrap" data-accent={card.accent}>
            <span>{card.icon}</span>
          </div>
          <div className="stat-summary-content">
            <span className="stat-summary-label">{card.label}</span>
            <div className="stat-summary-value-row">
              <span className="stat-summary-value">{card.value}</span>
              <span className="stat-summary-unit">{card.unit}</span>
            </div>
            <span className="stat-summary-subtitle">{card.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
