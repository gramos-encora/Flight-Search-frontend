import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchFlights } from "../../network/NetworkManager";
import { FlightOffer } from "../../models/FlightOffer";
import "../../styles/FlightResultsView.css";

const FlightResultsView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formData) {
      navigate("/");
      return;
    }

    fetchFlights(formData)
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [formData, navigate]);

  if (loading) return <div>Loading flights...</div>;

  return (
    <div className="results-container">
      <button className="back-button styled" onClick={() => navigate("/")}>
        ← Back to Search
      </button>
      <h2>Available Flights</h2>
      <div className="flights-list">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="flight-row styled"
            onClick={() => navigate("/details", { state: { flight } })}
          >
            {flight.itineraries.map((itinerary, itineraryIndex) => {
              const segments = itinerary.segments;
              const first = segments[0];
              const last = segments[segments.length - 1];

              return (
                <div key={itineraryIndex} className="itinerary-section styled">
                  <h3>
                    {itineraryIndex === 0 ? "Outbound" : "Inbound"} Flight
                  </h3>
                  <div className="flight-section">
                    <strong>
                      {first.departure.cityName} ({first.departure.iataCode})
                    </strong>{" "}
                    →{" "}
                    <strong>
                      {last.arrival.cityName} ({last.arrival.iataCode})
                    </strong>
                  </div>
                  <div className="flight-section">
                    {new Date(first.departure.at).toLocaleString()} –{" "}
                    {new Date(last.arrival.at).toLocaleString()}
                  </div>
                </div>
              );
            })}
            <div className="flight-section">
              <strong>Total:</strong> {flight.price.currency} $
              {flight.price.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResultsView;
