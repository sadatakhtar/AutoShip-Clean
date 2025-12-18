import React from "react";
import { render, screen } from "@testing-library/react";
import CarTable from "../../../src/components/CarTable";
import "@testing-library/jest-dom";

describe("CarTable Component", () => {
  test("shows Loading component when isLoading is true", () => {
    render(<CarTable data={[]} isLoading={true} error={null} />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  test("shows error message when error prop is provided and data is empty", () => {
    render(<CarTable data={[]} isLoading={false} error="Failed to fetch car data" />);
    expect(screen.getByText("Failed to fetch car data")).toBeInTheDocument();
  });

  test("renders car rows when data is provided", () => {
    const mockData = [
      {
        id: 1,
        make: "Toyota",
        model: "Corolla",
        ivaStatus: "Completed",
        motStatus: "Valid",
        status: 5,
      },
      {
        id: 2,
        make: "BMW",
        model: "X5",
        ivaStatus: "Pending",
        motStatus: "Expired",
        status: 6,
      },
    ];

    render(<CarTable data={mockData} isLoading={false} error={null} />);

    // Check table headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Make")).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(screen.getByText("IVA Application")).toBeInTheDocument();
    expect(screen.getByText("MOT")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();

    // Check rows
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("BMW")).toBeInTheDocument();
    expect(screen.getByText("Corolla")).toBeInTheDocument();
    expect(screen.getByText("X5")).toBeInTheDocument();
    expect(screen.getByText("IVA completed")).toBeInTheDocument(); 
    expect(screen.getByText("MOT completed")).toBeInTheDocument(); 
  });
});
