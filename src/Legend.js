// Legend.js
import React from 'react';
import './App.css';
import useFetchLegendColor from './useFetchLegendColor';

export default function Legend({ isVisible, legendColor}) {
  const { colors, loading, error } = useFetchLegendColor(legendColor);

  if (!isVisible || loading) return null;
  if (error) return <div>Error: {error}</div>;

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
