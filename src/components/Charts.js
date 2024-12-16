import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const PopulationChart = ({ currArea, stateData }) => {
  const [chartData, setChartData] = useState(null);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [chartTitle, setChartTitle] = useState('');

  // Race mapping for labels and corresponding keys in stateData
  const raceMapping = [
    { key: 'WHITE_POP', category: 'White' },
    { key: 'BLACK_POP', category: 'Black' },
    { key: 'ASIAN_POP', category: 'Asian' },
    { key: 'NATIVE_POP', category: 'Native' },
    { key: 'PACIFIC_POP', category: 'Pacific' },
    { key: 'OTHER_POP', category: 'Other' },
  ];

  // Function to prepare filtered data and calculate total population
  const prepareChartData = () => {
    if (!stateData) return;

    // Create chart data from stateData using raceMapping
    const filteredData = raceMapping.map((race) => {
      const population = (stateData[race.key]/stateData.TOT_POP)*100 || 0; // Default to 0 if the key doesn't exist
      return { category: race.category, population };
    });

    // Calculate total population
    const total = stateData.TOT_POP;

    // Prepare chart configuration
    const chartData = {
      labels: filteredData.map((item) => item.category),
      datasets: [
        {
          label: 'Population (%)',
          data: filteredData.map((item) => item.population),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(201, 203, 207, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(201, 203, 207, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData(chartData);
    setTotalPopulation(total);
    setChartTitle(`Population Distribution for ${currArea}`);
  };

  useEffect(() => {
    prepareChartData();
  }, [currArea, stateData]);

  return (
    <div>
      {/* <div>
        <strong>Total Population: </strong>
        {totalPopulation.toLocaleString()}
      </div> */}
      <div className="chart-container">
        {chartData ? (
          <Bar
            height={'45%'} // Set height in pixels
            width={'100%'} // Set width in pixels
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: chartTitle,
                  font: {
                    size: 18,
                    family: 'Open Sans',
                    weight: '700',
                  },
                },
                legend: {
                  display: false,
                },
                tooltip: {
                  bodyFont: {
                    family: 'Open Sans',
                    size: 12,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Race',
                    font: {
                      family: 'Open Sans',
                      size: 14,
                    },
                  },
                  ticks: {
                    font: {
                      family: 'Open Sans',
                      size: 12,
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Population (%)',
                    font: {
                      family: 'Open Sans',
                      size: 14,
                    },
                  },
                  ticks: {
                    font: {
                      family: 'Open Sans',
                      size: 12,
                    },
                    beginAtZero: true,
                    callback: function (value) {
                      return value >= 1000 ? `${value / 1000}K` : value;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
      <div>
        <strong>Total Population: </strong>
        {totalPopulation.toLocaleString()}
      </div>
    </div>
  );
};

export default PopulationChart;
