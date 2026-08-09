const rawUrl = import.meta.env.VITE_API_URL;

export const API_URL = (rawUrl && rawUrl !== "undefined" && rawUrl !== "null" && rawUrl.trim() !== "") 
  ? rawUrl.replace(/\/+$/, "") 
  : "http://localhost:8081";
