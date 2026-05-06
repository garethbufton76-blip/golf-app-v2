export function Logo({
  team,
  size = "h-24 w-24",
  small = false,
  src = "",
  letterClass = "",
  bare = false,
}: any) {
  const t = TEAM[team] || TEAM.red;

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cx(
          "object-contain",
          size,
          bare ? "" : "drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] scale-110"
        )}
      />
    );
  }

  return (
    <div
      className={cx(
        "relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden",
        size
      )}
    >
      <div
        className={cx(
          "absolute inset-0 rounded-full bg-gradient-to-br",
          t.grad
        )}
      />

      <div
        className={cx(
          "font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fff4c8] via-[#d1c79f] to-[#8f8256]",
          letterClass || (small ? "text-[18px]" : "text-[58px]")
        )}
      >
        {t.label}
      </div>
    </div>
  );
}
