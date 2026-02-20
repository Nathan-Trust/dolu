/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios-instance";

export type Meta = { total: number; page: number; pageSize: number };

export interface ApiWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
  updated_at?: string | null;
  last_active?: string | null;
  role?: { id: number; name: string };
  status?: string;
  performance?: string;
}

/** Extended person type returned by GET /people/:id */
export interface PersonDetail extends Person {
  role_id?: number;
  user_name?: string;
  picture?: string | null;
  password_updated_at?: string | null;
  clientsAssigned?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  sales_value?: number;
  deals_count?: number;
  deals_closed?: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface AddPersonPayload {
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
}

export interface AddPersonResponse {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    role: { id: number; name: string };
  };
  password: string;
}

export type PeopleListResponse = ApiWrapper<{ data: Person[]; meta: Meta }>;
export type PersonResponse = ApiWrapper<PersonDetail>;
export type RolesResponse = ApiWrapper<Role[]>;
export type AddPersonApiResponse = ApiWrapper<AddPersonResponse>;

export class PeopleService {
  public static async getAllPeople(
    params?: Record<string, any>,
  ): Promise<PeopleListResponse> {
    try {
      const response = await axiosInstance.get<PeopleListResponse>("/people", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching people:", error);
      throw error;
    }
  }

  public static async getPerson(id: string): Promise<PersonResponse> {
    try {
      const response = await axiosInstance.get<PersonResponse>(`/people/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching person:", error);
      throw error;
    }
  }

  public static async addPerson(
    payload: AddPersonPayload,
  ): Promise<AddPersonApiResponse> {
    try {
      const response = await axiosInstance.post<AddPersonApiResponse>(
        "/people",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding person:", error);
      throw error;
    }
  }

  public static async suspendPerson(
    id: string,
    password: string,
  ): Promise<ApiWrapper<null>> {
    try {
      const response = await axiosInstance.patch<ApiWrapper<null>>(
        `/people/${id}/suspend`,
        { password },
      );
      return response.data;
    } catch (error) {
      console.error("Error suspending person:", error);
      throw error;
    }
  }

  public static async deletePerson(
    id: string,
    password: string,
  ): Promise<ApiWrapper<null>> {
    try {
      const response = await axiosInstance.delete<ApiWrapper<null>>(
        `/people/${id}`,
        { data: { password } },
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting person:", error);
      throw error;
    }
  }

  public static async getRoles(): Promise<RolesResponse> {
    try {
      const response = await axiosInstance.get<RolesResponse>("/people/roles");
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }
}
