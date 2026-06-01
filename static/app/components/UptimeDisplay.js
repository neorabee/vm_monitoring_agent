'use client';

export default function UptimeDisplay({ uptime }) {
const parseUptime = (raw) => {
  if (!raw) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const str = String(raw);

  const match = str.match(
    /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/
  );

  if (!match) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: parseInt(match[1] || 0, 10),
    hours: parseInt(match[2] || 0, 10),
    minutes: parseInt(match[3] || 0, 10),
    seconds: parseInt(match[4] || 0, 10),
  };
};

  const { days, hours, minutes, seconds } = parseUptime(uptime);

  const segments = [
    { value: days, unit: 'Days' },
    { value: hours, unit: 'Hours' },
    { value: minutes, unit: 'Min' },
    { value: seconds, unit: 'Sec' },
  ];

  return (
    <div className="uptime-display">
      <div className="uptime-segments">
        {segments.map((seg, i) => (
          <div key={seg.unit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="uptime-segment">
              <span className="uptime-number">
                {String(seg.value).padStart(2, '0')}
              </span>
              <span className="uptime-unit">{seg.unit}</span>
            </div>
            {i < segments.length - 1 && (
              <span className="uptime-separator">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
