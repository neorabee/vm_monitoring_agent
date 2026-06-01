import './globals.css';

export const metadata = {
  title: 'System Monitor — Real-Time Dashboard',
  description: 'Real-time system performance monitoring dashboard tracking CPU, memory, disk, load average, and uptime metrics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
