// import axios from "axios";

// console.log(">>> USING AXIOS FILE FROM:", import.meta.url);

// // Detect Vite environment safely
// const viteEnv = (() => {
//   try {
//     return import.meta?.env;
//   } catch {
//     return undefined;
//   }
// })();

// // Detect Jest mock safely
// const jestEnv = globalThis.import?.meta?.env;

// const api = axios.create({
//   baseURL:
//     viteEnv?.VITE_API_BASE ||
//     jestEnv?.VITE_API_BASE ||
//     "",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token automatically
// // api.interceptors.request.use((config) => {
// //     console.log(">>> CUSTOM AXIOS INSTANCE USED:", config.baseURL, config.url);

// //   const token = localStorage.getItem("jwtToken");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// api.interceptors.request.use((config) => {
//   console.log(">>> CUSTOM AXIOS INSTANCE USED:", config.baseURL, config.url);
//   return config;
// });


// export default api;

import axios from "axios";

console.log(">>> USING AXIOS FILE FROM:", import.meta.url);

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Resolve baseURL lazily at request time
api.interceptors.request.use((config) => {
  const env = (() => {
    try {
      return import.meta.env;
    } catch {
      return undefined;
    }
  })();

  const viteBase = env?.VITE_API_BASE;
  const jestBase = globalThis.import?.meta?.env?.VITE_API_BASE;

  config.baseURL = viteBase || jestBase || "";

  console.log(">>> CUSTOM AXIOS INSTANCE USED:", config.baseURL, config.url);

  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;


