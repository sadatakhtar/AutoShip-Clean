import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../../pages/ResetPasswordPage';
import api from '../../api/axios';
import { MemoryRouter } from 'react-router-dom';


// ✅ Mock axios instance
jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

// ✅ Mock navigate globally
const mockNavigate = jest.fn();

// ✅ Mock react-router-dom globally EXCEPT useSearchParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useSearchParams: jest.fn(), // we override this per test
}));

// ✅ Import the mocked hook
import { useSearchParams } from "react-router-dom";

// ✅ Use fake timers for redirect
jest.useFakeTimers();

describe("ResetPassword Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the page correctly", () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("token=test-token"),
    ]);

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /reset password/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
  });

  test("shows error if token is missing", () => {
    useSearchParams.mockReturnValue([new URLSearchParams("")]); // ✅ no token

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Invalid reset link.")
    ).toBeInTheDocument();
  });

  test("submits new password successfully", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("token=test-token"),
    ]);

    api.post.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "NewPass123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    // ✅ Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(
          "Password reset successfully. You can now log in."
        )
      ).toBeInTheDocument();
    });

    // ✅ Fast-forward the 2-second redirect timer
    jest.runAllTimers();

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows backend error message", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("token=test-token"),
    ]);

    api.post.mockRejectedValueOnce({
      response: { data: "Invalid or expired token" },
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "NewPass123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Invalid or expired token")
      ).toBeInTheDocument();
    });
  });

  test("shows fallback error message when API gives no response", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("token=test-token"),
    ]);

    api.post.mockRejectedValueOnce({}); // ✅ triggers fallback

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "NewPass123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Invalid or expired reset link.")
      ).toBeInTheDocument();
    });
  });
});

