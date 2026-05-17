import { BarChart3, Users, Plus } from "lucide-react";
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
    <div className="absolute bottom-[max(14px,env(safe-area-inset-bottom))] left-4 right-4 z-50">
      <div className="relative grid grid-cols-3 items-center rounded-[28px] border border-[#d1c79f]/22 bg-black/78 px-3 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.75)] backdrop-blur-xl">
        <NavButton
          label="Live"
          icon={<BarChart3 size={22} />}
          active={activeTab === "live"}
          onClick={() => setActiveTab("live")}
        />

        <button
          type="button"
          onClick={() => setActiveTab("score")}
          className={cx(
            "mx-auto flex h-[74px] w-[74px] -translate-y-7 flex-col items-center justify-center rounded-full border font-black uppercase shadow-[0_18px_38px_rgba(0,0,0,0.65)] transition-all active:scale-95",
            activeTab === "score"
              ? "border-[#efe6bf] bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#9f925f] text-black"
              : "border-[#d1c79f]/35 bg-gradient-to-b from-[#245438] via-[#163d2b] to-[#071b13] text-[#efe6bf]"
          )}
        >
          <Plus size={28} strokeWidth={3} />
          <span className="mt-0.5 text-[9px] tracking-[0.14em]">Score</span>
        </button>

        <NavButton
          label="Team"
          icon={<Users size={22} />}
          active={activeTab === "team"}
          onClick={() => setActiveTab("team")}
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
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all active:scale-95",
        active
          ? "bg-[#d1c79f]/12 text-[#efe6bf]"
          : "text-white/55 hover:text-white"
      )}
    >
      <div>{icon}</div>
      <div>{label}</div>
    </button>
  );
}
