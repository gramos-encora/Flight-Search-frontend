import React from "react";
import "../../styles/FlightResultsView.css";

// Dummy data for mockup purposes
const mockFlights = [
  {
    id: "1",
    departure: "2025-06-01T08:00",
    arrival: "2025-06-01T12:30",
    from: { name: "San Francisco International", code: "SFO" },
    to: { name: "Los Angeles International", code: "LAX" },
    airline: { name: "Delta Air Lines", code: "DL" },
    duration: "4h 30m",
    price: 320,
    currency: "USD",
  },
  {
    id: "2",
    departure: "2025-06-01T09:00",
    arrival: "2025-06-01T13:00",
    from: { name: "San Francisco International", code: "SFO" },
    to: { name: "Los Angeles International", code: "LAX" },
    airline: { name: "American Airlines", code: "AA" },
    duration: "4h 0m",
    price: 280,
    currency: "USD",
  },
];

const FlightResultsView: React.FC = () => {
  const handleRowClick = (id: string) => {
    console.log(id);
  };

  return (
    <div className="results-container">
      <button className="back-button" onClick={() => console.log("back")}>
        ← Back to Search
      </button>
      <h2>Available Flights</h2>
      <div className="flights-list">
        {mockFlights.map((flight) => (
          <div
            key={flight.id}
            className="flight-row"
            onClick={() => handleRowClick(flight.id)}
          >
            <div>
              <strong>
                {flight.from.name} ({flight.from.code})
              </strong>{" "}
              →{" "}
              <strong>
                {flight.to.name} ({flight.to.code})
              </strong>
            </div>
            <div>
              {new Date(flight.departure).toLocaleString()} -{" "}
              {new Date(flight.arrival).toLocaleString()}
            </div>
            <div>
              {flight.airline.name} ({flight.airline.code}) · {flight.duration}
            </div>
            <div>
              Total: {flight.currency} ${flight.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResultsView;
