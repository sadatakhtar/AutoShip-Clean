import React from 'react'
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../../../pages/DashboardPage";
import api from "../../../api/axios";


jest.mock("../../../api/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}));



let consoleErrorSpy;

beforeEach(() => {
  // Default axios mock response
  api.get.mockResolvedValue({
    data: { $values: [{ id: 1, make: "Toyota", model: "Corolla" }] }
  });

  // Spy on console.error to suppress error logs in test output
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  // Restore mocks
  jest.clearAllMocks();
  if (consoleErrorSpy) {
    consoleErrorSpy.mockRestore();
  }
});

test("renders car data in DashboardPage", async () => {
  render(<DashboardPage />);

  // Wait for the mocked data to load
  await waitFor(() => {
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("Corolla")).toBeInTheDocument();
  });
});

test("shows error message when API fails", async () => {
  // Force axios mock to reject
  api.get.mockRejectedValueOnce(new Error("Network error"));

  render(<DashboardPage />);

  await waitFor(() => {
    expect(screen.getByText("Error fetching Data...")).toBeInTheDocument();
  });
});