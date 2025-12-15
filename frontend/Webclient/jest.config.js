// export default {
//   testEnvironment: 'jsdom',
//   setupFiles: ['<rootDir>/jest.polyfills.js'],
//   setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     '\\.(svg|jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/fileMock.js',
//   },
//   transform: {
//     '^.+\\.[jt]sx?$': 'babel-jest',
//   },
// };
// jest.config.js
export default {
  // Simulate a browser-like environment
  testEnvironment: "jsdom",

  // Files that run before all tests (polyfills, globals)
  setupFiles: ["<rootDir>/jest.polyfills.js"],

  // Files that run after the test framework is set up (mocks, custom matchers)
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],

  // Map static assets and styles to mocks so Jest doesn’t choke on imports
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg|jpg|jpeg|png|gif)$": "<rootDir>/__mocks__/fileMock.js",
  },

  // Use Babel to transform JS/TS/JSX/TSX files
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  // Recognize these file extensions when resolving imports
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  // Optional: clear mocks between tests
  clearMocks: true,

  // Optional: collect coverage from source files
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/setupTests.js"
  ]
};

