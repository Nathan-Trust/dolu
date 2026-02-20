/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios-instance";
import type { ApiWrapper, Meta } from "./people";


export interface Client {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  status?: string;
  property_id?: number | null;
  assigned_staff?: string | null;
  created_by?: string | null;
  sales_stage?: string | null;
  deal_value?: number | null;
  created_at?: string;
  updated_at?: string | null;
}

export type ClientsListResponse = ApiWrapper<{ data: Client[]; meta: Meta }>;
export type ClientResponse = ApiWrapper<Client>;

export class ClientService {
  public static async getAllClients(
    params?: Record<string, any>,
  ): Promise<ClientsListResponse> {
    try {
      const response = await axiosInstance.get<ClientsListResponse>("/clients", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  }

  public static async getClient(id: string | number): Promise<ClientResponse> {
    try {
      const response = await axiosInstance.get<ClientResponse>(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  }

  public static async createClient(
    payload: Partial<Client> | Record<string, any>,
  ): Promise<ClientResponse> {
    try {
      const response = await axiosInstance.post<ClientResponse>("/clients", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  }

  public static async updateClient(
    id: string | number,
    payload: Partial<Client> | Record<string, any>,
  ): Promise<ClientResponse> {
    try {
      const response = await axiosInstance.put<ClientResponse>(`/clients/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  }

  public static async deleteClient(id: string | number): Promise<ClientResponse> {
    try {
      const response = await axiosInstance.delete<ClientResponse>(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  }
}
