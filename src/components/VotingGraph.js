import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const VotingChart = ({ currArea, stateData }) => {
  const [chartData, setChartData] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [chartTitle, setChartTitle] = useState('');

  // Race mapping for labels and corresponding keys in stateData
  const voteMapping = [
    { key: 'democratic_votes', category: 'Biden' },
    { key: 'republican_votes', category: 'Trump' },
  ];

  // Function to prepare filtered data and calculate total population
  const prepareChartData = () => {
    if (!stateData) return;

    // Create chart data from stateData using raceMapping
    const filteredData = voteMapping.map((vote) => {
      const votes = (stateData[vote.key]/(stateData.democratic_votes + stateData.republican_votes))*100 || 0; // Default to 0 if the key doesn't exist
      return { category: vote.category, votes };
    });

    // Calculate total population
    const total = stateData.democratic_votes + stateData.republican_votes;

    // Prepare chart configuration
    const chartData = {
      labels: filteredData.map((item) => item.category),
      datasets: [
        {
          label: 'Total Votes (%)',
          data: filteredData.map((item) => item.votes),
          backgroundColor: [
            'rgb(0, 0, 255)',
            'rgb(255, 0, 0)',
          ],
          borderColor: [
            'rgb(0, 0, 255)',
            'rgb(255, 0, 0)',
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData(chartData);
    setTotalVotes(total);
    setChartTitle(`Vote Distribution for ${currArea}`);
  };

  useEffect(() => {
    prepareChartData();
  }, [currArea, stateData]);

  return (
    <div>
      <div>
        <strong>Total Votes: </strong>
        {totalVotes.toLocaleString()}
      </div>
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
                    weight: '100%',
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
                    text: 'Candidates',
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
                    text: 'Total Votes (%)',
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
    </div>
  );
};

export default VotingChart;
