export default {
  create: () => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(() =>
      Promise.resolve({
        data: { $values: [{ id: 1, make: "Toyota", model: "Corolla" }] }
      })
    )
  })
};