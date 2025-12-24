import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/About";
import DashboardPage from "../pages/DashboardPage";
import api from "../api/axios";


let mockUser = { username: "test", role: "User" };

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));
// Mock the configured axios instance
jest.mock("../api/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}));

let consoleErrorSpy;

beforeEach(() => {
  // Default axios mock response
  api.get.mockResolvedValue({ data: { $values: [] } });

  // Spy on console.error to suppress logs
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  if (consoleErrorSpy) {
    consoleErrorSpy.mockRestore();
  }
});

test("should render Home component at '/home'", () => {
  render(
    <MemoryRouter initialEntries={["/home"]}>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByTestId("home-component")).toBeInTheDocument();
});

test("should render About component at '/about'", () => {
  render(
    <MemoryRouter initialEntries={["/about"]}>
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByTestId("about-component")).toBeInTheDocument();
});

test("should render Dashboard component at '/dashboard'", async () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByTestId("dashboard-component")).toBeInTheDocument();
});


// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';

// import App from '../App';
// import api from "../src/api/axios";

// beforeEach(() => {
//   api.get.mockResolvedValue({ data: { $values: [] } });
// });
// // App.test.jsx or setupTests.js
// import api from "../src/api/axios";

// jest.mock("../src/api/axios", () => ({
//   get: jest.fn(),
//   post: jest.fn(),
//   interceptors: {
//     request: { use: jest.fn() },
//     response: { use: jest.fn() }
//   }
// }));

// describe('Route validity', () => {
//   it('should render Home component at "/home"', () => {
//     render(
//       <MemoryRouter initialEntries={['/home']}>
//         <App />
//       </MemoryRouter>
//     );
//     expect(screen.getByTestId('home-component')).toBeInTheDocument();
//   });

//   it('should render About component at "/about"', () => {
//     render(
//       <MemoryRouter initialEntries={['/about']}>
//         <App />
//       </MemoryRouter>
//     );
//     expect(screen.getByTestId('about-component')).toBeInTheDocument();
//   });

//   it('Should render dashboard component at "/dashboard"', () => {
//         render(
//       <MemoryRouter initialEntries={['/dashboard']}>
//         <App />
//       </MemoryRouter>
//     );
//     expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
//   })
// });


