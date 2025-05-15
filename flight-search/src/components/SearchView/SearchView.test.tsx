import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchView from "./SearchView";
import { BrowserRouter } from "react-router-dom";
import * as NetworkManager from "../../network/NetworkManager";

// Mock de la navegación
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock de NetworkManager
vi.mock("../../network/NetworkManager", () => ({
  fetchAirports: vi.fn().mockResolvedValue([]),
  fetchFlights: vi.fn().mockResolvedValue([]),
}));

describe("SearchView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form inputs correctly", () => {
    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/departure airport/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/arrival airport/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adults/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
    expect(screen.getByText(/search flights/i)).toBeInTheDocument();
  });

  it("calls fetchAirports when typing in airport field", async () => {
    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>
    );

    const input = screen.getByLabelText(/departure airport/i);
    fireEvent.change(input, { target: { value: "San" } });

    await waitFor(() => {
      expect(NetworkManager.fetchAirports).toHaveBeenCalledWith("San");
    });
  });

  it("calls fetchFlights with form data on submit", async () => {
    // mock fetchFlights para que resuelva con un arreglo vacío
    (
      NetworkManager.fetchFlights as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>
    );

    // Completar campos mínimos requeridos del formulario
    fireEvent.change(screen.getByPlaceholderText(/e.g. San Francisco/i), {
      target: { value: "SFO" },
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Mexico City/i), {
      target: { value: "MEX" },
    });
    fireEvent.change(screen.getByLabelText(/Departure Date/i), {
      target: { value: "2025-06-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /search flights/i }));

    await waitFor(() => {
      expect(NetworkManager.fetchFlights).toHaveBeenCalledTimes(1);
      expect(NetworkManager.fetchFlights).toHaveBeenCalledWith(
        expect.objectContaining({
          departureAirport: "SFO",
          arrivalAirport: "MEX",
          departureDate: "2025-06-01",
          adults: 1,
          currency: "USD",
          isNonStop: false,
        })
      );
    });
  });
});
