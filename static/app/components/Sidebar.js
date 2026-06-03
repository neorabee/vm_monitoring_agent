'use client';

import { useState } from 'react';

const NAV_SECTIONS = [
  {
    category: 'OVERVIEW',
    items: [
      { icon: '◈', label: 'Dashboard', id: 'dashboard', active: true },
      { icon: '⚡', label: 'Performance', id: 'performance' },
    ],
  },
  {
    category: 'RESOURCES',
    items: [
      { icon: '◉', label: 'CPU', id: 'cpu' },
      { icon: '▦', label: 'Memory', id: 'memory' },
      { icon: '◆', label: 'Disk', id: 'disk' },
      { icon: '≡', label: 'Processes', id: 'processes' },
    ],
  },
  {
    category: 'NETWORK',
    items: [
      { icon: '↕', label: 'Throughput', id: 'throughput' },
      { icon: '⊛', label: 'Connections', id: 'connections' },
    ],
  },
];

export default function Sidebar({ isConnected = true }) {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside className="sidebar" id="sidebar-nav">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="6" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
            <path d="M9 18 L9 13 L14 10 L19 13 L19 18" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="14" cy="14" r="2" fill="url(#logoGrad)" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#b44eff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-title">SysMonitor</div>
          <div className="sidebar-logo-version">v2.0 Pro</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" id="sidebar-navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.category} className="nav-section">
            <span className="nav-category">{section.category}</span>
            {section.items.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
                {item.id === 'dashboard' && (
                  <span className="nav-item-badge live">●</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className={`sidebar-status-dot ${isConnected ? 'online' : 'offline'}`} />
          <span className="sidebar-status-text">
            {isConnected ? 'System Online' : 'Disconnected'}
          </span>
        </div>
        <button className="sidebar-export-btn" id="export-btn">
          <span>↓</span>
          Export Report
        </button>
      </div>
    </aside>
  );
}
