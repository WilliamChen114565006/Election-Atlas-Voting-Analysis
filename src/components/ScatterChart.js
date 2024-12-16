import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ScatterPlot({ stateName }) {
  const [selectedRace, setSelectedRace] = useState("white");
  const [selectedDisplay, setSelectedDisplay] = useState("race");
  const [selectedRegion, setSelectedRegion] = useState("Overall");
  const [ginglesData, setGinglesData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [races, setRaces] = useState(["White", "Black"]); // Default to Louisiana races
  const regions = ["Overall", "Rural", "Urban", "Suburban"];

  const stateRaceMap = {
    Louisiana: ["White", "Black"],
    NJ: ["White", "Black", "Asian"],
  };

  useEffect(() => {
    // Update races based on stateName
    if (stateRaceMap[stateName]) {
      setRaces(stateRaceMap[stateName]);
      if (!stateRaceMap[stateName].includes(selectedRace)) {
        setSelectedRace(stateRaceMap[stateName][0].toLowerCase()); // Default to the first race
      }
    }
  }, [stateName]);

  const fetchGinglesData = async (race, display) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/gingles/${display}/${stateName}/${race}`
      );
      setGinglesData(response.data);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

  useEffect(() => {
    fetchGinglesData(selectedRace, selectedDisplay);
  }, [stateName, selectedRace, selectedDisplay]);

  const handleRaceChange = (event) => {
    setSelectedRace(event.target.value);
  };

  const handleDisplayChange = (event) => {
    setSelectedDisplay(event.target.value);
    if (event.target.value === "race") {
      setSelectedRace(races[0].toLowerCase()); // Default to the first race for "race" display
    } else if (event.target.value === "income") {
      setSelectedRace(selectedRegion.toLowerCase());
    } else if (event.target.value === "income_race") {
      setSelectedRace(races[0].toLowerCase()); // Default to the first race for "income_race" display
    }
  };

  const handleRegionChange = (event) => {
    const selectedRegionType = event.target.value;
    setSelectedRegion(selectedRegionType);
    if (selectedDisplay === "income") {
      setSelectedRace(selectedRegionType.toLowerCase());
    }
  };

  const extractDataPoints = (precincts) => {
    const bidenPoints = [];
    const trumpPoints = [];
    precincts.forEach(([x, trumpY, bidenY]) => {
      bidenPoints.push({ x, y: bidenY });
      trumpPoints.push({ x, y: trumpY });
    });
    return { bidenPoints, trumpPoints };
  };

  let bidenPoints = [];
  let trumpPoints = [];
  let bidenRegressionPoints = [];
  let trumpRegressionPoints = [];
  let xMin = 0;
  let xMax = 100;

  if (ginglesData) {
    const data = extractDataPoints(ginglesData.precincts);
    bidenPoints = data.bidenPoints;
    trumpPoints = data.trumpPoints;
    bidenRegressionPoints = ginglesData.regression_points.map(([x, , bidenY]) => ({ x, y: bidenY }));
    trumpRegressionPoints = ginglesData.regression_points.map(([x, trumpY]) => ({ x, y: trumpY }));
    const allXValues = [...bidenPoints, ...trumpPoints].map((point) => point.x);
    xMin = Math.floor(Math.min(...allXValues));
    xMax = Math.ceil(Math.max(...allXValues));
  }

  const data = {
    datasets: [
      {
        label: 'Biden',
        data: bidenPoints,
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
      },
      {
        label: 'Trump',
        data: trumpPoints,
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
      {
        label: 'Biden Regression Line',
        data: bidenRegressionPoints,
        type: 'line',
        borderColor: 'rgba(0,0,255,2)',
        backgroundColor: 'rgba(0,0,255,2)',
        fill: false,
      },
      {
        label: 'Trump Regression Line',
        data: trumpRegressionPoints,
        type: 'line',
        borderColor: 'rgba(255,0,0,2)',
        backgroundColor: 'rgba(255,0,0,2)',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text:
            selectedDisplay === "income"
              ? "Income"
              : selectedDisplay === "income_race"
              ? "Z Value"
              : `Percent ${selectedRace.charAt(0).toUpperCase() + selectedRace.slice(1)}`,
        },
        ticks: {
          callback: (value) => {
            if (selectedDisplay === "income") {
              return `$${value.toLocaleString()}`;
            } else if (selectedDisplay === "income_race") {
              return `${value}`;
            } else {
              return `${value}%`;
            }
          },
        },
        min: selectedDisplay === "income" ? 0 : xMin,
        max: selectedDisplay === "income" ? Math.max(xMax, 100000) : xMax,
      },
      y: {
        title: {
          display: true,
          text: "Vote Share",
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div>
      <h3>Precinct-by-Precinct Voting and Demographic Analysis</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label htmlFor="display-select">Select Display:</label>
          <select id="display-select" value={selectedDisplay} onChange={handleDisplayChange}>
            <option value="race">Race</option>
            <option value="income">Income</option>
            <option value="income_race">Income/Race</option>
          </select>
          {selectedDisplay !== "income" && (
            <>
              <label htmlFor="race-select">Select Race:</label>
              <select id="race-select" value={selectedRace} onChange={handleRaceChange}>
                {races.map((race) => (
                  <option key={race} value={race.toLowerCase()}>
                    {race}
                  </option>
                ))}
              </select>
            </>
          )}
          {selectedDisplay === "income" && (
            <>
              <label htmlFor="region-select">Select Region:</label>
              <select id="region-select" value={selectedRegion} onChange={handleRegionChange}>
                {regions.map((region) => (
                  <option key={region} value={region.toLowerCase()}>
                    {region}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        <button onClick={() => setShowTable((prev) => !prev)}>
          {showTable ? "Chart Display" : "Table Display"}
        </button>
      </div>
      {showTable ? (
        <div style={{ maxHeight: '625px', overflowY: 'auto', marginTop: '20px' }}>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, backgroundColor: '#f1f1f1', zIndex: 1 }}>
                <th>X Value</th>
                <th>Biden Vote Share</th>
                <th>Trump Vote Share</th>
              </tr>
            </thead>
            <tbody>
              {ginglesData?.precincts.map(([x, trumpY, bidenY], index) => (
                <tr key={index}>
                  <td>{x}</td>
                  <td>{bidenY}%</td>
                  <td>{trumpY}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Scatter data={data} options={options} />
      )}
    </div>
  );
}
