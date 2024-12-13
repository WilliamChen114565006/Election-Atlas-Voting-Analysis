import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnsembleSummaryBarGraph = ({ stateName }) => {
  stateName = stateName.replace(/ /g, "_");
  const [data, setData] = useState(null);
  const [ensemble, setEnsemble] = useState("Large");

  useEffect(() => {
    fetchData(ensemble);
  }, [stateName, ensemble]);

  const fetchData = async (ensemble) => {
    try {
      const response = await axios.get(`http://localhost:8080/ensemble-summary/${stateName}/${ensemble}`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ensemble summary data:", error);
    }
  };

  const prepareChartData = (jsonData) => {
    if (!jsonData || !jsonData.summary_data) return { labels: [], datasets: [] };

    const summaryData = jsonData.summary_data;
    let maxDistricts = 0;
    const splitCounts = {};

    Object.values(summaryData).forEach(([dem, rep]) => {
      maxDistricts = Math.max(maxDistricts, dem + rep); // Calculate max districts dynamically
      const splitKey = `${dem}/${rep}`;
      splitCounts[splitKey] = (splitCounts[splitKey] || 0) + 1;
    });

    // Generate labels for X-axis
    const labels = [];
    for (let dem = 0; dem <= maxDistricts; dem++) {
      const rep = maxDistricts - dem;
      labels.push(`${dem}/${rep}`);
    }

    // Prepare dataset
    const chartData = labels.map((label) => splitCounts[label] || 0);

    return {
      labels, // X-axis labels
      datasets: [
        {
          label: "Number of Plans",
          data: chartData, // Y-axis values
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepareChartData(data);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `District Splits for ${ensemble.charAt(0).toUpperCase() + ensemble.slice(1)} Ensemble` },
    },
    scales: {
      x: { title: { display: true, text: "District Splits (Dem/Rep)" } },
      y: { title: { display: true, text: "Number of Plans" } },
    },
  };

  return (
    <div>
      {/* Dropdown for ensemble selection */}
      <label htmlFor="ensemble-select">Select Ensemble: </label>
      <select
        id="ensemble-select"
        value={ensemble}
        onChange={(e) => setEnsemble(e.target.value)}
      >
        <option value="large">Large Ensemble</option>
        <option value="test">Test Ensemble</option>
      </select>

        <Bar data={chartData} options={options} />
    </div>
  );
};

export default EnsembleSummaryBarGraph;
