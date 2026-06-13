import axios from "axios";

const api = axios.create({
  baseURL:
    typeof globalThis.import !== "undefined"
      ? globalThis.import.meta.env.VITE_API_BASE
      : "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;