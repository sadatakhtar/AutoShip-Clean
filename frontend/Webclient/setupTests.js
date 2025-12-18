// setupTests.js
import '@testing-library/jest-dom';

import axios from "axios";

jest.mock("axios");
let consoleErrorSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  if (consoleErrorSpy) {
    consoleErrorSpy.mockRestore();
  }
});