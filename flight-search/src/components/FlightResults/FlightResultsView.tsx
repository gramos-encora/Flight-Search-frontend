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
        console.log("Fetched flights:", data);
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
          <div key={flight.id} className="flight-row styled">
            {flight.itineraries.map((itinerary, itineraryIndex) => {
              const segments = itinerary.segments;
              const firstSegment = segments[0];
              const lastSegment = segments[segments.length - 1];

              return (
                <div key={itineraryIndex} className="itinerary-section styled">
                  <h3>
                    {itineraryIndex === 0
                      ? "Outbound Flight"
                      : "Inbound Flight"}
                  </h3>

                  <div className="flight-section">
                    <strong>
                      {firstSegment.departure.cityName ??
                        firstSegment.departure.iataCode}{" "}
                      ({firstSegment.departure.iataCode})
                    </strong>{" "}
                    →{" "}
                    <strong>
                      {lastSegment.arrival.cityName ??
                        lastSegment.arrival.iataCode}{" "}
                      ({lastSegment.arrival.iataCode})
                    </strong>
                  </div>

                  <div className="flight-section">
                    {new Date(firstSegment.departure.at).toLocaleString()} –{" "}
                    {new Date(lastSegment.arrival.at).toLocaleString()}
                  </div>

                  {segments.map((segment, index) => (
                    <div key={index} className="segment-details styled">
                      <div>
                        <strong>
                          {segment.carrier?.commonName ??
                            segment.carrier.iataCode}
                        </strong>{" "}
                        ({segment.carrier.iataCode})
                      </div>
                      <div>
                        {segment.departure.cityName ??
                          segment.departure.iataCode}{" "}
                        → {segment.arrival.cityName ?? segment.arrival.iataCode}
                      </div>
                      <div>
                        Duration:{" "}
                        {segment.duration?.replace("PT", "").toLowerCase()}
                      </div>
                    </div>
                  ))}
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
