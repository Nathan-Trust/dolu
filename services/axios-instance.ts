/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { decrypt } from "@/services/encryption";

// Retrieve baseURL from environment variable
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://1tnrb5l2-4050.uks1.devtunnels.ms/api/v1";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Optional: Add an interceptor to include authorization token in requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const raw = Cookies.get("dolu:token");
    const token = raw ? decrypt(raw) : null;

    if (token) {
      // Check if headers is defined, if not initialize it as an instance of AxiosHeaders
      config.headers = config.headers || new AxiosHeaders();

      // Set Authorization header with Bearer prefix
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
);

// Interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if the response body contains a 401 status_code
    if (response?.data?.status_code === 401) {
      // Cookies.remove("dolu:token");
      // Cookies.remove("dolu:user");
      // Cookies.remove("dolu:hotelId");
      // Cookies.remove("dolu:organizationId");
      // window.location.href = "/";
      return Promise.reject(new Error("Token has expired"));
    }

    return response;
  },
  (error: AxiosError) => {
    const status = error?.response?.status;
    console.error("Error status:", error);

    if (status === 413) {
      error.message =
        "Content too large. Please reduce the file size and try again.";
      // Optionally, you can attach a custom property for UI handling
      (error as any).isContentTooLarge = true;
    }

    if (status === 401 || status === 500) {
      // Cookies.remove("dolu:token");
      // Cookies.remove("dolu:user");
      // Cookies.remove("dolu:hotelId");
      // Cookies.remove("dolu:organizationId");
      // window.location.href = "/";
    } else {
      // For other errors, log and propagate the message
      console.error("An error occurred:", error?.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
