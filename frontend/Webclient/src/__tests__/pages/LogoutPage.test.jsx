import React from "react";
import { render, screen } from "@testing-library/react";
import LogoutPage from "../../pages/LogoutPage";
import { MemoryRouter } from "react-router-dom";

// ✅ Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LogoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders logout message", () => {
    render(
      <MemoryRouter>
        <LogoutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/you have successfully signed out/i)
    ).toBeInTheDocument();
  });

  test("removes jwtToken from localStorage on mount", () => {
    localStorage.setItem("jwtToken", "abc123");

    render(
      <MemoryRouter>
        <LogoutPage />
      </MemoryRouter>
    );

    expect(localStorage.getItem("jwtToken")).toBeNull();
  });

  test("navigates to home after 2 seconds", () => {
    render(
      <MemoryRouter>
        <LogoutPage />
      </MemoryRouter>
    );

    // ✅ No navigation yet
    expect(mockNavigate).not.toHaveBeenCalled();

    // ✅ Fast‑forward timers
    jest.advanceTimersByTime(2000);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});