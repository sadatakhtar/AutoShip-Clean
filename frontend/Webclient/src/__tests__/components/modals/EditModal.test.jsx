import React from 'react'
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditModal from "../../../components/modals/EditModal";

const mockVehicle = {
  id: 1,
  vin: "ABC123",
  make: "Toyota",
  model: "Corolla",
  status: "Pending",
  ivaStatus: "Complete",
  motStatus: "Valid",
  v55Status: "Submitted"
};

describe("EditModal", () => {

  test("renders when open is true", () => {
    render(
      <EditModal
        open={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        vehicle={mockVehicle}
      />
    );

    expect(screen.getByText("Edit Vehicle")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    render(
      <EditModal
        open={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        vehicle={mockVehicle}
      />
    );

    expect(screen.queryByText("Edit Vehicle")).not.toBeInTheDocument();
  });

  test("prefills form with vehicle data", () => {
    render(
      <EditModal
        open={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        vehicle={mockVehicle}
      />
    );

    expect(screen.getByDisplayValue("ABC123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Toyota")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Corolla")).toBeInTheDocument();
  });

  test("calls onClose when Cancel clicked", () => {
    const mockClose = jest.fn();

    render(
      <EditModal
        open={true}
        onClose={mockClose}
        onConfirm={jest.fn()}
        vehicle={mockVehicle}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockClose).toHaveBeenCalled();
  });

  test("updates field value when user types", () => {
    render(
      <EditModal
        open={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        vehicle={mockVehicle}
      />
    );

    const makeInput = screen.getByLabelText("Make");
    fireEvent.change(makeInput, { target: { value: "Honda" } });

    expect(makeInput.value).toBe("Honda");
  });

  test("calls onConfirm with updated data when Save clicked", () => {
    const mockConfirm = jest.fn();

    render(
      <EditModal
        open={true}
        onClose={jest.fn()}
        onConfirm={mockConfirm}
        vehicle={mockVehicle}
      />
    );

    const makeInput = screen.getByLabelText("Make");
    fireEvent.change(makeInput, { target: { value: "Honda" } });

    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockConfirm).toHaveBeenCalledWith(1, {
      vin: "ABC123",
      make: "Honda",
      model: "Corolla",
      status: "Pending",
      ivaStatus: "Complete",
      motStatus: "Valid",
      v55Status: "Submitted"
    });
  });

});
