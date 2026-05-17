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
      <div className="grid h-[72px] grid-cols-3 overflow-hidden rounded-t-[22px] border-t border-white/15 shadow-[0_-12px_32px_rgba(0,0,0,0.45)]">
        <NavButton
          label="Live"
          icon="☷"
          active={activeTab === "live"}
          onClick={() => setActiveTab("live")}
          className="bg-[#111d3a] text-white"
        />

        <NavButton
          label="Score"
          icon="+"
          active={activeTab === "score"}
          onClick={() => setActiveTab("score")}
          className="bg-white text-black"
          center
        />

        <NavButton
          label="Team"
          icon="◉"
          active={activeTab === "team"}
          onClick={() => setActiveTab("team")}
          className="bg-[#b91f2d] text-white"
        />
      </div>
    </div>
  );
}

function NavButton({
  label,
  icon,
  active,
  onClick,
  className,
  center = false,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  className: string;
  center?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative flex flex-col items-center justify-center gap-1 font-black uppercase transition-all active:scale-[0.98]",
        className,
        active && "brightness-110"
      )}
    >
      <div
        className={cx(
          "flex items-center justify-center rounded-full font-black leading-none",
          center
            ? "h-[30px] w-[30px] bg-[#23395d] text-[24px] text-white"
            : "text-[24px]"
        )}
      >
        {icon}
      </div>

      <div className="text-[11px] tracking-[0.08em]">
        {label}
      </div>

      {active && (
        <div
          className={cx(
            "absolute top-0 h-[3px] w-full",
            center ? "bg-[#23395d]" : "bg-white/75"
          )}
        />
      )}
    </button>
  );
}
