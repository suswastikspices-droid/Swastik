// /services/api.js
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: dynamically attach Bearer token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or any auth provider
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic fetcher function
export const fetcher = async (url, options = {}) => {
  try {
    const response = await api({
      url,
      method: options.method || "GET",
      data: options.body || null,
      headers: options.headers || {}, // Additional headers if needed
    });
    return response.data;
  } catch (error) {
    console.error("API fetch error:", error.response || error.message);
    throw error;
  }
};

export default api;
