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
      <div className="relative h-[96px] border-t border-black/10 bg-white">
        {/* CENTER SCORE BUTTON */}
        <button
          type="button"
          onClick={() => setActiveTab("score")}
          className="absolute left-1/2 top-0 z-20 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-8 items-center justify-center rounded-full shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all active:scale-95"
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-[#23452f] bg-gradient-to-br from-[#1f5f3d] via-[#0f3d27] to-[#061811]">
            {/* soft glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_45%)]" />

            {/* logo text */}
            <div className="relative flex flex-col items-center justify-center">
              <div
                className="text-[32px] font-black italic leading-none text-white"
                style={{
                  fontFamily: "cursive",
                }}
              >
                Duel
              </div>

              <div className="mt-1 text-[9px] font-black uppercase tracking-[0.22em] text-white/80">
                Score
              </div>
            </div>
          </div>
        </button>

        {/* NAV ITEMS */}
        <div className="flex h-full items-center justify-between px-10 pt-2">
          <NavButton
            label="Live"
            icon="▦"
            active={activeTab === "live"}
            onClick={() => setActiveTab("live")}
          />

          <div className="w-[90px]" />

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
        "flex w-[90px] flex-col items-center justify-center gap-1 transition-all active:scale-95",
        active ? "text-black" : "text-black/45"
      )}
    >
      <div className="text-[24px] leading-none">{icon}</div>

      <div className="text-[11px] font-black uppercase tracking-[0.18em]">
        {label}
      </div>
    </button>
  );
}
