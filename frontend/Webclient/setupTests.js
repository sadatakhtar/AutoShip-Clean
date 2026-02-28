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

Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100
}));