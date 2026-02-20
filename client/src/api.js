import axios from "axios";

/**
 * Axios instance configured for API requests
 * Base URL points to backend server
 * No default Content-Type header to allow FormData multipart uploads
 */
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

/**
 * Request interceptor - Adds JWT token to all requests if available
 * Token is retrieved from localStorage (key: adminToken)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
