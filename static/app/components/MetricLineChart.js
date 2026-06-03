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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function MetricLineChart({
  history = [],
  color = "#00e5ff",
  glowColor = "rgba(0, 229, 255, 0.15)",
  label = "Usage %",
  max = 100,
  height = "200px"
}) {
  const data = {
    labels: history.map((_, i) => i),
    datasets: [
      {
        label,
        data: history,
        borderColor: color,
        backgroundColor: glowColor,
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        ...(max !== undefined ? { max } : {}),
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.25)",
          font: {
            family: "'JetBrains Mono', monospace",
            size: 10,
          },
          maxTicksLimit: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(13, 13, 30, 0.95)",
        titleColor: "#fff",
        bodyColor: "rgba(255,255,255,0.8)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          family: "'Space Grotesk', sans-serif",
          weight: "600",
        },
        bodyFont: {
          family: "'JetBrains Mono', monospace",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height }}>
      <Line data={data} options={options} />
    </div>
  );
}
