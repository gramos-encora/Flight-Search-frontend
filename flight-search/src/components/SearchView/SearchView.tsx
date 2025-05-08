import React, { ChangeEvent, useState } from "react";
import "../../styles/SearchView.css";
import { fetchAirlines } from "../../network/NetworkManager";

interface SearchForm {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  returnDate: string;
  currency: string;
  isNonStop: boolean;
}

const SearchView: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [formData, setFormData] = useState<SearchForm>({
    departureAirport: "",
    arrivalAirport: "",
    departureDate: "",
    returnDate: "",
    currency: "USD",
    isNonStop: false,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    let value: string | boolean;

    if (target instanceof HTMLInputElement && name === "isNonStop") {
      value = target.checked; // Validate that we are on a checkbox event to access 'checked'
    } else {
      value = target.value;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data", formData);
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Flight Search</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <label>
          Departure Airport
          <input
            type="text"
            name="departureAirport"
            placeholder="e.g. San Francisco"
            value={formData.departureAirport}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Arrival Airport
          <input
            type="text"
            name="arrivalAirport"
            placeholder="e.g. Los Angeles"
            value={formData.arrivalAirport}
            onChange={handleInputChange}
          />
        </label>

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
            min={new Date().toISOString().split("T")[0]}
            value={formData.returnDate}
            onChange={handleInputChange}
          />
        </label>

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

        <label className="nonstop-checkbox">
          <input
            type="checkbox"
            name="isNonStop"
            checked={formData.isNonStop}
            onChange={handleInputChange}
          />
          Non-stop
        </label>

        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchView;
