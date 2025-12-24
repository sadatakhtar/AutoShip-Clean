import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../pages/Home";
import { BrowserRouter } from "react-router-dom";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
let mockUser = null;
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { username: "testuser", role: "User" }; // default non-admin
  });

  test("renders welcome title", () => {
    renderPage();
    expect(screen.getByText("Welcome to AutoShip")).toBeInTheDocument();
  });

  test("renders all tiles", () => {
    renderPage();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    expect(screen.getByText("Create New User")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  test("renders tile descriptions", () => {
    renderPage();

    expect(
      screen.getByText("View system statistics and recent activity.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("View, edit, or remove users.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Add a new user to the system.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("View and update your profile.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Configure system preferences.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Learn more about AutoShip.")
    ).toBeInTheDocument();
  });

  test("clicking Dashboard tile navigates to /dashboard", () => {
    renderPage();

    const dashboardBtn = screen.getAllByText("Open")[0];
    fireEvent.click(dashboardBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("admin-only tiles are disabled for non-admin users", () => {
    mockUser = { username: "testuser", role: "User" };
    renderPage();

    const buttons = screen.getAllByText("Open");

    // Order of tiles:
    // 0 Dashboard
    // 1 Manage Users (admin only)
    // 2 Create New User (admin only)
    // 3 Profile
    // 4 Settings (admin only)
    // 5 About

    expect(buttons[1]).toBeDisabled(); // Manage Users
    expect(buttons[2]).toBeDisabled(); // Create New User
    expect(buttons[4]).toBeDisabled(); // Settings
  });

  test("admin-only tiles are enabled for admin users", () => {
    mockUser = { username: "admin", role: "Admin" };
    renderPage();

    const buttons = screen.getAllByText("Open");

    expect(buttons[1]).not.toBeDisabled(); // Manage Users
    expect(buttons[2]).not.toBeDisabled(); // Create New User
    expect(buttons[4]).not.toBeDisabled(); // Settings
  });

  test("clicking Manage Users navigates to /manage-users when admin", () => {
    mockUser = { username: "admin", role: "Admin" };
    renderPage();

    const manageUsersBtn = screen.getAllByText("Open")[1];
    fireEvent.click(manageUsersBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/manage-users");
  });
});