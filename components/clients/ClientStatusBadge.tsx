import { Badge } from "@/components/ui/badge";

export type ClientStatus = "Active" | "Dormant";

export type SalesStage =
  | "Closed"
  | "Payment"
  | "Negotiation"
  | "Inspection"
  | "Interested";

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const styleMap: Record<ClientStatus, { bg: string; text: string }> = {
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
