"use client";

import { useState, useCallback } from "react";
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
import { type UserRole, getRoleConfig } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const modules = [
  "Overview",
  "People",
  "Clients",
  "Properties",
  "Finance",
  "Maps",
  "Reports",
  "Settings",
] as const;

type Module = (typeof modules)[number];

const permissions = ["View", "Create", "Edit", "Delete"] as const;
type Permission = (typeof permissions)[number];

const roles: UserRole[] = ["chairman", "admin", "staff", "realtor"];

/* ------------------------------------------------------------------ */
/*  Default permissions (matching Figma screenshot)                    */
/* ------------------------------------------------------------------ */

type PermissionMap = Record<Module, Record<Permission, boolean>>;

const defaultPermissions: Record<UserRole, PermissionMap> = {
  chairman: {
    Overview: { View: true, Create: false, Edit: false, Delete: false },
    People: { View: true, Create: false, Edit: false, Delete: false },
    Clients: { View: true, Create: false, Edit: false, Delete: false },
    Properties: { View: true, Create: false, Edit: false, Delete: false },
    Finance: { View: true, Create: false, Edit: false, Delete: false },
    Maps: { View: true, Create: false, Edit: false, Delete: false },
    Reports: { View: true, Create: false, Edit: false, Delete: false },
    Settings: { View: true, Create: false, Edit: false, Delete: false },
  },
  admin: {
    Overview: { View: true, Create: true, Edit: true, Delete: true },
    People: { View: true, Create: true, Edit: true, Delete: true },
    Clients: { View: true, Create: true, Edit: true, Delete: true },
    Properties: { View: true, Create: true, Edit: true, Delete: true },
    Finance: { View: true, Create: true, Edit: true, Delete: true },
    Maps: { View: true, Create: true, Edit: true, Delete: true },
    Reports: { View: true, Create: true, Edit: true, Delete: true },
    Settings: { View: true, Create: true, Edit: true, Delete: true },
  },
  staff: {
    Overview: { View: true, Create: false, Edit: false, Delete: false },
    People: { View: true, Create: false, Edit: false, Delete: false },
    Clients: { View: true, Create: true, Edit: true, Delete: false },
    Properties: { View: true, Create: false, Edit: false, Delete: false },
    Finance: { View: true, Create: false, Edit: false, Delete: false },
    Maps: { View: true, Create: true, Edit: false, Delete: false },
    Reports: { View: true, Create: true, Edit: false, Delete: false },
    Settings: { View: false, Create: false, Edit: false, Delete: false },
  },
  realtor: {
    Overview: { View: true, Create: false, Edit: false, Delete: false },
    People: { View: false, Create: false, Edit: false, Delete: false },
    Clients: { View: false, Create: false, Edit: false, Delete: false },
    Properties: { View: true, Create: false, Edit: false, Delete: false },
    Finance: { View: false, Create: false, Edit: false, Delete: false },
    Maps: { View: true, Create: false, Edit: false, Delete: false },
    Reports: { View: true, Create: false, Edit: false, Delete: false },
    Settings: { View: false, Create: false, Edit: false, Delete: false },
  },
};

/* Deep-clone helper to avoid mutating the default object */
function clonePermissions(
  src: Record<UserRole, PermissionMap>,
): Record<UserRole, PermissionMap> {
  return JSON.parse(JSON.stringify(src));
}

/* ------------------------------------------------------------------ */
/*  Role–card badge background tints (light pastel strip)              */
/* ------------------------------------------------------------------ */

const roleBadgeBg: Record<UserRole, string> = {
  chairman: getRoleConfig("chairman").bgColor,
  admin: getRoleConfig("admin").bgColor,
  staff: getRoleConfig("staff").bgColor,
  realtor: getRoleConfig("realtor").bgColor,
};

/* ------------------------------------------------------------------ */
/*  Single role permission table                                       */
/* ------------------------------------------------------------------ */

function RolePermissionTable({
  role,
  permissionMap,
  onToggle,
}: {
  role: UserRole;
  permissionMap: PermissionMap;
  onToggle: (mod: Module, perm: Permission) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg bg-[#f8f8f8]">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            {/* Role badge header cell */}
            <TableHead className="w-40 py-2 pl-4">
              <div
                className="inline-block rounded-md px-3 py-1"
                style={{ backgroundColor: roleBadgeBg[role] }}
              >
                <RoleBadge role={role} />
              </div>
            </TableHead>
            {permissions.map((perm) => (
              <TableHead
                key={perm}
                className="py-2 font-montserrat text-sm font-bold text-[#0f0f0f]"
              >
                {perm}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((mod) => (
            <TableRow key={mod} className="border-none">
              <TableCell className="py-2 pl-4 font-montserrat text-sm text-[#0f0f0f]">
                {mod}
              </TableCell>
              {permissions.map((perm) => (
                <TableCell key={perm} className="py-2">
                  <Checkbox
                    checked={permissionMap[mod][perm]}
                    onCheckedChange={() => onToggle(mod, perm)}
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
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function AccessControl() {
  const [permState, setPermState] = useState(() =>
    clonePermissions(defaultPermissions),
  );

  /* Dialog states */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleToggle = useCallback(
    (role: UserRole, mod: Module, perm: Permission) => {
      setPermState((prev) => {
        const next = clonePermissions(prev);
        next[role][mod][perm] = !next[role][mod][perm];
        return next;
      });
    },
    [],
  );

  /* Step 1: Save button → confirm dialog */
  const handleSave = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  /* Step 2: Confirm → authorize password dialog */
  const handleConfirm = useCallback(() => {
    setConfirmOpen(false);
    setAuthorizeOpen(true);
  }, []);

  /* Step 3: Authorize → success dialog */
  const handleAuthorize = useCallback(
    (password: string) => {
      setAuthorizeOpen(false);
      // TODO: API call to persist permissions with password
      console.log("Saving permissions:", permState, password);
      setSuccessOpen(true);
    },
    [permState],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Role permission tables */}
      {roles.map((role) => (
        <RolePermissionTable
          key={role}
          role={role}
          permissionMap={permState[role]}
          onToggle={(mod, perm) => handleToggle(role, mod, perm)}
        />
      ))}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-lg bg-[#8a38f5] px-8 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#7a2de0]"
        >
          Save Changes
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
        description="You have successfully updated Admin Access #"
        actionLabel="Done"
        onAction={() => setSuccessOpen(false)}
      />
    </div>
  );
}
