import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import 'chart.js/auto';

export default function RegionChart({ currArea, stateData}){
    // Extract the percentage data from stateData
    const { percent_rural, percent_suburban, percent_urban } = stateData;

    // Prepare data for the chart
    const chartData = {
        labels: ['Rural', 'Urban', 'Suburban'],
        datasets: [
            {
                label: 'Percentage',
                data: [percent_rural, percent_urban, percent_suburban],
                backgroundColor: [
                    'green', 
                    'purple', 
                    'orange'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgb(253, 213, 32)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Configure options for the chart
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Percentage of Region Type`, 
                font: {
                  size: 18, 
                  family: 'Open Sans',
                  weight: '700', 
                }
            },
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}%`
                }
            }
        },
        scales: {
            x: {
                title: {
                  display: true,
                  text: 'Region Types',
                  font: {
                    family: 'Open Sans',
                    size: 14 
                  }
                },
                ticks: {
                  font: {
                    family: 'Open Sans',
                    size: 12 
                  }
                }
              },
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Share of Households (%)', 
                    font: {
                      family: 'Open Sans',
                      size: 14 
                    }
                  },
                ticks: {
                    font: {
                        family: 'Open Sans',
                        size: 12 
                      },
                    callback: (value) => `${value}%`
                }
            }
        }
    };

    return (
        <div>
        <div className='Total'> <strong>Total Precincts: </strong>  {stateData.total_precincts.toLocaleString()}</div>
        <div className='chart-container'>
            <Bar data={chartData} options={chartOptions} />
        </div>
        </div>
    );

}