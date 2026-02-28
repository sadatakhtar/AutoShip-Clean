import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditAndDelBtns from "../../../components/buttons/EditAndDelBtns";

// Mock DeleteModal so we can test open/close + confirm behavior
jest.mock("../../../components/modals/DeleteModal", () => {
  return ({ open, carId, onClose, onConfirm }) => {
    if (!open) return null;

    return (
      <div data-testid="delete-modal">
        <p>Delete vehicle {carId}</p>
        <button data-testid="modal-cancel" onClick={onClose}>
          Cancel
        </button>
        <button data-testid="modal-confirm" onClick={() => onConfirm(carId)}>
          Confirm Delete
        </button>
      </div>
    );
  };
});

describe("EditAndDelBtns component", () => {
  test("renders both Edit and Delete buttons", () => {
    render(<EditAndDelBtns id={1} onDelete={() => {}} />);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("Edit button has inline green background style", () => {
    render(<EditAndDelBtns id={1} onDelete={() => {}} />);

    const editButton = screen.getByText("Edit");
    expect(editButton).toHaveStyle("background-color: rgb(0, 128, 0)");
  });

  test("Delete button opens the DeleteModal", () => {
    render(<EditAndDelBtns id={5} onDelete={() => {}} />);

    // Modal should NOT be visible initially
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();

    // Click Delete
    fireEvent.click(screen.getByText("Delete"));

    // Modal should now appear
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

  });

  test("Clicking Cancel closes the modal", () => {
    render(<EditAndDelBtns id={5} onDelete={() => {}} />);

    fireEvent.click(screen.getByText("Delete")); // open modal
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("modal-cancel")); // close modal

    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  test("Clicking Confirm calls onDelete with correct ID", () => {
    const mockDelete = jest.fn();

    render(<EditAndDelBtns id={7} onDelete={mockDelete} />);

    fireEvent.click(screen.getByText("Delete")); // open modal

    fireEvent.click(screen.getByTestId("modal-confirm")); // confirm delete

    expect(mockDelete).toHaveBeenCalledTimes(1);

    // Modal should close after confirm
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });
});
