'use client';

import { useState, useEffect } from 'react';

export default function DashboardHeader({ lastUpdate, isConnected, uptime }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /* Parse uptime string into segments */
  const parseUptime = (raw) => {
    if (!raw) return null;
    const str = String(raw);
    const dhm = str.match(/(\d+)d\s*(\d+)h\s*(\d+)m\s*(\d+)s/);
    if (dhm) return { d: dhm[1], h: dhm[2], m: dhm[3], s: dhm[4] };
    const dayMatch = str.match(/(\d+)\s*day/i);
    const timeMatch = str.match(/(\d+):(\d+)(?::(\d+))?/);
    if (dayMatch || timeMatch) {
      return {
        d: dayMatch ? dayMatch[1] : '0',
        h: timeMatch ? timeMatch[1] : '0',
        m: timeMatch ? timeMatch[2] : '0',
        s: timeMatch && timeMatch[3] ? timeMatch[3] : '0',
      };
    }
    return null;
  };

  const up = parseUptime(uptime);

  return (
    <header className="dashboard-header" id="dashboard-header">
      <div className="header-left">
        <div>
          <h1 className="header-title">System Dashboard</h1>
          <p className="header-subtitle">{formatDate()} — Real-time performance telemetry</p>
        </div>
      </div>
      <div className="header-right">
        {/* Compact uptime */}
        {up && (
          <div className="header-uptime" id="header-uptime">
            <span className="header-uptime-label">Uptime</span>
            <span className="header-uptime-value">
              {up.d}<span className="header-uptime-unit">d</span>{' '}
              {up.h}<span className="header-uptime-unit">h</span>{' '}
              {up.m}<span className="header-uptime-unit">m</span>{' '}
              {up.s}<span className="header-uptime-unit">s</span>
            </span>
          </div>
        )}
        <div className={`live-badge ${!isConnected ? 'disconnected' : ''}`} id="live-status">
          <span
            className="live-dot"
            style={
              !isConnected
                ? { background: '#ff4757', boxShadow: '0 0 8px #ff4757', animation: 'none' }
                : {}
            }
          />
          {isConnected ? 'Live' : 'Offline'}
        </div>
        <span className="timestamp" id="current-time">{currentTime}</span>
      </div>
    </header>
  );
}
