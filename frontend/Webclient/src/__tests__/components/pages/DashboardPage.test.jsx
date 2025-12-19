import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "../../../pages/DashboardPage";
import api from "../../../api/axios";
import { AuthProvider } from "../../../context/AuthContext";

// ✅ Mock axios
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
  // ✅ Mock a valid JWT token so AuthContext works
  localStorage.setItem(
    "jwtToken",
    "header." +
      btoa(
        JSON.stringify({
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name":
            "testuser",
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
            "Admin"
        })
      ) +
      ".signature"
  );

  // ✅ Default axios mock response
  api.get.mockResolvedValue({
    data: { $values: [{ id: 1, make: "Toyota", model: "Corolla" }] }
  });

  // ✅ Suppress console errors in test output
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  if (consoleErrorSpy) consoleErrorSpy.mockRestore();
});

// ✅ Helper to wrap component with Router + AuthProvider
function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

test("renders car data in DashboardPage", async () => {
  renderWithProviders(<DashboardPage />);

  await waitFor(() => {
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("Corolla")).toBeInTheDocument();
  });
});

test("shows error message when API fails", async () => {
  api.get.mockRejectedValueOnce(new Error("Network error"));

  renderWithProviders(<DashboardPage />);

  await waitFor(() => {
    expect(screen.getByText("Error fetching Data...")).toBeInTheDocument();
  });
});
