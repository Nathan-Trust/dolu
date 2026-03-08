"use client";

import { type UserRole } from "@/util/status";
import ReportsPageView from "@/components/reports/ReportsPageView";

interface ReportsClientProps {
  role: UserRole;
}

export default function ReportsClient({ role }: ReportsClientProps) {
  return <ReportsPageView role={role} />;
}
