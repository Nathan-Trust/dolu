/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios-instance";

export interface AuthLoginData {
  token: string;
}

export interface Permission {
  name: string;
  enabled: boolean;
}

export interface AuthMeData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role: string;
  permissions?: Permission[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

export class AuthService {
  public static async login(
    payload: Record<string, any>,
  ): Promise<ApiResponse<AuthLoginData>> {
    try {
      const response = await axiosInstance.post<ApiResponse<AuthLoginData>>(
        "/auth/login",
        payload,
        );
        console.log("Login response:", response);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  public static async me(): Promise<ApiResponse<AuthMeData>> {
    try {
      const response =
        await axiosInstance.get<ApiResponse<AuthMeData>>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
}
