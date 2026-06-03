'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import StatSummaryRow from './components/StatSummaryRow';
import MetricCard from './components/MetricCard';
import CircularGauge from './components/CircularGauge';
import ProgressBar from './components/ProgressBar';
import UptimeDisplay from './components/UptimeDisplay';
import LoadAverage from './components/LoadAverage';
import StatList from './components/StatList';
import NetworkBars from './components/NetworkBars';
import MetricLineChart from './components/MetricLineChart';
import LoadAverageChart from './components/LoadAverageChart';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const pollMetrics = async () => {
      while (isActive) {
        try {
          const response = await fetch('http://localhost:3000/metrics');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();

          if (isActive) {
            setMetrics(data);
            setMetricsHistory((prev) => {
              const updated = [...prev, data];
              if (updated.length > 60) updated.shift();
              return updated;
            });
            setLastUpdate(new Date());
            setIsConnected(true);
            setError(null);
          }
        } catch (err) {
          if (isActive) {
            setIsConnected(false);
            setError('Unable to reach metrics endpoint');
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    pollMetrics();
    return () => {
      isActive = false;
    };
  }, []);

  const fmt = (val, unit = 'GB') =>
    val != null ? `${val.toFixed(2)} ${unit}` : '—';

  const diskPercent =
    metrics && metrics.disk_total > 0
      ? (metrics.disk_used / metrics.disk_total) * 100
      : 0;

  return (
    <div className="app-layout" id="app-layout">
      <Sidebar isConnected={isConnected} />

      <main className="main-content" id="main-content">
        {/* Decorative background blobs */}
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-3" />

        <DashboardHeader lastUpdate={lastUpdate} isConnected={isConnected} uptime={metrics?.uptime} />

        {error && (
          <div className="error-banner" id="error-banner">
            <span className="error-banner-icon">⚠</span>
            <span>{error} — retrying every second…</span>
          </div>
        )}

        {/* ── Top Summary Cards ── */}
        <StatSummaryRow metrics={metrics} />

        {/* ── Main Metrics Grid ── */}
        <div className="metrics-grid" id="metrics-grid">

          {/* ── ROW 1: CPU (large chart) + Memory ── */}
          <MetricCard
            title="CPU Performance"
            icon="⚡"
            iconColor="cyan"
            badge="Real-time"
            span={7}
            delayClass="fade-in-1"
            accent="cyan"
          >
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '24px', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularGauge
                  value={metrics?.cpu_usage ?? 0}
                  label="Utilization"
                  color="#00b8d4"
                  colorEnd="#00e5ff"
                  glowColor="rgba(0, 229, 255, 0.3)"
                />
              </div>
              <div style={{ position: 'relative', minHeight: '200px' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <MetricLineChart
                    history={metricsHistory.map((m) => m.cpu_usage)}
                    color="#00e5ff"
                    glowColor="rgba(0, 229, 255, 0.15)"
                    label="CPU Usage %"
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </MetricCard>

          <MetricCard
            title="Memory"
            icon="▦"
            iconColor="violet"
            badge={fmt(metrics?.ram_total)}
            span={5}
            delayClass="fade-in-2"
            accent="violet"
          >
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <CircularGauge
                  value={metrics?.ram_usage ?? 0}
                  label="Used"
                  color="#7c3aed"
                  colorEnd="#b44eff"
                  glowColor="rgba(180, 78, 255, 0.3)"
                />
                <StatList
                  items={[
                    { label: 'Used', value: fmt(metrics?.ram_used) },
                    { label: 'Free', value: fmt(metrics?.ram_available), color: '#10b981' },
                    { label: 'Total', value: fmt(metrics?.ram_total) },
                  ]}
                />
              </div>
              <div style={{ position: 'relative', minHeight: '180px' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <MetricLineChart
                    history={metricsHistory.map((m) => m.ram_usage)}
                    color="#b44eff"
                    glowColor="rgba(180, 78, 255, 0.15)"
                    label="Memory Usage %"
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </MetricCard>

          {/* ── ROW 2: Disk + Load ── */}
          <MetricCard
            title="Disk Storage"
            icon="◉"
            iconColor="amber"
            badge={fmt(metrics?.disk_total)}
            span={6}
            delayClass="fade-in-3"
            accent="amber"
          >
            <div style={{ padding: '8px 0' }}>
              <ProgressBar
                percentage={diskPercent}
                usedLabel={fmt(metrics?.disk_used)}
                totalLabel={fmt(metrics?.disk_total)}
                color="#ff7b2d"
                colorEnd="#fbbf24"
              />
              <div style={{ marginTop: '20px' }}>
                <StatList
                  items={[
                    { label: 'Used', value: fmt(metrics?.disk_used) },
                    { label: 'Available', value: fmt(metrics?.disk_available), color: '#10b981' },
                    { label: 'Total', value: fmt(metrics?.disk_total) },
                  ]}
                />
              </div>
            </div>
          </MetricCard>

          <MetricCard
            title="Load Average"
            icon="◆"
            iconColor="magenta"
            span={6}
            delayClass="fade-in-4"
            accent="magenta"
          >
            <LoadAverage
              load1={metrics?.loadavg_1min}
              load5={metrics?.loadavg_5min}
              load15={metrics?.loadavg_15min}
            />
            <div style={{ position: 'relative', height: '130px', marginTop: '16px' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <LoadAverageChart
                  history1={metricsHistory.map((m) => m.loadavg_1min)}
                  history5={metricsHistory.map((m) => m.loadavg_5min)}
                  history15={metricsHistory.map((m) => m.loadavg_15min)}
                />
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '10px' }}>
              {[
                ['1 min', '#e040fb'],
                ['5 min', '#b44eff'],
                ['15 min', '#3d8eff'],
              ].map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: 16,
                      height: 2,
                      background: color,
                      borderRadius: 2,
                      boxShadow: `0 0 6px ${color}`,
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      letterSpacing: 1,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </MetricCard>

          {/* ── ROW 3: Network I/O (full width) ── */}
          <MetricCard
            title="Network I/O"
            icon="↕"
            iconColor="blue"
            span={12}
            delayClass="fade-in-6"
            accent="blue"
          >
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px', alignItems: 'center' }}>
              <NetworkBars
                download={metrics?.download_kbps ?? 0}
                upload={metrics?.upload_kbps ?? 0}
              />
              <div>
                <div style={{ position: 'relative', height: '160px' }}>
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <MetricLineChart
                      history={metricsHistory.map((m) => m.download_kbps)}
                      color="#00e5ff"
                      glowColor="rgba(0, 229, 255, 0.15)"
                      label="Download KB/s"
                      height="100%"
                      max={undefined}
                    />
                  </div>
                </div>
                {/* Network legend */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  {[
                    ['Download', '#00e5ff'],
                    ['Upload', '#e040fb'],
                  ].map(([label, color]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: 20,
                          height: 2,
                          background: color,
                          borderRadius: 2,
                          boxShadow: `0 0 8px ${color}`,
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.4)',
                          letterSpacing: 1,
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MetricCard>

        </div>
      </main>
    </div>
  );
}
