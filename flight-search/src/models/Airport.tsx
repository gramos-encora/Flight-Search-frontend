export interface Airport {
  id: string;
  cityName: string;
  countryName: string;
  iataCode: string;
}

export interface AirportInfo {
  iataCode: string;
  at: string;
  cityName?: string;
}
