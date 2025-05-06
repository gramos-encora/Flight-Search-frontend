import { useState } from "react";
import "./App.css";
import React from "react";
import SearchView from "./components/SearchView/SearchView";
import FlightResultsView from "./components/SearchResults/FlightResultsView";

function App() {
  return (
    <>
      <FlightResultsView></FlightResultsView>
    </>
  );
}

export default App;
