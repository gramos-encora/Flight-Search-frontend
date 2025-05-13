import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FareDetail,
  FlightOffer,
  Segment,
  TravelerPricing,
} from "../../models/FlightOffer";
import "../../styles/DetailsView.css";

const DetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const flight: FlightOffer = state?.flight;
  const [openAmenities, setOpenAmenities] = React.useState<{
    [key: string]: boolean;
  }>({});

  const toggleAmenities = (travelerId: string, segmentId: string) => {
    const key = `${travelerId}-${segmentId}`;
    setOpenAmenities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Función para extraer minutos totales de un string tipo "PT3H45M"
  const getMinutesFromISO = (iso: string) => {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = match?.[1] ? parseInt(match[1]) : 0;
    const minutes = match?.[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  };

  // Formatea minutos a "Xh Ym"
  const formatDuration = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h > 0 ? h + "h " : ""}${m > 0 ? m + "m" : ""}`.trim();
  };

  // Calculamos stops y duración total
  const stops =
    flight?.itineraries.reduce((acc, it) => acc + it.segments.length - 1, 0) ??
    0;
  const totalMinutes =
    flight?.itineraries.reduce(
      (acc, it) => acc + getMinutesFromISO(it.duration),
      0
    ) ?? 0;
  const duration = formatDuration(totalMinutes);

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
                <p>
                  <strong>Total Duration:</strong> {duration}
                </p>
                <p>
                  <strong>Total Stops:</strong> {stops}
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
                {tp.fareDetailsBySegment.map(
                  (fareBySegment: FareDetail, i) =>
                    fareBySegment.amenities &&
                    fareBySegment.amenities.length > 0 && (
                      <div key={i} className="fare-box">
                        <div
                          className="fare-box-header"
                          onClick={() =>
                            toggleAmenities(
                              tp.travelerId,
                              fareBySegment.segmentId
                            )
                          }
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h4>Segment {fareBySegment.segmentId}</h4>
                          <span>
                            {openAmenities[
                              `${tp.travelerId}-${fareBySegment.segmentId}`
                            ]
                              ? "▲"
                              : "▼"}
                          </span>
                        </div>

                        {/* Cabina y Clase */}
                        <p className="details">
                          Cabin: <strong>{fareBySegment.cabin ?? "N/A"}</strong>
                          , Class:
                          <strong>{fareBySegment.clazz ?? "N/A"}</strong>
                        </p>

                        {openAmenities[
                          `${tp.travelerId}-${fareBySegment.segmentId}`
                        ] && (
                          <ul>
                            {fareBySegment.amenities.map((amenity, i) => (
                              <li key={i}>
                                <span className="amenity-name">
                                  {amenity.name}
                                </span>{" "}
                                —{" "}
                                <span
                                  className={
                                    amenity.chargeable ? "chargeable" : "free"
                                  }
                                >
                                  {amenity.chargeable ? "Chargeable" : "Free"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
