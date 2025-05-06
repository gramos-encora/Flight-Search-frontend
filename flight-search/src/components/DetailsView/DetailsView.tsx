import React from "react";
import "../../styles/DetailsView.css";

// Mock data (igual que en resultados)
const flight = {
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
  priceBreakdown: {
    base: 280,
    total: 320,
    fees: 40,
    currency: "USD",
    perTraveler: 320,
  },
};

const DetailsView = () => {
  const { segments, priceBreakdown } = flight;

  return (
    <div className="details-wrapper">
      <button className="back-button" onClick={() => console.log("back")}>
        ← Back
      </button>

      <div className="details-layout">
        {/* Segmentos */}
        <div className="segments-column">
          {segments.map((segment: any, index: number) => (
            <div key={index} className="segment-box">
              <h3>Segment {index + 1}</h3>
              <p>
                {segment.departure} - {segment.arrival}
              </p>
              <p>
                {flight.from.name} ({flight.from.code}) - {flight.to.name} (
                {flight.to.code})
              </p>
              <p>
                {segment.airline.name} ({segment.airline.code}){" "}
                {segment.flightNumber}
              </p>
              {segment.operating && (
                <p>
                  Operated by {segment.operating.name} ({segment.operating.code}
                  )
                </p>
              )}
              <p>Aircraft: {segment.aircraft}</p>
              <p>
                Cabin: {segment.cabin}, Class: {segment.class}
              </p>

              <div className="fare-box">
                <h4>Travelers fare details</h4>
                <ul>
                  {segment.amenities.map((amenity: any, i: number) => (
                    <li key={i}>
                      {amenity.name} -{" "}
                      {amenity.chargeable ? "Chargeable" : "Free"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="price-column">
          <div className="price-breakdown">
            <h3>Price Breakdown</h3>
            <p>
              <strong>Base:</strong> {priceBreakdown.base}{" "}
              {priceBreakdown.currency}
            </p>
            <p>
              <strong>Fees:</strong> {priceBreakdown.fees}{" "}
              {priceBreakdown.currency}
            </p>
            <p>
              <strong>Total:</strong> {priceBreakdown.total}{" "}
              {priceBreakdown.currency}
            </p>

            <div className="per-traveler-box">
              <h4>Per Traveler</h4>
              <p>
                {priceBreakdown.perTraveler} {priceBreakdown.currency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
