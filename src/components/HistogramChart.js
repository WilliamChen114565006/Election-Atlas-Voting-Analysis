import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const HistogramChart = () => {
  const [chartData, setChartData] = useState(null);

  const loadData = async () => {
    const response = await fetch('black_non_black_biden.json'); // Ensure this file is in your public folder
    const data = await response.json();

    // Extract group data
    const group1Values = data.map((row) => row.black);
    const group2Values = data.map((row) => row.non_black);

    // Generate histogram data
    const createHistogram = (values, bins = 2000) => {
      const min = 0;
      const max = 1;
      const binWidth = (max - min) / bins;
      const counts = new Array(bins).fill(0);

      values.forEach((value) => {
        const index = Math.min(
          Math.floor((value - min) / binWidth),
          bins - 1
        );
        counts[index]++;
      });

      const labels = Array.from({ length: bins }, (_, i) =>
        `${(min + i * binWidth).toFixed(2)}`
      );

      return { labels, counts };
    };

    const histogram1 = createHistogram(group1Values);
    const histogram2 = createHistogram(group2Values);

    // Combine chart data for both groups
    setChartData({
      labels: histogram1.labels,
      datasets: [
        {
          label: 'Black',
          data: histogram1.counts,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
        },
        {
          label: 'Non-Black',
          data: histogram2.counts,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1>Histogram for Group 1 and Group 2</h1>
      <div className="chart-container">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: 'Combined Histogram',
                },
                legend: {
                  display: true,
                  position: 'top',
                },
              },
              scales: {
                x: { title: { display: true, text: 'Bins' } },
                y: { title: { display: true, text: 'Frequency' } },
              },
            }}
          />
        ) : (
          <p>Loading Data...</p>
        )}
      </div>
    </div>
  );
};

export default HistogramChart;
