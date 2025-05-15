import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetailsView from "./DetailsView";

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock flight data for testing
const mockFlight = {
  price: { total: "250.00", currency: "USD" },
  itineraries: [
    {
      duration: "PT2H15M",
      segments: [
        {
          id: "s1",
          departure: {
            at: "2025-05-01T08:00:00Z",
            iataCode: "JFK",
            cityName: "New York",
          },
          arrival: {
            at: "2025-05-01T10:15:00Z",
            iataCode: "LAX",
            cityName: "Los Angeles",
          },
          carrier: {
            iataCode: "AA",
            commonName: "American Airlines",
          },
          operatingCarrier: {
            iataCode: "AA",
            commonName: "American Airlines",
          },
          flightNumber: "100",
          aircraft: "737",
        },
      ],
    },
  ],
  travelerPricings: [
    {
      travelerId: "1",
      travelerType: "ADULT",
      price: { base: "200.00", total: "250.00", currency: "USD" },
      fareDetailsBySegment: [
        {
          segmentId: "s1",
          cabin: "ECONOMY",
          clazz: "Y",
          amenities: [
            { name: "Wi-Fi", chargeable: true },
            { name: "Snacks", chargeable: false },
          ],
        },
      ],
    },
  ],
};

describe("DetailsView", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  const renderWithRouter = (state: any) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: "/details", state }]}>
        <Routes>
          <Route path="/details" element={<DetailsView />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders flight details", () => {
    renderWithRouter({ flight: mockFlight });

    // Check that the "Back" button and some flight details are rendered
    expect(screen.getByText("← Back")).toBeInTheDocument();
    // Since there might be multiple elements with "Segment 1-1", use getAllByText
    const segmentHeadings = screen.getAllByText("Segment 1-1");
    expect(segmentHeadings.length).toBeGreaterThan(0);
    // Checking price: since "250.00 USD" may appear in multiple places, ensure at least one element contains it
    const priceElements = screen.getAllByText(/250\.00\s*USD/);
    expect(priceElements.length).toBeGreaterThan(0);
    // Verify that key route information is rendered
    expect(screen.getByText(/New York \(JFK\)/)).toBeInTheDocument();
    expect(screen.getByText(/Los Angeles \(LAX\)/)).toBeInTheDocument();
    expect(screen.getByText("Price Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Traveler 1 - ADULT")).toBeInTheDocument();
  });
});
