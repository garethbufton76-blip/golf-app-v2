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
      <div className="relative h-[78px] overflow-hidden rounded-t-[28px] border border-[#d1c79f]/18 bg-black/86 shadow-[0_-18px_42px_rgba(0,0,0,0.68)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5b0f18]/62 via-[#111318]/82 to-[#10233e]/68" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_42%)]" />

        <div className="relative grid h-full grid-cols-3">
          <NavButton
            label="Live"
            icon="▦"
            active={activeTab === "live"}
            onClick={() => setActiveTab("live")}
          />

          <button
            type="button"
            onClick={() => setActiveTab("score")}
            className={cx(
              "relative flex flex-col items-center justify-center gap-1 border-x border-white/10 text-white transition-all active:scale-[0.98]",
              activeTab === "score" && "bg-white/[0.08]"
            )}
          >
            <div
              className={cx(
                "flex h-[34px] w-[34px] items-center justify-center rounded-full border font-black leading-none",
                activeTab === "score"
                  ? "border-[#efe6bf] bg-[#d1c79f] text-black"
                  : "border-white/30 bg-white/10 text-white"
              )}
            >
              <span className="text-[28px] leading-none">+</span>
            </div>

            <div className="text-[10px] font-black uppercase tracking-[0.18em]">
              Score
            </div>
          </button>

          <NavButton
            label="Team"
            icon="○"
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
        "relative flex flex-col items-center justify-center gap-1 text-white transition-all active:scale-[0.98]",
        active && "bg-white/[0.06]"
      )}
    >
      <div
        className={cx(
          "text-[24px] leading-none",
          active ? "text-[#efe6bf]" : "text-white/70"
        )}
      >
        {icon}
      </div>

      <div
        className={cx(
          "text-[10px] font-black uppercase tracking-[0.18em]",
          active ? "text-[#efe6bf]" : "text-white/70"
        )}
      >
        {label}
      </div>
    </button>
  );
}
