'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardHeader from './components/DashboardHeader';
import MetricCard from './components/MetricCard';
import CircularGauge from './components/CircularGauge';
import ProgressBar from './components/ProgressBar';
import UptimeDisplay from './components/UptimeDisplay';
import LoadAverage from './components/LoadAverage';
import StatList from './components/StatList';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/metrics")
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setMetrics(data);
      setLastUpdate(new Date());
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError('Unable to reach metrics endpoint');
      console.error('Metrics fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 1000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const fmt = (val, unit = 'GB') =>
    val != null ? `${val.toFixed(2)} ${unit}` : '—';

  const diskPercent =
    metrics && metrics.disk_total > 0
      ? (metrics.disk_used / metrics.disk_total) * 100
      : 0;

  return (
    <div className="dashboard-wrapper">
      <DashboardHeader lastUpdate={lastUpdate} isConnected={isConnected} />

      {error && (
        <div className="error-banner">
          <span>⚠</span>
          <span>{error} — retrying every second…</span>
        </div>
      )}

      <div className="metrics-grid">
        {/* ── Uptime ────────────────────────────── */}
        <MetricCard
          title="Uptime"
          icon="⏱"
          iconColor="emerald"
          span={12}
          delayClass="fade-in-1"
        >
          <UptimeDisplay uptime={metrics?.uptime} />
        </MetricCard>

        {/* ── CPU Gauge ─────────────────────────── */}
        <MetricCard
          title="CPU"
          icon="⚡"
          iconColor="cyan"
          badge="Real-time"
          span={4}
          delayClass="fade-in-2"
        >
          <CircularGauge
            value={metrics?.cpu_usage ?? 0}
            label="Utilization"
            color="var(--accent-cyan)"
            glowColor="rgba(0, 212, 255, 0.25)"
          />
        </MetricCard>

        {/* ── Memory Gauge + Details ────────────── */}
        <MetricCard
          title="Memory"
          icon="☰"
          iconColor="violet"
          badge={fmt(metrics?.ram_total)}
          span={4}
          delayClass="fade-in-3"
        >
          <CircularGauge
            value={metrics?.ram_usage ?? 0}
            label="Used"
            color="var(--accent-violet)"
            glowColor="rgba(124, 58, 237, 0.25)"
          />
          <div style={{ marginTop: '20px' }}>
            <StatList
              items={[
                { label: 'Used', value: fmt(metrics?.ram_used) },
                { label: 'Available', value: fmt(metrics?.ram_available), color: 'var(--accent-emerald)' },
                { label: 'Total', value: fmt(metrics?.ram_total) },
              ]}
            />
          </div>
        </MetricCard>

        {/* ── Disk ──────────────────────────────── */}
        <MetricCard
          title="Disk"
          icon="◉"
          iconColor="amber"
          badge={fmt(metrics?.disk_total)}
          span={4}
          delayClass="fade-in-4"
        >
          <ProgressBar
            percentage={diskPercent}
            usedLabel={fmt(metrics?.disk_used)}
            totalLabel={fmt(metrics?.disk_total)}
            color="var(--accent-amber)"
          />
          <div style={{ marginTop: '20px' }}>
            <StatList
              items={[
                { label: 'Used', value: fmt(metrics?.disk_used) },
                { label: 'Available', value: fmt(metrics?.disk_available), color: 'var(--accent-emerald)' },
                { label: 'Total', value: fmt(metrics?.disk_total) },
              ]}
            />
          </div>
        </MetricCard>

        {/* ── Load Average ──────────────────────── */}
        <MetricCard
          title="Load Average"
          icon="◆"
          iconColor="rose"
          span={12}
          delayClass="fade-in-5"
        >
          <LoadAverage
            load1={metrics?.loadavg_1min}
            load5={metrics?.loadavg_5min}
            load15={metrics?.loadavg_15min}
          />
        </MetricCard>
      </div>
    </div>
  );
}
