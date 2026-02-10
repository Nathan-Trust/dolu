export function PersonCell({
  name,
  initials,
  color,
}: {
  name: string;
  initials: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <div
        className="flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
        {name}
      </span>
    </div>
  );
}
