'use client';

export default function NetworkBars({ download = 0, upload = 0 }) {
  const peak = Math.max(download, upload, 100);

  const formatSpeed = (val) => {
    if (val < 1024) return `${val.toFixed(1)} KB/s`;
    return `${(val / 1024).toFixed(2)} MB/s`;
  };

  return (
    <div className="network-bars" id="network-bars">
      {/* Download */}
      <div className="network-row">
        <div className="network-row-header">
          <span className="network-label">
            <span
              className="network-dot"
              style={{ background: '#00e5ff', boxShadow: '0 0 8px #00e5ff' }}
            />
            Download
          </span>
          <span className="network-kbps" style={{ color: '#00e5ff' }}>
            {formatSpeed(download)}
          </span>
        </div>
        <div className="network-track">
          <div
            className="network-fill"
            style={{
              width: `${Math.min((download / peak) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #0090cc, #00e5ff)',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Upload */}
      <div className="network-row">
        <div className="network-row-header">
          <span className="network-label">
            <span
              className="network-dot"
              style={{ background: '#e040fb', boxShadow: '0 0 8px #e040fb' }}
            />
            Upload
          </span>
          <span className="network-kbps" style={{ color: '#e040fb' }}>
            {formatSpeed(upload)}
          </span>
        </div>
        <div className="network-track">
          <div
            className="network-fill"
            style={{
              width: `${Math.min((upload / peak) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #9b1a6e, #e040fb)',
              boxShadow: '0 0 12px rgba(224, 64, 251, 0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
