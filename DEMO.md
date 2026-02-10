# Dolu — Demo Walkthrough

> **Pre-requisite:** Run `pnpm dev` then open `http://localhost:3000`

---

## 1. Auth Flow (simulated — no backend required)

The root URL (`/`) auto-redirects to **Sign In**.

| Step | Page                          | What to do                                                               | Where it goes                    |
| ---- | ----------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| 1    | `/sign-in`                    | Enter any valid email + password (≥ 8 chars), click **Sign in**          | → `/2fa`                         |
| 2    | `/2fa`                        | Enter any 5-digit code (e.g. `12345`), click **Proceed**                 | → `/reset-password`              |
| 3    | `/reset-password`             | Fill current password, new password, confirm password, click **Proceed** | → `/role-confirmation/chairman`  |
| 4    | `/role-confirmation/chairman` | Review role info, click **Proceed**                                      | → `/dashboard/chairman/overview` |

### Quick-access role URLs

Skip the auth flow entirely by visiting any dashboard directly:

- **Chairman:** `http://localhost:3000/dashboard/chairman/overview`
- **Admin:** `http://localhost:3000/dashboard/admin/overview`
- **Staff:** `http://localhost:3000/dashboard/staff/overview`
- **Realtor:** `http://localhost:3000/dashboard/realtor/overview`

To change the role in the role-confirmation step, manually visit:

- `/role-confirmation/admin`
- `/role-confirmation/staff`
- `/role-confirmation/realtor`

---

## 2. Dashboard Tabs

Once inside the dashboard, the sidebar provides access to:

| Tab        | URL segment   | Status                                              |
| ---------- | ------------- | --------------------------------------------------- |
| Overview   | `/overview`   | ✅ Built (Chairman, Admin, Staff, Realtor variants) |
| People     | `/people`     | ✅ Built                                            |
| Clients    | `/clients`    | ✅ Built                                            |
| Properties | `/properties` | ✅ Built                                            |
| Finance    | `/finance`    | ✅ Built (hidden for Realtor)                       |
| Map        | `/map`        | ✅ Built                                            |
| Settings   | `/settings`   | ✅ Built                                            |

---

## 3. Settings Sub-Tabs

Navigate to Settings, then use the sub-tab bar:

| Sub-Tab                | URL param                 | Features                                                                                                                           |
| ---------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Users & Roles**      | `?tab=user-roles`         | User table, search, category filter, three-dot menu (View → detail dialog, Suspend → two-step confirm + authorize), Add User sheet |
| **Access Control**     | `?tab=access-control`     | 4 role permission grids (Chairman/Admin/Staff/Realtor), checkbox toggles, Save → Confirm → Authorize password → Success dialog     |
| **System Preferences** | `?tab=system-preferences` | Reporting week, currency, date format, timezone, default dashboard per role                                                        |
| **Security**           | `?tab=security`           | Force password reset, password strength, session timeout, 2FA toggles, password policy (min length, expiry, complexity)            |
| **Audit Logs**         | `?tab=audit-logs`         | Coming soon                                                                                                                        |

### Settings demo flow — Access Control save

1. Toggle any permission checkbox
2. Click **Save Changes**
3. Confirm dialog appears → click **Confirm**
4. Authorize dialog appears → enter any password → click **Confirm**
5. Success dialog: "Success! Access Level Updated"

### Settings demo flow — Add User

1. Click **Add User** button
2. Fill Full Name, Email, select a Role
3. Temporary password is auto-generated (click copy icon to copy)
4. Click **Create User**

### Settings demo flow — Suspend User

1. Click three-dot menu on any user → **Suspend**
2. Confirmation dialog → click **Confirm**
3. Authorize dialog → enter any password → click **Confirm**

---

## 4. Responsive Behaviour

| Breakpoint            | Sidebar                                                                      | TopNavBar                                               |
| --------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Desktop** (≥ 768px) | Always visible, fixed left                                                   | Full search bar + user name/email                       |
| **Mobile** (< 768px)  | Hidden — hamburger menu icon opens sidebar as a slide-in Sheet from the left | Compact search bar, user name/email hidden, avatar only |

To test: resize the browser window below 768px width, or use Chrome DevTools device toolbar.

---

## 5. Test Credentials (simulated)

Since there's no backend, any valid input works:

| Field              | Value                                     |
| ------------------ | ----------------------------------------- |
| Email              | `simtommy@email.com` (or any valid email) |
| Password           | `password123` (or any ≥ 8 chars)          |
| 2FA Code           | `12345` (any 5 digits)                    |
| Authorize Password | `anything` (any non-empty string)         |

---

## 6. Log Out

Click **Log Out** in the sidebar bottom → returns to `/sign-in`.

---

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **react-hook-form** + **zod** validation
- **Montserrat** font throughout
