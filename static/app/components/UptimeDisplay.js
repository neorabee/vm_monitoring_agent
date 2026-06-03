'use client';

export default function UptimeDisplay({ uptime }) {
  const parseUptime = (raw) => {
    if (!raw) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const str = String(raw);

    // Try "Xd Yh Zm Ws" format
    const dhmMatch = str.match(/(\d+)d\s*(\d+)h\s*(\d+)m\s*(\d+)s/);
    if (dhmMatch) {
      return {
        days: parseInt(dhmMatch[1], 10),
        hours: parseInt(dhmMatch[2], 10),
        minutes: parseInt(dhmMatch[3], 10),
        seconds: parseInt(dhmMatch[4], 10),
      };
    }

    // Try "X day(s), H:MM:SS" format
    const dayMatch = str.match(/(\d+)\s*day/i);
    const timeMatch = str.match(/(\d+):(\d+)(?::(\d+))?/);
    return {
      days: dayMatch ? parseInt(dayMatch[1], 10) : 0,
      hours: timeMatch ? parseInt(timeMatch[1], 10) : 0,
      minutes: timeMatch ? parseInt(timeMatch[2], 10) : 0,
      seconds: timeMatch && timeMatch[3] ? parseInt(timeMatch[3], 10) : 0,
    };
  };

  const { days, hours, minutes, seconds } = parseUptime(uptime);

  const segments = [
    { value: days, unit: 'Days', accent: 'cyan' },
    { value: hours, unit: 'Hrs', accent: 'violet' },
    { value: minutes, unit: 'Min', accent: 'magenta' },
    { value: seconds, unit: 'Sec', accent: 'emerald' },
  ];

  return (
    <div className="uptime-display" id="uptime-display">
      <div className="uptime-segments">
        {segments.map((seg, i) => (
          <div key={seg.unit} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="uptime-segment" data-accent={seg.accent}>
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

