import React from 'react';
import '../styles/App.css';

export default function Legend({ isVisible, legendColor, colors }) {
  if (!isVisible || !colors) return null; 

  if(legendColor === "voting"){
    return(
    <>
        <div className="legend-container">
          <h4>Republican</h4>
          <ul className="legend-list">
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(0, 100%, 20%)' }}></span>
                200k+
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(0, 100%, 30%)' }}></span>
                100k-200k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(0, 100%, 45%)' }}></span>
                50k-100k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(0, 100%, 60%)' }}></span>
                35k-50k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(0, 100%, 75%)' }}></span>
                20k-35k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(0, 100%, 90%)' }}></span>
                10k-20k
              </li>
          </ul>
        </div>
        <div className="legend-container-2">
          <h4>Democratic</h4>
          <ul className="legend-list">
          <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(240, 100%, 20%)' }}></span>
                200k+
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(240, 100%, 30%)' }}></span>
                100k-200k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(240, 100%, 45%)' }}></span>
                50k-100k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(240, 100%, 60%)' }}></span>
                35k-50k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(240, 100%, 75%)' }}></span>
                20k-35k
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: 'hsl(240, 100%, 90%)' }}></span>
                10k-20k
              </li>
          </ul>
        </div>
      </>
    );
      
  }
  else{
  return (
    <div className="legend-container">
      <h4>{legendColor.charAt(0).toUpperCase() + legendColor.slice(1)}</h4>
      <ul className="legend-list">
        {Object.entries(colors).map(([label, color]) => (
          <li key={label}>
            <span className="legend-color" style={{ backgroundColor: color }}></span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
}