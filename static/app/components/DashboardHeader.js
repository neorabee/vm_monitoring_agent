'use client';

export default function DashboardHeader({ lastUpdate, isConnected }) {
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-icon">⬡</div>
        <div>
          <h1 className="header-title">System Monitor</h1>
          <p className="header-subtitle">Real-time performance metrics</p>
        </div>
      </div>
      <div className="header-right">
        <div className={`live-badge ${!isConnected ? 'disconnected' : ''}`}
          style={!isConnected ? {
            background: 'var(--accent-rose-dim)',
            borderColor: 'rgba(244,63,94,0.2)',
            color: 'var(--accent-rose)',
          } : {}}>
          <span className="live-dot"
            style={!isConnected ? {
              background: 'var(--accent-rose)',
              animation: 'none',
            } : {}} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
        <span className="timestamp">{formatTime(lastUpdate)}</span>
      </div>
    </header>
  );
}
