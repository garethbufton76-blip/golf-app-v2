import { cx } from "./data";

type GameTab = "live" | "score" | "team";

export default function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: GameTab;
  setActiveTab: (tab: GameTab) => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      <div className="relative h-[104px] border-t border-white/15 bg-black/82 backdrop-blur-2xl">
        {/* background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5e0b15]/45 via-[#d1c79f]/10 to-[#0d2a52]/45" />

        {/* nav content */}
        <div className="relative flex h-full items-start justify-between px-10 pt-5">
          <NavButton
            label="Live"
            icon="▦"
            active={activeTab === "live"}
            onClick={() => setActiveTab("live")}
          />

          {/* CENTER SCORE BUTTON */}
          <button
            type="button"
            onClick={() => setActiveTab("score")}
            className={cx(
              "absolute left-1/2 top-0 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-7 flex-col items-center justify-center rounded-full border-2 shadow-[0_18px_40px_rgba(0,0,0,0.6)] transition-all active:scale-95",
              activeTab === "score"
                ? "border-[#efe6bf] bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#9f925f] text-black"
                : "border-[#d1c79f]/35 bg-black text-[#efe6bf]"
            )}
          >
            <span className="text-[34px] font-black leading-none">
              +
            </span>

            <span className="mt-1 text-[11px] font-black uppercase tracking-[0.18em]">
              Score
            </span>
          </button>

          <NavButton
            label="Team"
            icon="◉"
            active={activeTab === "team"}
            onClick={() => setActiveTab("team")}
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "mt-4 flex w-[90px] flex-col items-center justify-center gap-1 transition-all active:scale-95",
        active ? "text-[#efe6bf]" : "text-white/50"
      )}
    >
      <div className="text-[24px] leading-none">{icon}</div>

      <div className="text-[11px] font-black uppercase tracking-[0.18em]">
        {label}
      </div>
    </button>
  );
}
