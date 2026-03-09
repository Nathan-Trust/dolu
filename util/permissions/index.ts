import type { PermissionEntry, PermissionsData } from "@/services/settings";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Canonical UI modules in display order */
export const UI_MODULES = [
  "Overview",
  "People",
  "Clients",
  "Properties",
  "Finance",
  "Maps",
  "Reports",
  "Settings",
] as const;

export type UIModule = (typeof UI_MODULES)[number];

/** Canonical UI actions in display order */
export const UI_ACTIONS = ["View", "Create", "Edit", "Delete"] as const;
export type UIAction = (typeof UI_ACTIONS)[number];

export type UIPermissionMap = Record<UIModule, Record<UIAction, boolean>>;

/* ------------------------------------------------------------------ */
/*  Mapping helpers  (API ↔ UI)                                        */
/* ------------------------------------------------------------------ */

/** Map an API module name (lowercase) → UI module label */
const moduleToUI: Record<string, UIModule> = {
  overview: "Overview",
  people: "People",
  clients: "Clients",
  properties: "Properties",
  finance: "Finance",
  maps: "Maps",
  reports: "Reports",
  settings: "Settings",
};

/** Map an API action name (lowercase) → UI action label */
const actionToUI: Record<string, UIAction> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  update: "Edit", // API may send "update" – treat as "Edit"
  delete: "Delete",
};

/* ------------------------------------------------------------------ */
/*  Build a blank permission map (all false)                           */
/* ------------------------------------------------------------------ */

export function emptyPermissionMap(): UIPermissionMap {
  const map = {} as UIPermissionMap;
  for (const mod of UI_MODULES) {
    map[mod] = {} as Record<UIAction, boolean>;
    for (const act of UI_ACTIONS) {
      map[mod][act] = false;
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/*  Build per-role permission maps from API response                   */
/* ------------------------------------------------------------------ */

/**
 * Converts the flat API permissions + rolePermissions into a
 * `Record<roleName, UIPermissionMap>` that the UI tables can render.
 *
 * `rolePermissions` from the API is `{ [roleName]: { [permissionId]: true } }`.
 * We cross-reference each permissionId with the `permissions` list to find
 * its module and action.
 */
export function buildPermissionMaps(
  apiData: PermissionsData,
): Record<string, UIPermissionMap> {
  const { roles, permissions, rolePermissions } = apiData;

  // Index permissions by id for fast lookup
  const permById = new Map<string, PermissionEntry>();
  for (const p of permissions) {
    permById.set(p.id, p);
  }

  const result: Record<string, UIPermissionMap> = {};

  for (const role of roles) {
    const map = emptyPermissionMap();
    const granted = rolePermissions[role.name] ?? {};

    for (const [permId, enabled] of Object.entries(granted)) {
      if (!enabled) continue;
      const perm = permById.get(permId);
      if (!perm) continue;

      const uiMod = moduleToUI[perm.module];
      const uiAct = actionToUI[perm.action];
      if (uiMod && uiAct) {
        map[uiMod][uiAct] = true;
      }
    }

    result[role.name] = map;
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Find a permission id by module + action                            */
/* ------------------------------------------------------------------ */

/**
 * Given a UI module and action, find the matching permission id from the
 * API permissions list. Returns `undefined` if no match.
 */
export function findPermissionId(
  permissions: PermissionEntry[],
  uiModule: UIModule,
  uiAction: UIAction,
): string | undefined {
  const modLower = uiModule.toLowerCase();
  const actLower = uiAction.toLowerCase();

  return permissions.find((p) => {
    if (p.module !== modLower) return false;
    const mapped = actionToUI[p.action];
    return mapped?.toLowerCase() === actLower;
  })?.id;
}

/* ------------------------------------------------------------------ */
/*  Check a single permission (for use in other components)            */
/* ------------------------------------------------------------------ */

/**
 * Quick helper that checks whether a given role has a specific module+action
 * permission. Pass in the pre-built maps from `buildPermissionMaps`.
 */
export function hasPermission(
  maps: Record<string, UIPermissionMap>,
  role: string,
  module: UIModule,
  action: UIAction,
): boolean {
  return maps[role]?.[module]?.[action] ?? false;
}
