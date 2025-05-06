// DetailsView.tsx
import React from "react";
import "../../styles/DetailsView.css";

// Mock data (igual que en resultados)
const mockFlightDetails = {
  id: "1",
  departure: "2025-06-01T08:00",
  arrival: "2025-06-01T12:30",
  from: { name: "San Francisco International", code: "SFO" },
  to: { name: "Los Angeles International", code: "LAX" },
  airline: { name: "Delta Air Lines", code: "DL" },
  operating: { name: "SkyWest Airlines", code: "OO" },
  segments: [
    {
      departure: "2025-06-01T08:00",
      arrival: "2025-06-01T09:30",
      airline: { code: "DL", name: "Delta" },
      flightNumber: "123",
      operating: { code: "OO", name: "SkyWest" },
      aircraft: "Airbus A320",
      cabin: "Economy",
      class: "Y",
      amenities: [
        { name: "Wi-Fi", chargeable: true },
        { name: "Entertainment", chargeable: false },
      ],
    },
    {
      departure: "2025-06-01T10:00",
      arrival: "2025-06-01T12:30",
      airline: { code: "DL", name: "Delta" },
      flightNumber: "456",
      operating: null,
      aircraft: "Boeing 737",
      cabin: "Economy",
      class: "Y",
      amenities: [{ name: "Meal", chargeable: false }],
    },
  ],
  price: {
    base: 280,
    total: 320,
    fees: 40,
    currency: "USD",
    perTraveler: 320,
  },
};

const DetailsView: React.FC = () => {
  const flight = mockFlightDetails; // Aquí usarías un fetch por ID real

  return (
    <div className="details-container">
      <button className="back-button" onClick={() => console.log("back")}>
        ← Back to Results
      </button>
      <h2>Flight Details</h2>

      <div className="summary">
        <p>
          <strong>
            {flight.from.name} ({flight.from.code})
          </strong>{" "}
          →{" "}
          <strong>
            {flight.to.name} ({flight.to.code})
          </strong>
        </p>
        <p>
          {new Date(flight.departure).toLocaleString()} -{" "}
          {new Date(flight.arrival).toLocaleString()}
        </p>
        <p>
          Airline: {flight.airline.name} ({flight.airline.code})
        </p>
        {flight.operating && flight.operating.code !== flight.airline.code && (
          <p>
            Operated by: {flight.operating.name} ({flight.operating.code})
          </p>
        )}
      </div>

      <h3>Segments</h3>
      {flight.segments.map((seg, index) => (
        <div key={index} className="segment">
          <p>
            {new Date(seg.departure).toLocaleString()} →{" "}
            {new Date(seg.arrival).toLocaleString()}
          </p>
          <p>
            {seg.airline.name} ({seg.airline.code}) · Flight {seg.flightNumber}
          </p>
          {seg.operating && (
            <p>
              Operated by: {seg.operating.name} ({seg.operating.code})
            </p>
          )}
          <p>Aircraft: {seg.aircraft}</p>
          <p>
            Cabin: {seg.cabin}, Class: {seg.class}
          </p>
          <div className="amenities">
            <strong>Amenities:</strong>
            <ul>
              {seg.amenities.map((am, i) => (
                <li key={i}>
                  {am.name} {am.chargeable ? "(Chargeable)" : "(Free)"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <h3>Price Breakdown</h3>
      <div className="price-box">
        <p>
          Base Price: {flight.price.currency} ${flight.price.base}
        </p>
        <p>
          Fees: {flight.price.currency} ${flight.price.fees}
        </p>
        <p>
          <strong>
            Total: {flight.price.currency} ${flight.price.total}
          </strong>
        </p>
        <p>
          Per Traveler: {flight.price.currency} ${flight.price.perTraveler}
        </p>
      </div>
    </div>
  );
};

export default DetailsView;
