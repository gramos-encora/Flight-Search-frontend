import { Airline } from "../models/Airline";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchAirlines = async (query: string): Promise<Airline> => {
  const response = await fetch(`${API_BASE_URL}/airlines/${query}`);
  if (!response.ok) throw new Error("Failed to fetch airlines");

  const data = await response.json();
  console.log("Airline data:", data);
  return data;
};
