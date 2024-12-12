import React, { useState } from 'react';
import '../styles/App.css';

const Tab = ({ isVisible, stateName, onPrecinctsClickLA, onPrecinctsClickNJ, onDistrictsClick, fakecurrArea, changeLegendColor2}) => {
  // State to track the active legend buttons
  const [activeLegendButton, setActiveLegendButton] = useState('votingbutton'); // Set initial highlight for Voting
  // State to track the active precinct or district button
  const [activePrecinctDistrict, setActivePrecinctDistrict] = useState('district'); // Set initial highlight for Districts

  const handleLegendButtonClick = (buttonId) => {
    setActiveLegendButton(buttonId);
    // Call the respective function based on the button clicked
    if (buttonId === 'votingbutton') changeLegendColor2("voting");
    else if (buttonId === 'racebutton') changeLegendColor2("race");
    else if (buttonId === 'incomebutton') changeLegendColor2("income");
  };

  const handlePrecinctDistrictClick = (type) => {
    setActivePrecinctDistrict(type);
    if (type === 'precinct') {
      if (stateName === "Louisiana") onPrecinctsClickLA();
      else if (stateName === "New Jersey") onPrecinctsClickNJ();
    } else {
      onDistrictsClick();
    }
  };

  return (
    <div className={`tab ${isVisible ? 'slide-in' : 'slide-out'}`}>
      <div className="columnizebutton">
        <button 
          id="votingbutton" 
          className={activeLegendButton === 'votingbutton' ? 'active' : ''} 
          onClick={() => handleLegendButtonClick('votingbutton')}
        >
          Voting
        </button>
        <button 
          id="racebutton" 
          className={activeLegendButton === 'racebutton' ? 'active' : ''} 
          onClick={() => handleLegendButtonClick('racebutton')}
        >
          Race
        </button>
        <button 
          id="incomebutton" 
          className={activeLegendButton === 'incomebutton' ? 'active' : ''} 
          onClick={() => handleLegendButtonClick('incomebutton')}
        >
          Income
        </button>
        
        {/* <div id="precinct-district-buttons"> */}
        <button 
          id="districtbutton" 
          className={activePrecinctDistrict === 'district' ? 'active' : ''} 
          onClick={() => handlePrecinctDistrictClick('district')}
        >
          Districts
        </button>

        {stateName === "Louisiana" && (
          <button 
            id="precinctbutton" 
            className={activePrecinctDistrict === 'precinct' ? 'active' : ''} 
            onClick={() => handlePrecinctDistrictClick('precinct')}
          >
            Precincts
          </button>
        )}
        {stateName === "New Jersey" && (
          <button 
            id="precinctbutton" 
            className={activePrecinctDistrict === 'precinct' ? 'active' : ''} 
            onClick={() => handlePrecinctDistrictClick('precinct')}
          >
            Precincts
          </button>
        )}
        {/* </div> */}
      </div>

      <div id="fakecurrArea">
        {fakecurrArea}
      </div>

    </div>
  );
};

export default Tab;
