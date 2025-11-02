import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

export default function ChartPie({ data, labels }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#10b981',
          '#6ee7b7',
          '#34d399',
          '#059669',
          '#047857'
        ],
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 12,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        displayColors: true
      }
    }
  }

  return <Doughnut data={chartData} options={options} />
}
