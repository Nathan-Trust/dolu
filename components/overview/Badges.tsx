import { Badge } from "@/components/ui/badge";

export function StatusBadge({ label }: { label: string }) {
  const styleMap: Record<string, { bg: string; text: string }> = {
    "Pending Review": { bg: "#f6e9dd", text: "#ff8d28" },
    Approved: { bg: "#ddf6e2", text: "#34c759" },
    Rejected: { bg: "#f6dddd", text: "#ff383c" },
  };
  const style = styleMap[label] || styleMap["Pending Review"];
  return (
    <Badge
      className="rounded-lg border-0 px-1 py-0.5 font-montserrat text-[9px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {label}
    </Badge>
  );
}

export function PriorityBadge({ label }: { label: string }) {
  const styleMap: Record<string, { bg: string; text: string }> = {
    High: { bg: "#f6dddd", text: "#ff383c" },
    Medium: { bg: "#f6e9dd", text: "#ff8d28" },
    Low: { bg: "#ddf6e2", text: "#34c759" },
  };
  const style = styleMap[label] || styleMap["High"];
  return (
    <Badge
      className="rounded-lg border-0 px-1 py-0.5 font-montserrat text-[9px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {label}
    </Badge>
  );
}
