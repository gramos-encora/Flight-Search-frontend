import React, { ChangeEvent, useState } from "react";
import "../../styles/SearchView.css";
import { fetchAirports, fetchFlights } from "../../network/NetworkManager";
import { Airport } from "../../models/Airport";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "../../models/SearchForm";

const SearchView: React.FC = () => {
  const [formData, setFormData] = useState<SearchForm>({
    departureAirport: "",
    arrivalAirport: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    currency: "USD",
    isNonStop: false,
  });

  const [arrivalSuggestions, setArrivalSuggestions] = useState<Airport[]>([]);
  const [departureSuggestions, setDepartureSuggestions] = useState<Airport[]>(
    []
  );

  const handleInputChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let value: string | boolean;

    if (e.target instanceof HTMLInputElement && name === "isNonStop") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Autocompletar si se escribe en arrivalAirport o departureAirport
    if (
      (name === "arrivalAirport" || name === "departureAirport") &&
      typeof value === "string" &&
      value.length >= 2
    ) {
      try {
        const airports = await fetchAirports(value);
        if (name === "arrivalAirport") setArrivalSuggestions(airports);
        if (name === "departureAirport") setDepartureSuggestions(airports);
      } catch (err) {
        console.error("Error fetching airports", err);
        if (name === "arrivalAirport") setArrivalSuggestions([]);
        if (name === "departureAirport") setDepartureSuggestions([]);
      }
    } else {
      if (name === "arrivalAirport") setArrivalSuggestions([]);
      if (name === "departureAirport") setDepartureSuggestions([]);
    }
  };

  const handleAirportSelect = (
    iataCode: string,
    field: "arrivalAirport" | "departureAirport"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: iataCode,
    }));
    if (field === "arrivalAirport") setArrivalSuggestions([]);
    if (field === "departureAirport") setDepartureSuggestions([]);
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const flights = await fetchFlights(formData);
      navigate("/results", { state: { formData, flights } });
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Flight Search</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        {/* Departure Airport */}
        <label style={{ position: "relative" }}>
          Departure Airport
          <input
            type="text"
            name="departureAirport"
            value={formData.departureAirport}
            onChange={handleInputChange}
            placeholder="e.g. San Francisco"
            autoComplete="off"
            required
          />
          {departureSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {departureSuggestions.map((airport) => (
                <li
                  key={airport.id}
                  onClick={() =>
                    handleAirportSelect(airport.iataCode, "departureAirport")
                  }
                >
                  {airport.cityName} ({airport.iataCode})
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Arrival Airport */}
        <label style={{ position: "relative" }}>
          Arrival Airport
          <input
            type="text"
            name="arrivalAirport"
            value={formData.arrivalAirport}
            onChange={handleInputChange}
            placeholder="e.g. Mexico City"
            autoComplete="off"
            required
          />
          {arrivalSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {arrivalSuggestions.map((airport) => (
                <li
                  key={airport.id}
                  onClick={() =>
                    handleAirportSelect(airport.iataCode, "arrivalAirport")
                  }
                >
                  {airport.cityName} ({airport.iataCode})
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Dates */}
        <label>
          Departure Date
          <input
            type="date"
            name="departureDate"
            min={new Date().toISOString().split("T")[0]}
            value={formData.departureDate}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Return Date
          <input
            type="date"
            name="returnDate"
            min={
              formData.departureDate || new Date().toISOString().split("T")[0]
            }
            value={formData.returnDate}
            onChange={handleInputChange}
          />
        </label>

        {/* Dates */}
        <label>
          Adults
          <input
            type="number"
            name="adults"
            min={1}
            value={formData.adults}
            onChange={handleInputChange}
          />
        </label>

        {/* Currency */}
        <label>
          Currency
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
          >
            <option value="USD">USD</option>
            <option value="MXN">MXN</option>
            <option value="EUR">EUR</option>
          </select>
        </label>

        {/* Non-stop */}
        <label className="nonstop-checkbox">
          <input
            type="checkbox"
            name="isNonStop"
            checked={formData.isNonStop}
            onChange={handleInputChange}
          />
          Non-stop
        </label>

        {loading ? (
          <div className="loading-indicator">Loading flights...</div>
        ) : (
          <button type="submit" className="submit-button styled">
            Search Flights
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchView;
