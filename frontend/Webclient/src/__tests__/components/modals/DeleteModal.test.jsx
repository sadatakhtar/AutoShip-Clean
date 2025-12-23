import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "../../../components/modals/DeleteModal";
import "@testing-library/jest-dom";

describe("DeleteModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders when open=true", () => {
    render(
      <DeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        carId={10}
      />
    );

    expect(screen.getByText("Delete Vehicle")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete vehicle/)
    ).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("does not render when open=false", () => {
    render(
      <DeleteModal
        open={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        carId={10}
      />
    );

    // Dialog should not be visible
    const dialog = screen.queryByText("Delete Vehicle");
    expect(dialog).not.toBeInTheDocument();
  });

  test("calls onClose when Cancel is clicked", () => {
    render(
      <DeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        carId={10}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onConfirm with carId when Delete is clicked", () => {
    render(
      <DeleteModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        carId={10}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalledWith(10);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});