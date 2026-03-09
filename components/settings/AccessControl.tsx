"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleBadge } from "@/components/shared/RoleBadge";
import SuccessDialog from "@/components/shared/SuccessDialog";
import ConfirmUpdateDialog from "@/components/settings/ConfirmUpdateDialog";
import AuthorizeActionDialog from "@/components/settings/AuthorizeActionDialog";
import { CustomTableSkeleton } from "@/components/shared/CustomTableSkeleton";
import { getRoleConfig } from "@/util/status";
import { usePermissions } from "@/hooks/usePermissions";
import { SettingsService } from "@/services/settings";
import { useInvalidateQueries } from "@/hooks/use-invalidate-query";
import { QueryKeys } from "@/models/query";
import { errorToast, successToast } from "@/util/toast";
import {
  UI_MODULES,
  UI_ACTIONS,
  type UIModule,
  type UIAction,
  type UIPermissionMap,
  buildPermissionMaps,
  findPermissionId,
} from "@/util/permissions";

/* ------------------------------------------------------------------ */
/*  Single role permission table                                       */
/* ------------------------------------------------------------------ */

function RolePermissionTable({
  roleName,
  permissionMap,
  onToggle,
}: {
  roleName: string;
  permissionMap: UIPermissionMap;
  onToggle: (mod: UIModule, action: UIAction) => void;
}) {
  const bgColor = (() => {
    try {
      return getRoleConfig(roleName as Parameters<typeof getRoleConfig>[0])
        .bgColor;
    } catch {
      return "#e0e0e0";
    }
  })();

  return (
    <div className="overflow-x-auto rounded-lg bg-[#f8f8f8]">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-40 py-2 pl-4">
              <div
                className="inline-block rounded-md px-3 py-1"
                style={{ backgroundColor: bgColor }}
              >
                <RoleBadge
                  role={roleName as Parameters<typeof getRoleConfig>[0]}
                />
              </div>
            </TableHead>
            {UI_ACTIONS.map((action) => (
              <TableHead
                key={action}
                className="py-2 font-montserrat text-sm font-bold text-[#0f0f0f]"
              >
                {action}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {UI_MODULES.map((mod) => (
            <TableRow key={mod} className="border-none">
              <TableCell className="py-2 pl-4 font-montserrat text-sm text-[#0f0f0f]">
                {mod}
              </TableCell>
              {UI_ACTIONS.map((action) => (
                <TableCell key={action} className="py-2">
                  <Checkbox
                    checked={permissionMap[mod][action]}
                    onCheckedChange={() => onToggle(mod, action)}
                    className="data-[state=checked]:bg-[#8a38f5] data-[state=checked]:border-[#8a38f5]"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pending-change tracker                                             */
/* ------------------------------------------------------------------ */

interface PendingChange {
  roleId: number;
  permissionId: string;
  enabled: boolean;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function AccessControl() {
  const { data: apiData, isLoading } = usePermissions();
  const { invalidateQuery } = useInvalidateQueries();

  /* Derive roles and initial permission maps from API data */
  const roles = useMemo(() => apiData?.roles ?? [], [apiData]);
  const serverMaps = useMemo(
    () => (apiData ? buildPermissionMaps(apiData) : null),
    [apiData],
  );

  /* Local permission state (editable copy of API data) */
  const [permState, setPermState] = useState<Record<string, UIPermissionMap>>(
    {},
  );

  /* Track which toggles have changed vs server state */
  const pendingChanges = useRef<PendingChange[]>([]);

  /* Seed local state when API data arrives */
  useEffect(() => {
    if (!serverMaps) return;
    setPermState(serverMaps);
    pendingChanges.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData]);

  /* Dialog states */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  /* ---- Toggle handler ---- */
  const handleToggle = useCallback(
    (roleName: string, mod: UIModule, action: UIAction) => {
      if (!apiData) return;
      const role = roles.find((r) => r.name === roleName);
      if (!role) return;

      const permId = findPermissionId(apiData.permissions, mod, action);
      if (!permId) return;

      setPermState((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as typeof prev;
        const newVal = !next[roleName][mod][action];
        next[roleName][mod][action] = newVal;

        /* Record or update the pending change */
        const existing = pendingChanges.current.find(
          (c) => c.roleId === role.id && c.permissionId === permId,
        );
        if (existing) {
          existing.enabled = newVal;
        } else {
          pendingChanges.current.push({
            roleId: role.id,
            permissionId: permId,
            enabled: newVal,
          });
        }

        return next;
      });
    },
    [apiData, roles],
  );

  /* ---- Save mutation ---- */
  const saveMutation = useMutation({
    mutationFn: async (changes: PendingChange[]) => {
      await Promise.all(
        changes.map((c) => SettingsService.updatePermission(c)),
      );
    },
    onSuccess: () => {
      pendingChanges.current = [];
      invalidateQuery([QueryKeys.Get_Permission_List]);
      setSuccessOpen(true);
      successToast({
        title: "Permissions",
        message: "Permissions updated successfully",
      });
    },
    onError: () => {
      errorToast({
        title: "Permissions",
        message: "Failed to update permissions",
      });
    },
  });

  /* Step 1: Save button → confirm dialog */
  const handleSave = useCallback(() => {
    if (pendingChanges.current.length === 0) return;
    setConfirmOpen(true);
  }, []);

  /* Step 2: Confirm → authorize password dialog */
  const handleConfirm = useCallback(() => {
    setConfirmOpen(false);
    setAuthorizeOpen(true);
  }, []);

  /* Step 3: Authorize → persist via API */
  const handleAuthorize = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_password: string) => {
      setAuthorizeOpen(false);
      saveMutation.mutate([...pendingChanges.current]);
    },
    [saveMutation],
  );

  /* ---- Loading state ---- */
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CustomTableSkeleton
            key={i}
            headers={["Module", ...UI_ACTIONS]}
            rows={UI_MODULES.length}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Role permission tables */}
      {roles.map((role) => {
        const map = permState[role.name];
        if (!map) return null;
        return (
          <RolePermissionTable
            key={role.id}
            roleName={role.name}
            permissionMap={map}
            onToggle={(mod, action) => handleToggle(role.name, mod, action)}
          />
        );
      })}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="rounded-lg bg-[#8a38f5] px-8 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#7a2de0] disabled:opacity-50"
        >
          {saveMutation.isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Step 1: Confirm update dialog */}
      <ConfirmUpdateDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirm}
      />

      {/* Step 2: Authorize action dialog */}
      <AuthorizeActionDialog
        open={authorizeOpen}
        onOpenChange={setAuthorizeOpen}
        onConfirm={handleAuthorize}
      />

      {/* Step 3: Success dialog */}
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Access Level Updated"
        description="You have successfully updated the access permissions"
        actionLabel="Done"
        onAction={() => setSuccessOpen(false)}
      />
    </div>
  );
}
