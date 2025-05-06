import React, { useState } from "react";
import "../../styles/SearchView.css";

const SearchView: React.FC = () => {
  return (
    <div className="search-container">
      <h2 className="search-title">Flight Search</h2>
      <form className="search-form">
        <label>
          Departure Airport
          <input type="text" placeholder="e.g. San Francisco" />
        </label>

        <label>
          Arrival Airport
          <input type="text" placeholder="e.g. Los Angeles" />
        </label>

        <label>
          Departure Date
          <input type="date" min={new Date().toISOString().split("T")[0]} />
        </label>

        <label>
          Return Date
          <input type="date" min={new Date().toISOString().split("T")[0]} />
        </label>

        <label>
          Currency
          <select>
            <option value="USD">USD</option>
            <option value="MXN">MXN</option>
            <option value="EUR">EUR</option>
          </select>
        </label>

        <label className="nonstop-checkbox">
          <input type="checkbox" /> Non-stop
        </label>

        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchView;
