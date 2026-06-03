"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function LoadAverageChart({ history1 = [], history5 = [], history15 = [] }) {
  const data = {
    labels: history1.map((_, i) => i),
    datasets: [
      {
        label: "1 Min",
        data: history1,
        borderColor: "#e040fb",
        backgroundColor: "rgba(224, 64, 251, 0.08)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        fill: true,
      },
      {
        label: "5 Min",
        data: history5,
        borderColor: "#b44eff",
        backgroundColor: "rgba(180, 78, 255, 0.05)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        fill: true,
      },
      {
        label: "15 Min",
        data: history15,
        borderColor: "#3d8eff",
        backgroundColor: "rgba(61, 142, 255, 0.05)",
        borderWidth: 2,
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
      duration: 0
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
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
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
}
