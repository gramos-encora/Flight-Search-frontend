import { Airline } from "../models/Airline";
import { Airport } from "../models/Airport";
import { SearchForm } from "../models/SearchForm";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchAirlines = async (query: string): Promise<Airline> => {
  const response = await fetch(`${API_BASE_URL}/airlines/${query}`);
  if (!response.ok) throw new Error("Failed to fetch airlines");

  const data = await response.json();
  console.log("Airline data:", data);
  return data;
};

export const fetchAirports = async (query: string): Promise<Airport[]> => {
  const response = await fetch(`${API_BASE_URL}/airports/${query}`);
  if (!response.ok) throw new Error("Failed to fetch airports");

  const data = await response.json();
  console.log("Airport data:", data);
  return data;
};

export const fetchFlights = async (params: SearchForm): Promise<any[]> => {
  const query = new URLSearchParams({
    origin: params.departureAirport,
    destination: params.arrivalAirport,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    adults: String(1),
    nonStop: String(params.isNonStop),
    currencyCode: params.currency,
  });

  const response = await fetch(`${API_BASE_URL}/flight-offers?${query}`);
  if (!response.ok) throw new Error("Failed to fetch flights");
  return response.json();
};
