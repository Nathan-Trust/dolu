import axiosInstance from "./axios-instance";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PermissionRole {
  id: number;
  name: string;
  description: string | null;
}

export interface PermissionEntry {
  id: string;
  module: string;
  action: string;
  name: string;
  description: string | null;
}

export interface PermissionsData {
  roles: PermissionRole[];
  permissions: PermissionEntry[];
  rolePermissions: Record<string, Record<string, boolean>>;
}

export interface PermissionsResponse {
  success: boolean;
  message: string;
  data: PermissionsData;
  status: number;
}

export interface UpdatePermissionPayload {
  roleId: number;
  permissionId: string;
  enabled: boolean;
}

export interface UpdatePermissionResponse {
  success: boolean;
  message: string;
  data: unknown;
  status: number;
}

/* ------------------------------------------------------------------ */
/*  Service                                                            */
/* ------------------------------------------------------------------ */

export class SettingsService {
  public static async getPermissions(): Promise<PermissionsResponse> {
    const response = await axiosInstance.get<PermissionsResponse>(
      "/settings/permissions",
    );
    return response.data;
  }

  public static async updatePermission(
    payload: UpdatePermissionPayload,
  ): Promise<UpdatePermissionResponse> {
    const response = await axiosInstance.put<UpdatePermissionResponse>(
      "/settings/permissions",
      payload,
    );
    return response.data;
  }
}
