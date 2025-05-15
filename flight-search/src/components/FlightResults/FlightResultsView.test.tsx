import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import FlightResultsView from "./FlightResultsView"; // ajusta el path si es necesario

// Mock navigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Dummy flight data
const mockFlight = {
  id: "1",
  itineraries: [
    {
      duration: "PT3H30M",
      segments: [
        {
          departure: {
            cityName: "CityA",
            iataCode: "CTA",
            at: new Date().toISOString(),
          },
          arrival: {
            cityName: "CityB",
            iataCode: "CTB",
            at: new Date(Date.now() + 3600000 * 3.5).toISOString(),
          },
          carrier: { iataCode: "XY" },
          flightNumber: "1234",
        },
      ],
    },
  ],
  price: {
    total: "150.00",
    currency: "USD",
  },
  travelerPricings: [
    {
      price: {
        total: "150.00",
      },
    },
  ],
};

describe("FlightResultsView", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  const renderWithRouter = (state?: any) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: "/results", state }]}>
        <Routes>
          <Route path="/results" element={<FlightResultsView />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("redirects to home if formData or flights are missing", () => {
    renderWithRouter();
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });

  it("renders flight data when provided", () => {
    renderWithRouter({ formData: {}, flights: [mockFlight] });

    expect(screen.getByText(/Available Flights/i)).toBeInTheDocument();
    expect(screen.getByText(/Outbound Flight/i)).toBeInTheDocument();
    expect(screen.getByText(/CityA \(CTA\)/)).toBeInTheDocument();
    expect(screen.getByText(/CityB \(CTB\)/)).toBeInTheDocument();
    expect(screen.getByText(/Price per Traveler:/)).toBeInTheDocument();
  });

  it("sorts flights by price", () => {
    const cheapFlight = {
      ...mockFlight,
      id: "2",
      price: { total: "100.00", currency: "USD" },
      travelerPricings: [{ price: { total: "100.00" } }],
    };
    const expensiveFlight = {
      ...mockFlight,
      id: "3",
      price: { total: "300.00", currency: "USD" },
      travelerPricings: [{ price: { total: "300.00" } }],
    };

    renderWithRouter({ formData: {}, flights: [expensiveFlight, cheapFlight] });

    fireEvent.change(screen.getByLabelText(/Sort by:/i), {
      target: { value: "price" },
    });

    const prices = screen
      .getAllByText(/\$[0-9]+\.[0-9]{2}/)
      .map((el) => el.textContent);
    expect(prices).toContain("Total: USD $100.00");
    expect(prices).toContain("Total: USD $300.00");
  });

  it("navigates back to home on back button click", () => {
    renderWithRouter({ formData: {}, flights: [mockFlight] });

    fireEvent.click(screen.getByText(/← Back to Search/i));
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
