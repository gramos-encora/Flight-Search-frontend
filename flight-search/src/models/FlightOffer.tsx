import { Airline } from "./Airline";
import { AirportInfo } from "./Airport";

interface RawPrice {
  currency: string;
  total: string;
}

// Enriquecido
export interface FlightOffer {
  id: string;
  itineraries: Itinerary[];
  price: RawPrice;
  travelerPricings?: TravelerPricing[];
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Segment {
  id: string;
  departure: AirportInfo;
  arrival: AirportInfo;
  duration: string;
  carrier: Airline;
  flightNumber?: string;
  operatingCarrier?: Airline;
  aircraft?: { code: string };
  cabin?: string;
  clazz?: string;
  amenities?: Amenity[];
}

export interface Amenity {
  name: string;
  chargeable: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
    fees?: Fee[];
  };
  fareDetailsBySegment: FareDetail[];
}

export interface FareDetail {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  clazz?: string;
  includedCheckedBags?: { quantity: number };
  includedCabinBags?: { quantity: number };
}

export interface Fee {
  type: string;
  amount: string;
}
