"use client";

import { useMemo } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import {
  buildPermissionMaps,
  type UIModule,
  type UIPermissionMap,
  emptyPermissionMap,
} from "@/util/permissions";
import type { UserRole } from "@/util/status";

interface RolePermissions {
  /** Full permission map for this role */
  permissions: UIPermissionMap;
  /** Whether the permissions data is still loading */
  isLoading: boolean;
  /** Quick check: can this role view a specific module? */
  canView: (module: UIModule) => boolean;
  /** Quick check: can this role create in a specific module? */
  canCreate: (module: UIModule) => boolean;
  /** Quick check: can this role edit in a specific module? */
  canEdit: (module: UIModule) => boolean;
  /** Quick check: can this role delete in a specific module? */
  canDelete: (module: UIModule) => boolean;
  /** Is this module read-only? (can view but cannot create, edit, or delete) */
  isReadOnly: (module: UIModule) => boolean;
}

/**
 * Combines the permissions API data with a given role to provide
 * easy permission checks for use in any client.tsx page.
 *
 * Usage:
 * ```tsx
 * const { canView, canCreate, isReadOnly, isLoading } = useRolePermissions(role);
 * if (!canView("Clients")) return <NoAccess />;
 * return <ClientsListView isReadOnly={isReadOnly("Clients")} />;
 * ```
 */
export function useRolePermissions(role: UserRole): RolePermissions {
  const { data, isLoading } = usePermissions();

  const permissions = useMemo<UIPermissionMap>(() => {
    if (!data) return emptyPermissionMap();
    const maps = buildPermissionMaps(data);
    return maps[role] ?? emptyPermissionMap();
  }, [data, role]);

  const canView = (module: UIModule) => permissions[module]?.View ?? false;
  const canCreate = (module: UIModule) => permissions[module]?.Create ?? false;
  const canEdit = (module: UIModule) => permissions[module]?.Edit ?? false;
  const canDelete = (module: UIModule) => permissions[module]?.Delete ?? false;

  const isReadOnly = (module: UIModule) =>
    canView(module) &&
    !canCreate(module) &&
    !canEdit(module) &&
    !canDelete(module);

  return {
    permissions,
    isLoading,
    canView,
    canCreate,
    canEdit,
    canDelete,
    isReadOnly,
  };
}
