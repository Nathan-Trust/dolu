"use client";

import { cn } from "@/lib/utils"; // Assuming you have a cn utility for class merging

export type TabOption<T extends string> = {
  value: T;
  label: string;
  activeClass?: string;
};

export default function StatusTabs<T extends string>({
  status,
  onChange,
  options,
  className,
}: Readonly<{
  status: T;
  onChange: (s: T) => void;
  options: TabOption<T>[];
  className?: string;
}>) {
  return (
    <div className={cn("border-b", className)}>
      <div className="flex items-center justify-center gap-8 text-sm font-medium pt-2">
        {options.map((option) => (
          <button
            key={option.value}
            className={cn(
              "pb-2 transition-colors hover:text-foreground",
              status === option.value
                ? option.activeClass || "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
