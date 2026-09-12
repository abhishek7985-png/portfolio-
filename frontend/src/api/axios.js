import axios from "axios";

// 🔧 Backend URL — yahan change karo ek jagah
// Local testing ke liye:
// const BASE_URL = "http://localhost:5000";

// Production (Render/Vercel deploy) ke liye:
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Axios instance banao
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — token auto add karo
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — 401 pe auto logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Agar admin page pe ho toh login pe bhej do
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  },
);

// Image URL helper
export const IMAGE_URL = BASE_URL;

export default API;
