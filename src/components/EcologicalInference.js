import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const EcologicalInference = ({ stateName }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedDisplay, setSelectedDisplay] = useState("race");
  const [selectedRace, setSelectedRace] = useState("white");
  const [selectedCandidate, setSelectedCandidate] = useState("biden");
  const [ecoData, setEcoData] = useState(null);

  const races = stateName.toLowerCase() === "louisiana" ? ["White", "Black"] : ["White", "Black", "Asian"];
  const incomeLevels = ["Low Income", "Medium Income", "High Income"];
  const candidates = ["Biden", "Trump"];

  const fetchEcoData = async (raceOrIncome, display, candidate) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/ecologicalinference/${display}/${stateName}/${raceOrIncome}/${candidate}`
      );
      setEcoData(response.data);
      console.log("THIS IS ECO DATA: ", response.data);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

  useEffect(() => {
    const criteria = selectedDisplay === "race" ? selectedRace : "income_level";
    fetchEcoData(criteria, selectedDisplay, selectedCandidate);
  }, [stateName, selectedRace, selectedDisplay, selectedCandidate]);

  useEffect(() => {
    const validRaces = stateName.toLowerCase() === "louisiana" ? ["white", "black"] : ["white", "black", "asian"];
    if (!validRaces.includes(selectedRace)) {
      setSelectedRace(validRaces[0].toLowerCase());
    }
    setChartData(null); // Clear chart while fetching new data
  }, [stateName]);

  useEffect(() => {
    if (ecoData && Array.isArray(ecoData.data)) {
      // Extract group data from ecoData
      const group1Values = ecoData.data.map((row) => row.group1);
      const group2Values = ecoData.data.map((row) => row.group2);
  
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
  
      setChartData({
        labels: histogram1.labels,
        datasets: [
          {
            label: selectedRace,
            data: histogram1.counts,
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 1,
            barThickness: 8,
          },
          {
            label: "non_" + selectedRace,
            data: histogram2.counts,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            barThickness: 8,
          },
        ],
      });
    } else {
      console.warn("ecoData.data is empty or not an array");
    }
  }, [ecoData]);

  return (
    <div>
      <h1>Ecological Inference</h1>
      <div>
        <label>
          Display Type:
          <select value={selectedDisplay} onChange={(e) => setSelectedDisplay(e.target.value)}>
            <option value="race">Race</option>
            <option value="income">Income</option>
          </select>
        </label>

        {selectedDisplay === "race" ? (
          <label>
            Race:
            <select value={selectedRace} onChange={(e) => setSelectedRace(e.target.value.toLowerCase())}>
              {races.map((race) => (
                <option key={race} value={race.toLowerCase()}>{race}</option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            Income Level:
            <select value={selectedRace} onChange={(e) => setSelectedRace(e.target.value.toLowerCase())}>
              {incomeLevels.map((level) => (
                <option key={level} value={level.toLowerCase().replace(/ /g, '_')}>{level}</option>
              ))}
            </select>
          </label>
        )}

        <label>
          Candidate:
          <select value={selectedCandidate} onChange={(e) => setSelectedCandidate(e.target.value.toLowerCase())}>
            {candidates.map((candidate) => (
              <option key={candidate} value={candidate.toLowerCase()}>{candidate}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="chart-container">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Support for " + selectedCandidate.charAt(0).toUpperCase() + selectedCandidate.slice(1),
                },
                legend: {
                  display: true,
                  position: 'top',
                },
              },
              scales: {
                x: { title: { display: true }, stacked: false},
                y: { title: { display: true } },
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

export default EcologicalInference;
