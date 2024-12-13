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
import '../styles/Tabs.css';

export default function InfoPanel({ stateName, currArea, handleArrowClick, currState, handleSelectedDistrict }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isPointLeft, setPointLeft] = useState(true);
  const [isMinimized, setMinimizeInfoPanel] = useState(false);
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    setMinimizeInfoPanel(false);
    fetchStateData();
  }, [stateName]);

  const fetchStateData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/info/${stateName}`);
      setStateData(response.data);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleArrow = () => {
    setPointLeft((prev) => !prev);
    setMinimizeInfoPanel((prev) => !prev);

    handleArrowClick(!isMinimized);
  };

  const getPoliticalLean = () => {
    switch (currArea) {
      case 'Louisiana':
        return 'Republican';
      case 'New Jersey':
        return 'Republican';
      default:
        return 'Democratic'; 
    }
  };

  const getPrecinctAmt = () => {
    switch (currArea) {
      case 'Louisiana':
        return "4,864";
      case 'New Jersey':
        return "2,324";
      default:
        return "$97,126"; 
    }
  };

  return (
    <div className={`info-panel ${isMinimized ? 'minimized' : ''}`}>
      {!isMinimized && (
        <>
          <div className='infoDiv'>
            <h2 className='stateNameInfoPanel'>{stateName}</h2>
            <div style={{fontSize: "20px"}}>
              <span style={{ fontWeight: 'bold' }}>Current Area: </span>
              <span>{currArea}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Political Lean: </span>
              <span>{getPoliticalLean()}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Median Household Income: </span>
              <span>{stateData?.averageHouseholdIncomeDistribution?.toLocaleString() || ""}</span>
            </div>
            <div style={{fontSize: "20px"}}>
              <span style={{ fontWeight: 'bold' }}>State Population: </span>
              <span>{stateData?.statePopulation || ''} </span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Party Control: </span>
              <span>{stateData?.partyControlRedistricting?.toLocaleString() || ""}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Precinct: </span>
              <span>{getPrecinctAmt()}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Drawing Process: </span>
              <span style={{ cursor: "pointer", textDecoration: 'underline' }}>click here</span>
            </div>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab label="Overview" className="tabs-label"/>
              <Tab label="Precinct Voting Analysis" className="tabs-label"/>
              <Tab label="Congressional Table" className="tabs-label"/>
              <Tab label="Ensemble Summary" className="tabs-label"/>
              <Tab label="Ensemble Analysis" className="tabs-label"/>
              <Tab label="Ecological Inference" className="tabs-label"/>
            </Tabs>
            <Box sx={{ padding: 2 }}>
              {activeTab === 0 && (
                <div className='tab-box'>
                  <div className="topChartsContainer">
                    <div className="PopChart">
                      {currArea && <Chart currArea={currArea} />}
                    </div>
                    <div className="VotingChart">
                      {currArea && <VotingChart currArea={currArea} currState={currState}/>}
                    </div>
                  </div>
                  <div className="IncomeChart">
                    {currArea && <IncomeChart currArea={currArea} currState={currState}/>}
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className='tab-box'>
                  <ScatterPlot
                    stateName={stateName}
                  />
                </div>
              )}
              {activeTab === 2 && 
                <div className='tab-box'>
                    <CongressionalTable 
                      stateName={stateName}
                      handleSelectedDistrict = {handleSelectedDistrict}
                    />
                </div>
              }
              {activeTab === 3 && 
                <div className='tab-box'>
                    <EnsembleSummaryBarGraph
                      stateName={stateName}
                    />
                </div>  
              }
              {activeTab === 4 && 
                <div className='tab-box'>
                    <BoxWhiskerPlot
                      stateName={stateName}
                    />
                </div>
              }
            </Box>
          </div>
        </>
      )}
      <div className={`infoMinimizeButtonDiv ${isMinimized ? 'minimized' : ''}`}>
        <button className="infoPanelArrow" onClick={toggleArrow}>
          <span className= "infoPanelArrowTop" style={{ transform: isPointLeft ? 'rotate(-135deg)' : 'rotate(-45deg)', transition: 'transform 0.3s' }}></span>
          <span className= "infoPanelArrowBottom" style={{ transform: isPointLeft ? 'rotate(135deg)' : 'rotate(45deg)', transition: 'transform 0.3s' }}></span>
        </button>
      </div>
    </div>
  );
}
