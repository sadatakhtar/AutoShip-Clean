import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "../../pages/Profile";
import { BrowserRouter } from "react-router-dom";
import api from "../../api/axios";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock ChangePasswordModal
jest.mock("../../components/modals/ChangePasswordModal", () => (props) => (
  <div data-testid="change-password-modal">
    {props.open && <p>Modal Open</p>}

    {props.error && <p data-testid="error-msg">{props.error}</p>}
    {props.success && <p data-testid="success-msg">{props.success}</p>}

    {props.open && (
      <button onClick={props.handleChangePassword}>Submit</button>
    )}
  </div>
));

// Mock API
jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("shows loading state when user is null", () => {
    renderPage();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("loads user from JWT and displays username + role", () => {
    const payload = {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "john",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
    };

    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem("jwtToken", token);

    renderPage();

    expect(screen.getByText("Username:")).toBeInTheDocument();
    expect(screen.getByText("john")).toBeInTheDocument();
    expect(screen.getByText("Role:")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("opens Change Password modal when button clicked", () => {
    const payload = {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "john",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "User",
    };

    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem("jwtToken", token);

    renderPage();

    fireEvent.click(screen.getByText("Change Password"));

    expect(screen.getByTestId("change-password-modal")).toHaveTextContent(
      "Modal Open"
    );
  });

  test("successful password change shows success message", async () => {
    api.post.mockResolvedValueOnce({ data: {} });

    const payload = {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "john",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "User",
    };

    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem("jwtToken", token);

    renderPage();

    fireEvent.click(screen.getByText("Change Password"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() =>
      expect(screen.getByTestId("success-msg")).toHaveTextContent(
        "Password changed successfully"
      )
    );
  });

  test("failed password change shows error message", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid password" } },
    });

    const payload = {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "john",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "User",
    };

    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem("jwtToken", token);

    renderPage();

    fireEvent.click(screen.getByText("Change Password"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() =>
      expect(screen.getByTestId("error-msg")).toHaveTextContent(
        "Invalid password"
      )
    );
  });

  test("Back button navigates to previous page", () => {
    const payload = {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "john",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "User",
    };

    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem("jwtToken", token);

    renderPage();

    fireEvent.click(screen.getByText("Back"));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});