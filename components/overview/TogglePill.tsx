"use client";

export function TogglePill({
  options,
  activeIndex,
  onToggle,
}: {
  options: string[];
  activeIndex: number;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#e0e0e0]">
      {options.map((option, idx) => (
        <button
          key={option}
          onClick={() => onToggle(idx)}
          className={`rounded-lg px-1 py-0.5 font-montserrat text-xs transition-colors ${
            idx === activeIndex
              ? "bg-[#e0e0e0] font-bold text-[#0f0f0f]"
              : "font-normal text-[#c8c8c8]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
