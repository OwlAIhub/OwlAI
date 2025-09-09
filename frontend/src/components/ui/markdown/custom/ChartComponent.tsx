'use client';

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

interface ChartComponentProps {
  type: string;
  title?: string;
  data: ChartData;
  options?: Record<string, unknown>;
}

export function ChartComponent({ type, title, data, options }: ChartComponentProps) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    ...options,
  };

  return (
    <div className='my-6 p-4 border border-gray-300'>
      {type === 'bar' && <Bar data={data} options={chartOptions} />}
      {type === 'line' && <Line data={data} options={chartOptions} />}
      {type === 'pie' && <Pie data={data} options={chartOptions} />}
    </div>
  );
}