import axios from "axios";
import axiosInstance from "./axiosInstance";

const baseApi = import.meta.env.VITE_API_BASE_URL || "/api";

const authApi = axios.create({
  baseURL: `${baseApi}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = async (userData) => {
  const payload = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone,
    dateOfBirth: userData.dob,
    role: "USER",
  };

  const { data } = await authApi.post("/signup", payload);

  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      userId: data.userId,
      username: data.username,
      email: data.email,
      fullName: userData.fullName,
      phone: userData.phone,
      dateOfBirth: userData.dob,
      roles: data.roles,
    })
  );

  return data;
};

export const login = async (credentials) => {
  const payload = {
    usernameOrEmail: credentials.email,
    password: credentials.password,
  };

  const { data } = await authApi.post("/login", payload);

  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      userId: data.userId,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      roles: data.roles,
    })
  );

  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getMyUserProfile = async () => {
  const { data } = await axiosInstance.get("/user/profile");
  return data;
};
