import { Badge } from "@/components/ui/badge";

export type UnitStatus = "Available" | "Reserved" | "Sold";

const statusConfig: Record<
  UnitStatus,
  { bg: string; text: string; label: string }
> = {
  Available: {
    bg: "#ddf6e2",
    text: "#34c759",
    label: "Available",
  },
  Reserved: {
    bg: "#f6e9dd",
    text: "#ff8d28",
    label: "Reserved",
  },
  Sold: {
    bg: "#e0e0e0",
    text: "#6f6d6d",
    label: "Sold",
  },
};

export function UnitStatusBadge({ status }: { status: UnitStatus }) {
  const config = statusConfig[status];
  return (
    <Badge
      className="rounded-lg border border-transparent px-1 py-0.5 font-montserrat text-[9px] font-semibold"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </Badge>
  );
}
