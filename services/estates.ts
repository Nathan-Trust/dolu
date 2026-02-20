/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios-instance";

import type { ApiWrapper, Meta } from "./people";
import { Property, type PropertyImage } from "./properties";

export interface Estate {
  id: number | string;
  title: string;
  description?: string | null;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  createdById?: string;
  updatedById?: string | null;
  created_at?: string;
  updated_at?: string | null;
  properties?: Property[];
  images?: any[];
}

export interface AddEstatePayload {
  title: string;
  address: string;
  location: string;
  country: string;
}

export type EstatesListResponse = ApiWrapper<{ data: Estate[]; meta: Meta }>;
export type EstateResponse = ApiWrapper<Estate>;
export type EstateImageResponse = ApiWrapper<PropertyImage>;

export class EstateService {
  public static async getAllEstates(
    params?: Record<string, any>,
  ): Promise<EstatesListResponse> {
    try {
      const response = await axiosInstance.get<EstatesListResponse>(
        "/properties/estates",
        { params },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching estates:", error);
      throw error;
    }
  }

  public static async getEstate(id: string | number): Promise<EstateResponse> {
    try {
      const response = await axiosInstance.get<EstateResponse>(
        `/properties/estates/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching estate:", error);
      throw error;
    }
  }

  public static async createEstate(
    payload: AddEstatePayload,
  ): Promise<EstateResponse> {
    try {
      const response = await axiosInstance.post<EstateResponse>(
        "/properties/estates",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating estate:", error);
      throw error;
    }
  }

  public static async uploadEstateImages(
    id: string | number,
    file: File,
  ): Promise<EstateImageResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post<EstateImageResponse>(
        `/properties/estates/${id}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading estate images:", error);
      throw error;
    }
  }
}
