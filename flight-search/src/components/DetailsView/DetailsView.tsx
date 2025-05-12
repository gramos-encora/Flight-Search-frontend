import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FlightOffer,
  Segment,
  TravelerPricing,
} from "../../models/FlightOffer";
import "../../styles/DetailsView.css";

const DetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const flight: FlightOffer = state?.flight;

  if (!flight) {
    return <div>No flight data available.</div>;
  }

  return (
    <div className="details-wrapper">
      <button className="back-button styled" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-layout">
        {/* Segmentos */}
        <div className="segments-column">
          {flight.itineraries.map((itinerary, idx) =>
            itinerary.segments.map((segment: Segment, index: number) => (
              <div key={index} className="segment-box">
                <h3>
                  Segment {idx + 1}-{index + 1}
                </h3>
                <p className="time-info">
                  {new Date(segment.departure.at).toLocaleString()} –{" "}
                  {new Date(segment.arrival.at).toLocaleString()}
                </p>
                <p className="route">
                  {segment.departure.cityName} ({segment.departure.iataCode}) →{" "}
                  {segment.arrival.cityName} ({segment.arrival.iataCode})
                </p>
                <p className="carrier">
                  Flight {segment.carrier.commonName} (
                  {segment.carrier.iataCode}) {segment.flightNumber}
                </p>
                {segment.operatingCarrier && (
                  <p className="operated">
                    Operated by {segment.operatingCarrier.commonName} (
                    {segment.operatingCarrier.iataCode})
                  </p>
                )}
                <p className="details">Aircraft: {segment.aircraft ?? "N/A"}</p>
                <p className="details">
                  Cabin: {segment.cabin ?? "N/A"}, Class:{" "}
                  {segment.clazz ?? "N/A"}
                </p>
                {segment.amenities && segment.amenities.length > 0 && (
                  <div className="fare-box">
                    <h4>Amenities</h4>
                    <ul>
                      {segment.amenities.map((amenity, i) => (
                        <li key={i}>
                          {amenity.name} -{" "}
                          {amenity.chargeable ? "Chargeable" : "Free"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Precio */}
        <div className="price-column">
          <div className="price-breakdown">
            <h3>Price Breakdown</h3>
            <p>
              <strong>Total:</strong> {flight.price.total}{" "}
              {flight.price.currency}
            </p>
            {flight.travelerPricings?.map((tp: TravelerPricing, i) => (
              <div key={i} className="per-traveler-box">
                <h4>
                  Traveler {tp.travelerId} - {tp.travelerType}
                </h4>
                <p>
                  <strong>Base:</strong> {tp.price.base} {tp.price.currency}
                </p>
                <p>
                  <strong>Total:</strong> {tp.price.total} {tp.price.currency}
                </p>
                {tp.price.fees?.map((fee, j) => (
                  <p key={j}>
                    <strong>Fee ({fee.type}):</strong> {fee.amount}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
