import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Chart from './Charts';
import axios from 'axios';
import IncomeChart from './IncomeGraph';
import VotingChart from './VotingGraph';
import ScatterPlot from './ScatterChart';
import CongressionalTable from './CongressionalTable';
import BoxWhiskerPlot from './BoxWhiskerPlot';
import EnsembleSummaryBarGraph from './EnsembleSummaryBarGraph';
import HistogramChart from './HistogramChart';
import RegionChart from './RegionChart';
import EcologicalInference from './EcologicalInference';
import '../styles/Tabs.css';

export default function InfoPanel({ stateName, currArea, handleArrowClick, currState, handleSelectedDistrict }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isPointLeft, setPointLeft] = useState(true);
  const [isMinimized, setMinimizeInfoPanel] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchStateData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(`http://localhost:8080/info/${stateName}`);
      setStateData(response.data);
    } catch (error) {
      console.error('Error fetching state data:', error);
    } finally {
      setLoading(false); // End loading
      console.log("HELLOOOOOO", stateData);
    }
  };

  useEffect(() => {
    setMinimizeInfoPanel(false);
    fetchStateData();
  }, [stateName]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleArrow = () => {
    setPointLeft((prev) => !prev);
    setMinimizeInfoPanel((prev) => !prev);

    handleArrowClick(!isMinimized);
  };

  // Render a loading state while fetching stateData
  if (loading) {
    return (
      <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px', marginLeft: "20px", marginRight: "20px"}}>
        Loading state data...
      </div>
    );
  }

  return (
    <div className={`info-panel ${isMinimized ? 'minimized' : ''}`}>
      {!isMinimized && (
        <>
          <div className='infoDiv'>
            <h2 className='stateNameInfoPanel'>{stateName}</h2>
            <div style={{ fontSize: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Current Area: </span>
              <span>{currArea}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Political Lean: </span>
              <span>{stateData?.winning_party?.toLocaleString() || ''}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Average Household Income ($): </span>
              <span>{stateData?.AVG_INC?.toLocaleString() || ''}</span>
            </div>
            <div style={{ fontSize: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Total State Population: </span>
              <span>{stateData?.TOT_POP?.toLocaleString() || ''} </span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Party Control: </span>
              <span>{stateData?.party_control_redistricting?.toLocaleString() || ''}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Precincts: </span>
              <span>{stateData?.total_precincts?.toLocaleString() || ''}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Drawing Process: </span>
              <a
                href={stateData?.drawing_process?.toLocaleString() || ''}
                target="_blank"
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                click here
              </a>
            </div>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab label="Overview" className="tabs-label" />
              <Tab label="Gingles" className="tabs-label" />
              <Tab label="Congressional Table" className="tabs-label" />
              <Tab label="Ecological Inference" className="tabs-label" />
              <Tab label="Ensemble Summary" className="tabs-label" />
              <Tab label="Ensemble Analysis" className="tabs-label" />
            </Tabs>
            <Box sx={{ padding: 2 }}>
              {activeTab === 0 && (
                <div className='tab-box'>
                  <div id="ensembleTableDiv">
                    <table id="ensembleTable">
                      <tr>
                        <td style={{ borderRight: '2px solid black' }} class="ensembleTableRow1"><strong>Available Ensembles</strong></td>
                        <td style={{ borderRight: '2px solid black' }} class="ensembleTableRow1"><strong>Number of District Plans</strong></td>
                        <td class="ensembleTableRow1"><strong>Population Equality Threshold</strong></td>
                      </tr>
                      <tr>
                        <td style={{ borderRight: '2px solid black' }}>Large Ensemble</td>
                        <td style={{ borderRight: '2px solid black' }}>5000 Plans</td>
                        <td>5%</td>
                      </tr>
                    </table>
                  </div>
                  <div className="topChartsContainer">
                    <div className="PopChart">
                      {/* {currArea && <Chart currArea={currArea} stateData={stateData} />} */}
                      <Chart currArea={currArea} stateData={stateData} />
                    </div>
                    <div className="VotingChart">
                      {currArea && (
                        <VotingChart currArea={currArea} currState={currState} stateData={stateData} />
                      )}
                    </div>
                  </div>
                  <div className="DoubleContainer">
                    <div className="IncomeChart">
                      {currArea && (
                        <IncomeChart currArea={currArea} currState={currState} stateData={stateData} />
                      )}
                    </div>
                    <div className="RegionChart">
                      {currArea && <RegionChart currArea={currArea} stateData={stateData} />}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className='tab-box'>
                  <ScatterPlot 
                  stateName={stateName} />
                </div>
              )}
              {activeTab === 2 && (
                <div className='tab-box'>
                  <CongressionalTable stateName={stateName} handleSelectedDistrict={handleSelectedDistrict} />
                </div>
              )}
              {activeTab === 3 && (
                <div className='tab-box'>
                  <EcologicalInference stateName={stateName} />
                </div>
              )}
              {activeTab === 4 && (
                <div className='tab-box'>
                  <EnsembleSummaryBarGraph stateName={stateName} />
                </div>
              )}
              {activeTab === 5 && (
                <div className='tab-box'>
                  <BoxWhiskerPlot stateName={stateName} />
                </div>
              )}
            </Box>
          </div>
        </>
      )}
      <div className={`infoMinimizeButtonDiv ${isMinimized ? 'minimized' : ''}`}>
        <button className="infoPanelArrow" onClick={toggleArrow}>
          <span
            className="infoPanelArrowTop"
            style={{
              transform: isPointLeft ? 'rotate(-135deg)' : 'rotate(-45deg)',
              transition: 'transform 0.3s',
            }}
          ></span>
          <span
            className="infoPanelArrowBottom"
            style={{
              transform: isPointLeft ? 'rotate(135deg)' : 'rotate(45deg)',
              transition: 'transform 0.3s',
            }}
          ></span>
        </button>
      </div>
    </div>
  );
}
