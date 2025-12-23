import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "../../pages/SettingsPage";
import { BrowserRouter } from "react-router-dom";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock DashboardTitleAndModal
jest.mock("../../components/DashboardTitleAndModal", () => (props) => (
  <div data-testid="dashboard-title">
    <h1>{props.title}</h1>
    <button data-testid="back-btn" onClick={props.handleBack}>
      Back
    </button>
  </div>
));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SettingsPage />
    </BrowserRouter>
  );

describe("SettingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Settings title", () => {
    renderPage();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders all four settings cards", () => {
    renderPage();

    expect(screen.getByText("Create New User")).toBeInTheDocument();
    expect(screen.getByText("Update User Role")).toBeInTheDocument();
    expect(screen.getByText("Delete User")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  test("renders descriptions for each card", () => {
    renderPage();

    expect(
      screen.getByText("Add a new user to the system.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Modify permissions or roles for existing users.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Remove a user from the system.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Update your account password.")
    ).toBeInTheDocument();
  });

  test("renders an Open button for each card", () => {
    renderPage();

    const openButtons = screen.getAllByText("Open");
    expect(openButtons.length).toBe(4);
  });

  test("clicking Back triggers navigation", () => {
    renderPage();

    fireEvent.click(screen.getByTestId("back-btn"));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});