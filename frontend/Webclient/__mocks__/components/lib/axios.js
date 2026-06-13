export default {
  create: () => ({
    interceptors: { request: { use: () => {} } },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
};
