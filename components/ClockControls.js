// components/ClockControls.js
import React from 'react';

const ClockControls = ({ searchValue, onSearchChange, onSortChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search for a time zone..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div>
        <label>
          <input
            type="radio"
            name="sort"
            value="time"
            defaultChecked
            onChange={(e) => onSortChange(e.target.value)}
          />
          Sort by Time
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="name"
            onChange={(e) => onSortChange(e.target.value)}
          />
          Sort by Name
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="offset"
            onChange={(e) => onSortChange(e.target.value)}
          />
          Sort by UTC Offset
        </label>
      </div>
    </div>
  );
};

export default ClockControls;
