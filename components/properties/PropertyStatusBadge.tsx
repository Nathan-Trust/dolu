import { Badge } from "@/components/ui/badge";

export type PropertyStatus = "Available" | "Selling Fast" | "Sold Out";

const statusConfig: Record<
  PropertyStatus,
  { bg: string; text: string; border?: string; label: string }
> = {
  Available: {
    bg: "#ddf6e2",
    text: "#34c759",
    label: "Available",
  },
  "Selling Fast": {
    bg: "#f6e9dd",
    text: "#ff8d28",
    border: "#ff8d28",
    label: "Selling Fast 🔥",
  },
  "Sold Out": {
    bg: "#f6dddd",
    text: "#ff383c",
    label: "Sold Out",
  },
};

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const config = statusConfig[status];
  return (
    <Badge
      className="rounded-lg border px-1 py-0.5 font-montserrat text-[9px] font-semibold"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border ?? "transparent",
      }}
    >
      {config.label}
    </Badge>
  );
}
