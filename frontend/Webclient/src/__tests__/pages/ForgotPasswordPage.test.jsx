import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import ForgotPassword from "../../pages/ForgotPasswordPage";
import { MemoryRouter } from "react-router-dom";
import api from "../../api/axios";

// ✅ Mock axios instance
jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

describe("ForgotPassword Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the page correctly", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /forgot password/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test("submits email successfully", async () => {
    api.post.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("If that email exists, a reset link has been sent.")
      ).toBeInTheDocument();
    });

    expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", {
      email: "test@example.com",
    });
  });

  test("shows error message when API fails", async () => {
    api.post.mockRejectedValueOnce({}); // triggers your catch block

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Try again later.")
      ).toBeInTheDocument();
    });
  });

  test("does not submit when email is empty", async () => {
  render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

  expect(api.post).not.toHaveBeenCalled();

  expect(screen.getByText("Please enter your email.")).toBeInTheDocument();
});
});