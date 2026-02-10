import { Badge } from "@/components/ui/badge";

type PersonStatus = "Active" | "Dormant";
type PerformanceLevel = "Excellent" | "Satisfactory" | "Unsatisfactory";

export function PersonStatusBadge({ status }: { status: PersonStatus }) {
  const styleMap: Record<PersonStatus, { bg: string; text: string }> = {
    Active: { bg: "#ddf6e2", text: "#34c759" },
    Dormant: { bg: "#f6e9dd", text: "#ff8d28" },
  };
  const style = styleMap[status];
  return (
    <Badge
      className="rounded-lg border-0 px-1 py-0.5 font-montserrat text-[9px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {status}
    </Badge>
  );
}

export function PerformanceBadge({ level }: { level: PerformanceLevel }) {
  const colorMap: Record<PerformanceLevel, string> = {
    Excellent: "#34c759",
    Satisfactory: "#ff8d28",
    Unsatisfactory: "#ff383c",
  };
  return (
    <span
      className="font-montserrat text-sm font-normal"
      style={{ color: colorMap[level] ?? "#0f0f0f" }}
    >
      {level}
    </span>
  );
}

export type { PersonStatus, PerformanceLevel };
