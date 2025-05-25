import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const configureAxios = () =>
  axios.create({
    baseURL: apiUrl,
    timeout: 15000,
  });

export const axiosInstance = configureAxios();

axiosInstance.interceptors.request.use((config) => {
  return config;
});
