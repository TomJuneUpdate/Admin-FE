import axios from "axios";

const instance = axios.create({
  baseURL: "/",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to add token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwttoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("jwttoken");
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden - redirect to home
          window.location.href = "/";
          break;
        case 404:
          console.error("Resource not found:", error.config.url);
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Error in request configuration
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
