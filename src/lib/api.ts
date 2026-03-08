import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach token if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vashudha_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Listings ---
export const getActiveListings = () => api.get("/api/listings/active");
export const createListing = (data: Record<string, unknown>) =>
  api.post("/api/listings/create", data);
export const trackListing = (id: string) =>
  api.get(`/api/listings/${id}/track`);

// --- NGOs ---
export const getActiveNGOs = () => api.get("/api/ngos/active");
export const updateRescueStatus = (
  id: string,
  status: string
) => api.patch(`/api/rescues/${id}/update`, { status });

// --- Impact ---
export const getGlobalImpact = () => api.get("/api/impact/global");
export const getDonorDashboard = (id: string) =>
  api.get(`/api/donors/${id}/dashboard`);

// --- Predictions ---
export const getUpcomingPredictions = () => api.get("/api/predict/upcoming");

// --- Heatmap ---
export const getHeatmapZones = () => api.get("/api/heatmap/zones");

// --- Marketplace ---
export const getMarketplaceListings = () =>
  api.get("/api/marketplace/listings");
export const listVGCForSale = (data: Record<string, unknown>) =>
  api.post("/api/marketplace/list", data);
export const buyVGC = (data: Record<string, unknown>) =>
  api.post("/api/marketplace/buy", data);

// --- Certificates ---
export const getCertificate = (id: string) =>
  api.get(`/api/certificates/${id}`);

// --- Admin ---
export const getAdminRescues = () => api.get("/api/admin/rescues");
export const getAdminNGOs = () => api.get("/api/admin/ngos");
export const updateNGO = (id: string, data: Record<string, unknown>) =>
  api.patch(`/api/admin/ngos/${id}`, data);
export const getTreasury = () => api.get("/api/admin/treasury");
export const updateFloorPrice = (price: number) =>
  api.patch("/api/admin/floor-price", { price });

// --- Auth ---
export const registerUser = (data: Record<string, unknown>) =>
  api.post("/api/auth/register", data);
export const loginUser = (data: { email: string; password: string }) =>
  api.post("/api/auth/login", data);
export const getProfile = () => api.get("/api/auth/profile");
export const updateProfile = (data: Record<string, unknown>) =>
  api.patch("/api/auth/profile", data);

export default api;
