import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

export default function BoxWhiskerPlot({ stateName }) {
  const [plotData, setPlotData] = useState([]);
  const [layout, setLayout] = useState({});
  const [raceCategory, setRaceCategory] = useState("white_POP");
  const [raceData, setRaceData] = useState({});

  useEffect(() => {
    fetchBoxWhiskData();
  }, [stateName]);

  const fetchBoxWhiskData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/box-and-whisker/${stateName}/race`);
      setRaceData(response.data); 
      updatePlot(response.data, raceCategory); 
    } catch (error) {
      console.error("Error fetching race data:", error);
    }
  };

  const updatePlot = (data, category) => {
    const selectedRaceData = data[category];
    if (!selectedRaceData) {
      console.error("Invalid category:", category);
      return;
    }

    const boxTraces = [];
    const scatterTrace = {
      x: [],
      y: [],
      mode: "markers",
      type: "scatter",
      marker: { color: "red", size: 8 },
      name: "Enacted Plan",
    };

    const bucketNames = Object.keys(selectedRaceData);
    bucketNames.forEach((bucket) => {
      const stats = selectedRaceData[bucket];
      boxTraces.push({
        y: [
          stats.min,
          stats.first_quartile,
          stats.median,
          stats.third_quartile,
          stats.max,
        ],
        type: "box",
        name: bucket,
        boxmean: false,
        marker: { color: "lightblue" },
        line: { color: "black" }, 
      });
      scatterTrace.x.push(bucket);
      scatterTrace.y.push(stats.enacted);
    });
    
    setPlotData([...boxTraces, scatterTrace]);

    setLayout({
      title: `Box-and-Whisker Plot for ${category.replace("_POP", "").toUpperCase()}`,
      xaxis: {
        title: "Districts",
        tickangle: 0,
        tickvals: bucketNames,
        ticktext: bucketNames.map((bucket) => bucket),
      },
      yaxis: {
        title: "Population",
      },
      showlegend: true,
      autosize: true,
      height:520,
    });
  };

  const handleRaceChange = (event) => {
    const selectedCategory = event.target.value;
    setRaceCategory(selectedCategory);
    updatePlot(raceData, selectedCategory);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="race-select" style={{ marginRight: "10px" }}>Select Race:</label>
        <select
          id="race-select"
          value={raceCategory}
          onChange={handleRaceChange}
        >
          {Object.keys(raceData).map((category) => (
            <option key={category} value={category}>
              {category.replace("_POP", "").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <Plot
        data={plotData}
        layout={layout}
        config={{ responsive: true }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
