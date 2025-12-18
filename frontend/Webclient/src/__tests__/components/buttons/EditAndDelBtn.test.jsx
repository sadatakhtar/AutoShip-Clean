import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditAndDelBtns from "../../../components/buttons/EditAndDelBtns";

describe("EditAndDelBtns component", () => {
  test("renders both Edit and Delete buttons", () => {
    render(<EditAndDelBtns />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("Edit button has inline green background style", () => {
    render(<EditAndDelBtns />);
    const editButton = screen.getByText("Edit");
    expect(editButton).toHaveStyle("background-color: rgb(0, 128, 0)");
  });

  test("Delete button uses styled-component default red background", () => {
    render(<EditAndDelBtns />);
    const deleteButton = screen.getByText("Delete");
    // styled-components injects styles into the DOM, so we can check computed style
    expect(deleteButton).toHaveStyle("background-color: rgb(255, 0, 0)");
    expect(deleteButton).toHaveStyle("color: rgb(255, 255, 255)");
  });

});

