import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

// Registering the necessary components for radar chart
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface RadarChartProps {
    data: ChartData<"radar">;  // Specifying 'radar' chart type for data
    options: ChartOptions<"radar">;  // Specifying 'radar' chart type for options
}
const RadarChart = ({ data, options }: RadarChartProps) => {
    return <Radar data={data} options={options} />;
};

export default RadarChart;