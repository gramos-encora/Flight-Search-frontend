import { Airline } from "./Airline";
import { Airport, AirportInfo } from "./Airport";

export interface FlightOfferResponse {
  data: FlightOfferRaw[];
  dictionaries: {
    carriers: Record<string, string>;
  };
}

interface FlightOfferRaw {
  id: string;
  itineraries: RawItinerary[];
  price: RawPrice;
}

interface RawItinerary {
  duration: string;
  segments: RawSegment[];
}

interface RawSegment {
  id: string;
  carrierCode: string;
  departure: RawLocation;
  arrival: RawLocation;
  duration: string;
}

interface RawLocation {
  iataCode: string;
  at: string;
}

interface RawPrice {
  currency: string;
  total: string;
}

// Tu modelo enriquecido
export interface FlightOffer {
  id: string;
  itineraries: Itinerary[];
  price: RawPrice;
}

interface Itinerary {
  duration: string;
  segments: Segment[];
}

interface Segment {
  id: string;
  departure: AirportInfo;
  arrival: AirportInfo;
  duration: string;
  carrier: Airline;
}
