import axios from "axios";

/**
 * Pre-configured Axios instance.
 *
 * `NEXT_PUBLIC_API_URL` holds the backend origin; the `/api/v1` prefix matches
 * the glowly-frontend convention. Usable on both the server and the client.
 */
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the bearer token on the client (localStorage is browser-only).
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// On 401, clear the token and redirect to login (guard against redirect loops).
let isRedirecting = false;

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401 &&
      !isRedirecting
    ) {
      isRedirecting = true;
      window.localStorage.removeItem("token");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default api;
