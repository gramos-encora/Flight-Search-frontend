import { Airline } from "../models/Airline";
import { Airport } from "../models/Airport";
import { FlightOffer } from "../models/FlightOffer";
import { SearchForm } from "../models/SearchForm";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchAirlines = async (query: string): Promise<Airline> => {
  const response = await fetch(`${API_BASE_URL}/airlines/${query}`);
  if (!response.ok) throw new Error("Failed to fetch airlines");

  const data = await response.json();
  return data;
};

export const fetchAirports = async (query: string): Promise<Airport[]> => {
  const response = await fetch(`${API_BASE_URL}/airports/${query}`);
  if (!response.ok) throw new Error("Failed to fetch airports");

  const data = await response.json();
  return data;
};

export const fetchFlights = async (
  params: SearchForm
): Promise<FlightOffer[]> => {
  const query = new URLSearchParams({
    origin: params.departureAirport,
    destination: params.arrivalAirport,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    adults: String(params.adults),
    nonStop: String(params.isNonStop),
    currencyCode: params.currency,
  });

  const response = await fetch(`${API_BASE_URL}/flight-offers?${query}`);
  if (!response.ok) throw new Error("Failed to fetch flights");

  const raw = await response.json();
  const rawData = raw.data;
  const carriersDict = raw.dictionaries.carriers || {};
  const aircraftsDict = raw.dictionaries.aircraft || {};

  // --- Extrae todos los códigos IATA únicos ---
  const uniqueIataCodes = new Set<string>();
  rawData.forEach((flight: any) => {
    flight.itineraries.forEach((itinerary: any) => {
      itinerary.segments.forEach((segment: any) => {
        uniqueIataCodes.add(segment.departure.iataCode);
        uniqueIataCodes.add(segment.arrival.iataCode);
      });
    });
  });

  // --- Promesas cacheadas por IATA ---
  const airportPromises = new Map<string, Promise<Airport>>();

  for (const code of uniqueIataCodes) {
    if (!airportPromises.has(code)) {
      const promise = fetchAirports(code).then((res) => {
        const airport = res.find((a) => a.iataCode === code);
        if (!airport) throw new Error(`No airport found for ${code}`);
        return airport;
      });
      airportPromises.set(code, promise);
    }
  }

  // --- Espera a que todos los aeropuertos estén resueltos ---
  const resolvedAirports: Record<string, Airport> = {};
  await Promise.all(
    Array.from(airportPromises.entries()).map(async ([code, promise]) => {
      resolvedAirports[code] = await promise;
    })
  );

  // --- Mapeo final de ofertas de vuelo ---
  const flights: FlightOffer[] = rawData.map((flight: any) => ({
    id: flight.id,
    itineraries: flight.itineraries.map((itinerary: any) => ({
      duration: itinerary.duration,
      segments: itinerary.segments.map((segment: any) => ({
        id: segment.id,
        departure: {
          ...resolvedAirports[segment.departure.iataCode],
          at: segment.departure.at,
          terminal: segment.departure.terminal,
        },
        arrival: {
          ...resolvedAirports[segment.arrival.iataCode],
          at: segment.arrival.at,
          terminal: segment.arrival.terminal,
        },
        duration: segment.duration,
        carrier: {
          iataCode: segment.carrierCode,
          commonName: carriersDict[segment.carrierCode] || segment.carrierCode,
        },
        flightNumber: segment.number,
        operatingCarrier: segment.operating?.carrierCode
          ? {
              iataCode: segment.operating.carrierCode,
              commonName:
                carriersDict[segment.operating.carrierCode] ||
                segment.operating.carrierCode,
            }
          : undefined,
        aircraft: aircraftsDict[segment.aircraft.code] || segment.aircraft.code,
      })),
    })),
    price: {
      currency: flight.price.currency,
      total: flight.price.total,
    },
    travelerPricings: flight.travelerPricings.map((tp: any) => ({
      travelerId: tp.travelerId,
      travelerType: tp.travelerType,
      price: {
        currency: tp.price.currency,
        total: tp.price.total,
        base: tp.price.base,
        fees: tp.price.fees || [],
      },
      fareDetailsBySegment: tp.fareDetailsBySegment.map((fds: any) => ({
        segmentId: fds.segmentId,
        cabin: fds.cabin,
        fareBasis: fds.fareBasis,
        clazz: fds.clazz || undefined,
        includedCheckedBags: fds.includedCheckedBags || undefined,
        includedCabinBags: fds.includedCabinBags || undefined,
      })),
    })),
  }));

  return flights;
};
