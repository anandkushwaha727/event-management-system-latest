import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Change this when deployed
  headers: {
    "Content-Type": "application/json",
  },
});

// If you need authentication, add this interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // Get token from storage
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export {API};
