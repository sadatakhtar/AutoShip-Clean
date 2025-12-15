// setupTests.js
import '@testing-library/jest-dom';

import axios from "axios";

jest.mock("axios");

let consoleErrorSpy;

beforeEach(() => {
  // Default axios mock
  axios.get.mockResolvedValue({ data: { $values: [] } });

  // Spy on console.error
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  // Restore the spy
  consoleErrorSpy.mockRestore();
});