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

  const parseDuration = (isoDuration: string) => {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return "0m";
    const hours = match[1] ? `${match[1]}h` : "";
    const minutes = match[2] ? `${match[2]}m` : "";
    return `${hours} ${minutes}`.trim();
  };

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
              const stops = segments.length - 1;
              const duration = parseDuration(itinerary.duration);

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
                  <div className="flight-section">
                    <strong>Duration:</strong> {duration} |{" "}
                    <strong>Stops:</strong> {stops}
                  </div>
                  <ul className="segment-list">
                    {segments.map((seg, idx) => (
                      <li key={idx}>
                        {seg.departure.iataCode} → {seg.arrival.iataCode} |
                        Flight {seg.carrier.iataCode} {seg.flightNumber}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div className="flight-section">
              <strong>Price per Traveler:</strong> {flight.price.currency} $
              {flight.travelerPricings[0].price.total}
            </div>
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
