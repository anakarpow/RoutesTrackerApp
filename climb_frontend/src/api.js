import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8000/api"
});

export const fetchRoutes = () => api.get("/routes/").then(r => r.data);
export const fetchRoute = (id) => api.get(`/routes/${id}/`).then(r => r.data);
export const fetchArea = (id) => api.get(`/areas/${id}/`).then(r => r.data);
export const fetchNearestRef = (id) => api.get(`/references/${id}/`).then(r => r.data);
export const fetchRoutesByArea = (areaId) => api.get(`/routes/?area=${areaId}`).then(r => r.data);
export const fetchRoutesByNearestRef = (refId) => api.get(`/routes/?nearest_ref=${refId}`).then(r => r.data);