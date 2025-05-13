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
  const [sortBy, setSortBy] = useState<"price" | "duration" | "none">("none");

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

  const getMinutesFromISO = (isoDuration: string): number => {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = match?.[1] ? parseInt(match[1]) : 0;
    const minutes = match?.[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  };

  const parseDuration = (isoDuration: string): string => {
    const totalMinutes = getMinutesFromISO(isoDuration);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}m` : ""}`.trim();
  };

  const getTotalDuration = (flight: FlightOffer): number => {
    return flight.itineraries.reduce(
      (sum, itinerary) => sum + getMinutesFromISO(itinerary.duration),
      0
    );
  };

  const getTotalPrice = (flight: FlightOffer) => {
    return parseFloat(flight.price.total);
  };

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") {
      return getTotalPrice(a) - getTotalPrice(b);
    } else if (sortBy === "duration") {
      return getTotalDuration(a) - getTotalDuration(b);
    }
    return 0;
  });

  if (loading) return <div>Loading flights...</div>;

  return (
    <div className="results-container">
      <button className="back-button styled" onClick={() => navigate("/")}>
        ← Back to Search
      </button>
      <h2>Available Flights</h2>
      <div className="sort-controls styled">
        <label htmlFor="sort-select" className="sort-label">
          Sort by:
        </label>
        <select
          id="sort-select"
          className="sort-select"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "price" | "duration" | "none")
          }
        >
          <option value="none">None</option>
          <option value="price">Total Price</option>
          <option value="duration">Total Duration</option>
        </select>
      </div>

      <div className="flights-list">
        {sortedFlights.map((flight) => (
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
