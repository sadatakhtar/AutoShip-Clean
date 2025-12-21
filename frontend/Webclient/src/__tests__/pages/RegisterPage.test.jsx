import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import RegisterPage from "../../pages/RegisterPage";
import { MemoryRouter } from "react-router-dom";
import api from "../../api/axios";

// ✅ Mock axios
jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

// ✅ Mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("redirects to home if no token exists", () => {
    localStorage.removeItem("jwtToken");

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("redirects to dashboard if user is not admin", () => {
    const fakeToken = {
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        "User",
    };

    localStorage.setItem(
      "jwtToken",
      `header.${btoa(JSON.stringify(fakeToken))}.sig`
    );

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("renders form fields for admin user", () => {
    const fakeToken = {
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        "Admin",
    };

    localStorage.setItem(
      "jwtToken",
      `header.${btoa(JSON.stringify(fakeToken))}.sig`
    );

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /create new user/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  test("updates form fields correctly", () => {
    const fakeToken = {
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        "Admin",
    };

    localStorage.setItem(
      "jwtToken",
      `header.${btoa(JSON.stringify(fakeToken))}.sig`
    );

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "john" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Pass123!" },
    });

    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Admin" },
    });

    expect(screen.getByLabelText(/username/i).value).toBe("john");
    expect(screen.getByLabelText(/email/i).value).toBe("john@example.com");
    expect(screen.getByLabelText(/password/i).value).toBe("Pass123!");
    expect(screen.getByLabelText(/role/i).value).toBe("Admin");
  });

  test("submits form successfully and navigates to dashboard", async () => {
    const fakeToken = {
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        "Admin",
    };

    localStorage.setItem(
      "jwtToken",
      `header.${btoa(JSON.stringify(fakeToken))}.sig`
    );

    api.post.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "john" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Pass123!" },
    });

    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "User" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register user/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        username: "john",
        email: "john@example.com",
        password: "Pass123!",
        role: "User",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("shows error message when registration fails", async () => {
    const fakeToken = {
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        "Admin",
    };

    localStorage.setItem(
      "jwtToken",
      `header.${btoa(JSON.stringify(fakeToken))}.sig`
    );

    api.post.mockRejectedValueOnce({});

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "john" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Pass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register user/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Registration failed")
      ).toBeInTheDocument();
    });
  });

  test("back to dashboard button works", () => {
    const fakeToken = {
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        "Admin",
    };

    localStorage.setItem(
      "jwtToken",
      `header.${btoa(JSON.stringify(fakeToken))}.sig`
    );

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /back to dashboard/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});