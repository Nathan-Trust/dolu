/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios-instance";

import type { ApiWrapper, Meta } from "./people";

export interface EstateSummary {
  id: number;
  title: string;
  description?: string | null;
  location?: string | null;
  country?: string | null;
}

export interface PropertyImage {
  id: number;
  property_id: number | null;
  estate_id: number | null;
  fileUrl: string;
  fileType: string;
  createdAt: string;
  updated_at: string | null;
}

export interface Property {
  id: number | string;
  title: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  property_type?: string;
  price?: number | null;
  estate_id?: number | null;
  status?: string;
  createdById?: string;
  updatedById?: string | null;
  created_at?: string;
  updated_at?: string | null;
  estate?: EstateSummary | null;
  images?: any[];
}

export interface AddPropertyPayload {
  title: string;
  address: string;
  property_type: string;
  estate_id: number;
}

export type PropertiesListResponse = ApiWrapper<{
  data: Property[];
  meta: Meta;
}>;
export type PropertyResponse = ApiWrapper<Property>;
export type PropertyImageResponse = ApiWrapper<PropertyImage>;

export class PropertyService {
  public static async getAllProperties(
    params?: Record<string, any>,
  ): Promise<PropertiesListResponse> {
    try {
      const response = await axiosInstance.get<PropertiesListResponse>(
        "/properties",
        { params },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  public static async getProperty(
    id: string | number,
  ): Promise<PropertyResponse> {
    try {
      const response = await axiosInstance.get<PropertyResponse>(
        `/properties/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching property:", error);
      throw error;
    }
  }

  public static async createProperty(
    payload: AddPropertyPayload,
  ): Promise<PropertyResponse> {
    try {
      const response = await axiosInstance.post<PropertyResponse>(
        "/properties",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  public static async uploadPropertyImages(
    id: string | number,
    file: File,
  ): Promise<PropertyImageResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post<PropertyImageResponse>(
        `/properties/${id}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading property images:", error);
      throw error;
    }
  }
}
