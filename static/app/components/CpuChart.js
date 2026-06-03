"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

// Registered Tooltip and Filler (if you want the area under the line filled)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function CpuChart() {
  const [cpuHistory, setCpuHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:3000/metrics");
        const metrics = await res.json();

        setCpuHistory(prev => {
          const updated = [...prev, metrics.cpu_usage];

          if (updated.length > 60) {
            updated.shift();
          }

          return updated;
        });
      } catch (err) {
        console.error("Failed to fetch metrics for CpuChart", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: cpuHistory.map((_, i) => i),
    datasets: [
      {
        label: "CPU Usage %",
        data: cpuHistory,
        // Added styling! Without borderColor, the line defaults to transparent/black
        borderColor: "#00d4ff",
        backgroundColor: "rgba(0, 212, 255, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Adds a premium smooth curve
        pointRadius: 0, // Hides the individual dots for a cleaner line
        pointHitRadius: 10,
        fill: true, // Requires 'Filler' registered above, gives a nice glowing area below the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false, // Hides the X axis line and labels for a cleaner look
      },
      y: {
        beginAtZero: true,
        max: 100, // Locks the Y-axis to 0-100% so the chart doesn't bounce around
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hides the top legend
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
