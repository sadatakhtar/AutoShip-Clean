import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChangePasswordModal from "../../../components/modals/ChangePasswordModal";

describe("ChangePasswordModal Component", () => {
  const mockSetOpen = jest.fn();
  const mockSetCurrentPassword = jest.fn();
  const mockSetNewPassword = jest.fn();
  const mockHandleChangePassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders when open=true", () => {
    render(
      <ChangePasswordModal
        open={true}
        setOpen={mockSetOpen}
        error={null}
        success={null}
        currentPassword=""
        newPassword=""
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
  });

  test("does not render when open=false", () => {
    render(
      <ChangePasswordModal
        open={false}
        setOpen={mockSetOpen}
        error={null}
        success={null}
        currentPassword=""
        newPassword=""
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    expect(screen.queryByText("Change Password")).not.toBeInTheDocument();
  });

  test("renders error message when error prop is provided", () => {
    render(
      <ChangePasswordModal
        open={true}
        setOpen={mockSetOpen}
        error="Incorrect password"
        success={null}
        currentPassword=""
        newPassword=""
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    expect(screen.getByText("Incorrect password")).toBeInTheDocument();
  });

  test("renders success message when success prop is provided", () => {
    render(
      <ChangePasswordModal
        open={true}
        setOpen={mockSetOpen}
        error={null}
        success="Password updated successfully"
        currentPassword=""
        newPassword=""
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    expect(screen.getByText("Password updated successfully")).toBeInTheDocument();
  });

  test("updates current password field", () => {
    render(
      <ChangePasswordModal
        open={true}
        setOpen={mockSetOpen}
        error={null}
        success={null}
        currentPassword=""
        newPassword=""
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    const input = screen.getByLabelText("Current Password");
    fireEvent.change(input, { target: { value: "oldpass123" } });

    expect(mockSetCurrentPassword).toHaveBeenCalledWith("oldpass123");
  });

  test("updates new password field", () => {
    render(
      <ChangePasswordModal
        open={true}
        setOpen={mockSetOpen}
        error={null}
        success={null}
        currentPassword=""
        newPassword=""
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    const input = screen.getByLabelText("New Password");
    fireEvent.change(input, { target: { value: "newpass456" } });

    expect(mockSetNewPassword).toHaveBeenCalledWith("newpass456");
  });

  test("Cancel button closes the modal", () => {
    render(
      <ChangePasswordModal
        open={true}
        setOpen={mockSetOpen}
        error={null}
        success={null}
        currentPassword=""
        newPassword=""
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  test("Save button triggers handleChangePassword", () => {
    render(
      <ChangePasswordModal
        open={true}
        setOpen={mockSetOpen}
        error={null}
        success={null}
        currentPassword="oldpass"
        newPassword="newpass"
        setCurrentPassword={mockSetCurrentPassword}
        setNewPassword={mockSetNewPassword}
        handleChangePassword={mockHandleChangePassword}
      />
    );

    fireEvent.click(screen.getByText("Save"));
    expect(mockHandleChangePassword).toHaveBeenCalledTimes(1);
  });
});