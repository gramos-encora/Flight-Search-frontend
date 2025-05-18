import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import React from "react";
import FlightResultsView from "./components/FlightResults/FlightResultsView";
import DetailsView from "./components/DetailsView/DetailsView";
import SearchView from "./components/SearchView/SearchView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchView />} />
        <Route path="/results" element={<FlightResultsView />} />
        <Route path="/details" element={<DetailsView />} />
      </Routes>
    </Router>
  );
}

export default App;
