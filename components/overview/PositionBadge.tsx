export function PositionBadge({ position }: { position: number }) {
  const baseClass =
    "flex size-6 items-center justify-center rounded-full font-montserrat text-sm text-[#0f0f0f]";

  if (position === 1) {
    return (
      <div
        className={baseClass}
        style={{
          background:
            "radial-gradient(circle at 77%, #fc0, #bb9600 41%, #b18f06 71%, #997a00)",
        }}
      >
        {position}
      </div>
    );
  }
  if (position === 2) {
    return (
      <div
        className={baseClass}
        style={{
          background:
            "radial-gradient(circle at 77%, #989897, #bdbdbd 41%, #8a8a8a 56%, #707070 64%, #575757 71%, #383735 86%, #282723 93%, #191712)",
        }}
      >
        {position}
      </div>
    );
  }
  if (position === 3) {
    return (
      <div
        className={baseClass}
        style={{
          background:
            "radial-gradient(circle at 77%, #584b34, #6c5a1c 21%, #766110 31%, #816804 41%, #564502 71%, #776001 86%, #997a00)",
        }}
      >
        {position}
      </div>
    );
  }
  return <div className={baseClass}>{position}</div>;
}
