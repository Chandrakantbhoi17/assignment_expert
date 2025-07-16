// src/services/apiClient.js
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://65.0.225.227:8000";

// Create the axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests before they are sent to include the token (if it exists)
apiClient.interceptors.request.use(
  (config) => {
   const token = Cookies.get("token") || null // Assuming the token is stored under the key 'token'
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to Authorization header
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle any errors in request
  }
);

export default apiClient;



