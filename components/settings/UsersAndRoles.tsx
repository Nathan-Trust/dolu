"use client";

import { useState, useMemo } from "react";
import {
  UserPlus,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  KeyRound,
  Trash2,
  X,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { RoleBadge } from "@/components/shared/RoleBadge";
import CustomTable from "@/components/shared/CustomTable";
import CustomSearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import UserDetailDialog from "@/components/settings/UserDetailDialog";
import type { UserDetail } from "@/components/settings/UserDetailDialog";
import AddUserSheet from "@/components/settings/AddUserSheet";
import { type UserRole, isValidRole } from "@/util/status";
import { usePeople } from "@/hooks/usePeople";
import { PeopleService } from "@/services/people";
import { QueryKeys } from "@/models/query";
import { useInvalidateQueries } from "@/hooks/use-invalidate-query";
import { errorToast, successToast } from "@/util/toast";
import { FetchLoadingAndEmptyState } from "@/components/shared/FetchLoadinAndEmptyState";
import { CustomTableSkeleton } from "@/components/shared/CustomTableSkeleton";
import CustomTableEmptyState from "@/components/shared/CustomTableEmptyState";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Raw user record (for filtering) */
interface RawUser {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  email: string;
  role: UserRole;
  status: "Active" | "Suspended";
  lastLogin: string;
}

/** Table row after rendering cells */
interface UserTableRow {
  id: string;
  name: React.ReactNode;
  email: string;
  role: React.ReactNode;
  status: React.ReactNode;
  lastLogin: string;
  action: React.ReactNode;
  [key: string]: React.ReactNode | string | number | null | object;
}

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function UserStatusBadge({ status }: { status: "Active" | "Suspended" }) {
  const isActive = status === "Active";
  return (
    <Badge
      className="font-montserrat text-xs font-medium"
      style={{
        backgroundColor: isActive ? "#e8f9ee" : "#fff3e0",
        color: isActive ? "#34c759" : "#f5a623",
      }}
    >
      {status}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar with initials                                               */
/* ------------------------------------------------------------------ */

function UserAvatar({
  initials,
  bgColor,
  name,
}: {
  initials: string;
  bgColor: string;
  name: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
      <span className="font-montserrat text-sm text-[#0f0f0f]">{name}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Action popover (three-dot menu)                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Suspend confirmation dialog                                        */
/* ------------------------------------------------------------------ */

function SuspendAlertDialog({
  userName,
  open,
  onOpenChange,
  onConfirm,
}: {
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl p-6">
        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle className="font-montserrat text-base font-bold text-[#0f0f0f]">
            Are you sure you want to suspend this user?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-montserrat text-sm text-[#6f6d6d]">
            {userName} will be suspended from this platform
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-row justify-center gap-3 sm:justify-center">
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#8a38f5] px-8 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#7a2de0]"
          >
            Confirm
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-[#f2d5ff] px-8 py-2.5 font-montserrat text-sm font-semibold text-[#8a38f5] transition-colors hover:bg-[#e8c0ff]"
          >
            Cancel
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Authorize suspension dialog (password step)                        */
/* ------------------------------------------------------------------ */

function AuthorizeSuspendDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Authorize Action",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => void;
  title?: string;
}) {
  const [password, setPassword] = useState("");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl p-6">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-0.5 text-[#6f6d6d] hover:text-[#0f0f0f]"
        >
          <X className="h-5 w-5" />
        </button>

        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle className="font-montserrat text-base font-bold text-[#0f0f0f]">
            {title}
          </AlertDialogTitle>
          {/* Empty description to avoid accessibility warning */}
          <AlertDialogDescription className="sr-only">
            Enter your password to authorize this action
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-2 flex flex-col gap-1.5">
          <label className="font-montserrat text-sm text-[#0f0f0f]">
            Enter Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="h-10 rounded-lg border border-[#e0e0e0] bg-[#f3f3f3] px-3 font-montserrat text-sm text-[#0f0f0f] outline-none focus:border-[#8a38f5]"
          />
        </div>

        <AlertDialogFooter className="mt-5 flex-row justify-center gap-3 sm:justify-center">
          <button
            onClick={() => {
              onConfirm(password);
              setPassword("");
            }}
            disabled={!password.trim()}
            className="rounded-lg bg-[#8a38f5] px-8 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#7a2de0] disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              onOpenChange(false);
              setPassword("");
            }}
            className="rounded-lg bg-[#f2d5ff] px-8 py-2.5 font-montserrat text-sm font-semibold text-[#8a38f5] transition-colors hover:bg-[#e8c0ff]"
          >
            Cancel
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Action popover (three-dot menu)                                    */
/* ------------------------------------------------------------------ */

function ActionPopover({
  user,
  onView,
  onSuspend,
  onActivate,
  onDelete,
}: {
  user: RawUser;
  onView: (user: RawUser) => void;
  onSuspend: (user: RawUser) => void;
  onActivate: (user: RawUser) => void;
  onDelete?: (user: RawUser) => void;
}) {
  const [open, setOpen] = useState(false);

  const isSuspended = user.status === "Suspended";

  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: () => {
        setOpen(false);
        onView(user);
      },
    },
    {
      icon: isSuspended ? Play : Pause,
      label: isSuspended ? "Activate" : "Suspend",
      onClick: () => {
        setOpen(false);
        if (isSuspended) {
          onActivate(user);
        } else {
          onSuspend(user);
        }
      },
    },
    { icon: KeyRound, label: "Reset Password", onClick: () => setOpen(false) },
    {
      icon: Trash2,
      label: "Delete User",
      danger: true,
      onClick: () => {
        setOpen(false);
        onDelete?.(user);
      },
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#e0e0e0]"
          aria-label={`Actions for ${user.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4 text-[#6f6d6d]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-44 p-1"
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-montserrat text-sm transition-colors hover:bg-[#f3f3f3] ${
              action.danger ? "text-[#ff383c]" : "text-[#0f0f0f]"
            }`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar color map                                                   */
/* ------------------------------------------------------------------ */

const avatarColors: Record<UserRole, string> = {
  chairman: "#f5a623",
  admin: "#3b82f6",
  staff: "#34c759",
  realtor: "#8a38f5",
  manager: "#ff6b35",
  procurement: "#e91e63",
  finance: "#009688",
};

/* ------------------------------------------------------------------ */
/*  Category filter options                                            */
/* ------------------------------------------------------------------ */

const categoryOptions = [
  { label: "Chairman", value: "chairman" },
  { label: "Admin", value: "admin" },
  { label: "Staff", value: "staff" },
  { label: "Realtor", value: "realtor" },
  { label: "Manager", value: "manager" },
  { label: "Procurement", value: "procurement" },
  { label: "Finance", value: "finance" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface UsersAndRolesProps {
  role: UserRole;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UsersAndRoles({ role }: UsersAndRolesProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    (string | number)[]
  >([]);
  const [viewUser, setViewUser] = useState<UserDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [activateTarget, setActivateTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [activateAuthorizeOpen, setActivateAuthorizeOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteAuthorizeOpen, setDeleteAuthorizeOpen] = useState(false);

  /* Fetch people from API */
  const { data: peopleData, isLoading, refetch } = usePeople({ search });
  const { invalidateQuery } = useInvalidateQueries();

  /* Map API people to RawUser for the table */
  const users: RawUser[] = useMemo(() => {
    if (!peopleData?.data) return [];
    return peopleData.data.map((p) => {
      const name = `${p.first_name} ${p.last_name}`.trim();
      const initials =
        `${p.first_name?.[0] || ""}${p.last_name?.[0] || ""}`.toUpperCase();
      const roleNameRaw = p.role?.name?.toLowerCase() || "staff";
      const roleName = isValidRole(roleNameRaw) ? roleNameRaw : "staff";
      return {
        id: p.id,
        name,
        initials,
        avatarColor: avatarColors[roleName] || "#8a38f5",
        email: p.email,
        role: roleName,
        status: (p.status === "suspended" ? "Suspended" : "Active") as
          | "Active"
          | "Suspended",
        lastLogin: p.last_active
          ? new Date(p.last_active).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "Never",
      };
    });
  }, [peopleData]);

  /* Suspend mutation */
  const suspendMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      PeopleService.suspendPerson(id, password),
    onSuccess: () => {
      invalidateQuery([QueryKeys.Get_People]);
      invalidateQuery([QueryKeys.Get_User_List]);
      refetch();
      setAuthorizeOpen(false);
      setSuspendTarget(null);
      successToast({ title: "User", message: "User suspended successfully" });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      errorToast({
        title: "User",
        message: error?.response?.data?.message || "Failed to suspend user",
      });
    },
  });

  /* Delete mutation */
  const deleteMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      PeopleService.deletePerson(id, password),
    onSuccess: () => {
      invalidateQuery([QueryKeys.Get_People]);
      invalidateQuery([QueryKeys.Get_User_List]);
      refetch();
      setDeleteAuthorizeOpen(false);
      setDeleteTarget(null);
      successToast({ title: "User", message: "User deleted successfully" });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      errorToast({
        title: "User",
        message: error?.response?.data?.message || "Failed to delete user",
      });
    },
  });

  /* Activate mutation */
  const activateMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      PeopleService.activatePerson(id, password),
    onSuccess: () => {
      invalidateQuery([QueryKeys.Get_People]);
      invalidateQuery([QueryKeys.Get_User_List]);
      refetch();
      setActivateAuthorizeOpen(false);
      setActivateTarget(null);
      successToast({ title: "User", message: "User activated successfully" });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      errorToast({
        title: "User",
        message: error?.response?.data?.message || "Failed to activate user",
      });
    },
  });

  const handleSuspendUser = (user: { id: string; name: string }) => {
    setSuspendTarget(user);
    setSuspendOpen(true);
  };

  const handleDeleteUser = (user: { id: string; name: string }) => {
    setDeleteTarget(user);
    setDeleteAuthorizeOpen(true);
  };

  const handleActivateUser = (user: { id: string; name: string }) => {
    setActivateTarget(user);
    setActivateAuthorizeOpen(true);
  };

  /* Step 1 → Step 2: close confirm dialog, open authorize dialog */
  const handleConfirmSuspend = () => {
    setSuspendOpen(false);
    setAuthorizeOpen(true);
  };

  /* Step 2 final: authorize with password */
  const handleAuthorizeSuspend = (password: string) => {
    if (suspendTarget) {
      suspendMutation.mutate({ id: suspendTarget.id, password });
    }
  };

  /* Delete authorize with password */
  const handleAuthorizeDelete = (password: string) => {
    if (deleteTarget) {
      deleteMutation.mutate({ id: deleteTarget.id, password });
    }
  };

  /* Activate authorize with password */
  const handleAuthorizeActivate = (password: string) => {
    if (activateTarget) {
      activateMutation.mutate({ id: activateTarget.id, password });
    }
  };

  const handleViewUser = (raw: RawUser) => {
    setViewUser({
      name: raw.name,
      initials: raw.initials,
      avatarColor: raw.avatarColor,
      role: raw.role,
      performance: "Excellent",
      status: raw.status,
      lastActivity: raw.lastLogin,
      accountCreated: raw.lastLogin,
      weeklyReports: 0,
      missedReports: 0,
    });
    setDialogOpen(true);
  };

  /* Build table rows with rendered cells */
  const tableData: UserTableRow[] = useMemo(() => {
    let filtered = [...users];

    /* category (role) filter */
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((u) =>
        selectedCategories.includes(u.role as string),
      );
    }

    return filtered.map((u) => ({
      id: u.id,
      email: u.email,
      lastLogin: u.lastLogin,
      /* Name cell: avatar + name */
      name: (
        <UserAvatar
          initials={u.initials}
          bgColor={u.avatarColor}
          name={u.name}
        />
      ),
      /* Role cell: badge */
      role: <RoleBadge role={u.role} />,
      /* Status cell: badge */
      status: <UserStatusBadge status={u.status} />,
      /* Action cell: three-dot popover */
      action: (
        <ActionPopover
          user={u}
          onView={handleViewUser}
          onSuspend={(u) => handleSuspendUser({ id: u.id, name: u.name })}
          onActivate={(u) => handleActivateUser({ id: u.id, name: u.name })}
          onDelete={(u) => handleDeleteUser({ id: u.id, name: u.name })}
        />
      ),
    }));
  }, [users, selectedCategories]);

  const headers = ["Name", "Email", "Role", "Status", "Last Login", "Action"];

  const headerKeyMap: Record<string, string> = {
    Name: "name",
    Email: "email",
    Role: "role",
    Status: "status",
    "Last Login": "lastLogin",
    Action: "action",
  };

  return (
    <>
      <SuspendAlertDialog
        userName={suspendTarget?.name || ""}
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        onConfirm={handleConfirmSuspend}
      />
      <AuthorizeSuspendDialog
        open={authorizeOpen}
        onOpenChange={setAuthorizeOpen}
        onConfirm={handleAuthorizeSuspend}
        title="Authorize Suspension"
      />
      <AuthorizeSuspendDialog
        open={deleteAuthorizeOpen}
        onOpenChange={setDeleteAuthorizeOpen}
        onConfirm={handleAuthorizeDelete}
        title="Authorize Deletion"
      />
      <AuthorizeSuspendDialog
        open={activateAuthorizeOpen}
        onOpenChange={setActivateAuthorizeOpen}
        onConfirm={handleAuthorizeActivate}
        title="Authorize Activation"
      />
      <UserDetailDialog
        user={viewUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuspend={(u) => handleSuspendUser({ id: "", name: u.name })}
      />
      <AddUserSheet
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSuccess={() => {
          // Refresh the users list after successful creation
          refetch();
        }}
      />
      {/* Always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <CustomSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
            <CustomMultiSelectFilter
              title="Category"
              options={categoryOptions}
              selectedValues={selectedCategories}
              onApplyFilter={setSelectedCategories}
            />
          </div>
          <button
            onClick={() => setAddUserOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#8a38f5] px-4 py-2 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#7a2de0]"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>

        <FetchLoadingAndEmptyState
          data={tableData.length}
          isLoading={isLoading}
          numberOfSkeleton={1}
          skeleton={<CustomTableSkeleton headers={headers} rows={5} />}
          emptyState={
            <CustomTableEmptyState
              headers={headers}
              emptyMessage="No users found. Add a new user to get started."
            />
          }
        >
          <CustomTable
            headers={headers}
            data={tableData}
            headerKeyMap={headerKeyMap}
          />
        </FetchLoadingAndEmptyState>
      </div>
    </>
  );
}
