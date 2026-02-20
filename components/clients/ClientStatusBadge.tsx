import { Badge } from "@/components/ui/badge";

export type ClientStatus = "Active" | "Dormant";

export type SalesStage =
  | "Closed"
  | "Payment"
  | "Negotiation"
  | "Inspection"
  | "Interested";

export function ClientStatusBadge({ status }: { status: string }) {
  const styleMap: Record<string, { bg: string; text: string }> = {
    active: { bg: "#ddf6e2", text: "#34c759" },
    dormant: { bg: "#f6e9dd", text: "#ff8d28" },
    suspended: { bg: "#fff3e0", text: "#f5a623" },
  };
  const style = styleMap[status?.toLowerCase()] ?? {
    bg: "#e0e0e0",
    text: "#6f6d6d",
  };
  const displayStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Unknown";
  return (
    <Badge
      className="rounded-lg border-0 px-1 py-0.5 font-montserrat text-[9px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {displayStatus}
    </Badge>
  );
}
