import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchFlights } from "../../network/NetworkManager";
import "../../styles/FlightResultsView.css";

const FlightResultsView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;
  const [flights, setFlights] = useState<any[]>([]);
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

  const handleRowClick = (id: string) => {
    console.log("Clicked flight ID:", id);
  };

  if (loading) return <div>Loading flights...</div>;

  return (
    <div className="results-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Search
      </button>
      <h2>Available Flights</h2>
      <div className="flights-list">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="flight-row"
            onClick={() => handleRowClick(flight.id)}
          >
            <div>
              <strong>
                {flight.itineraries[0].segments[0].departure.iataCode}
              </strong>{" "}
              →{" "}
              <strong>
                {flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}
              </strong>
            </div>
            <div>
              {new Date(
                flight.itineraries[0].segments[0].departure.at
              ).toLocaleString()}{" "}
              -{" "}
              {new Date(
                flight.itineraries[0].segments.slice(-1)[0].arrival.at
              ).toLocaleString()}
            </div>
            <div>
              {flight.itineraries[0].segments[0].carrierCode} ·{" "}
              {flight.itineraries[0].duration.replace("PT", "").toLowerCase()}
            </div>
            <div>
              Total: {flight.price.currency} ${flight.price.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResultsView;
