import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CarTable from "../../../src/components/CarTable.jsx";
import axios from "axios";

jest.mock("axios");

describe("CarTable Component", () => {
  const mockCars = [
    {
      id: 1,
      make: "Toyota",
      model: "Corolla",
      ivaApplication: "Submitted",
      mot: "Valid",
      registrationStatus: "Registered",
    },
    {
      id: 2,
      make: "Honda",
      model: "Civic",
      ivaApplication: "Pending",
      mot: "Expired",
      registrationStatus: "Not Registered",
    },
  ];

  // Silence console.error during tests
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    console.error.mockRestore();
  });

  it("shows loader while fetching data", async () => {
    axios.get.mockReturnValue(new Promise(() => {})); // unresolved promise
    render(<CarTable />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders car rows after data is fetched", async () => {
    axios.get.mockResolvedValue({ data: { $values: mockCars } });
    render(<CarTable />);

    await waitFor(() => {
      expect(screen.getByText("Toyota")).toBeInTheDocument();
      expect(screen.getByText("Honda")).toBeInTheDocument();
    });
  });

  it("renders 'No cars available' when API returns empty list", async () => {
    axios.get.mockResolvedValue({ data: { $values: [] } });
    render(<CarTable />);

    await waitFor(() => {
      expect(screen.getByText("No cars available")).toBeInTheDocument();
    });
  });

  it("renders table headers correctly", async () => {
    axios.get.mockResolvedValue({ data: { $values: mockCars } });
    render(<CarTable />);

    await waitFor(() => {
      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Make")).toBeInTheDocument();
      expect(screen.getByText("Model")).toBeInTheDocument();
      expect(screen.getByText("IVA Application")).toBeInTheDocument();
      expect(screen.getByText("MOT")).toBeInTheDocument();
      expect(screen.getByText("Registration Status")).toBeInTheDocument();
    });
  });

  it("shows error message when API call fails", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));
    render(<CarTable />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch car data")).toBeInTheDocument();
    });
  });
});

