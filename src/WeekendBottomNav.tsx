import { cx } from "./data";
import { useDuelTheme } from "./useDuelTheme";

export type WeekendTab = "live" | "stats" | "score" | "teams" | "admin";

export type WeekendRole =
  | "admin"
  | "captain"
  | "groupScorer"
  | "player"
  | "spectator";

const NAV_ITEMS: {
  id: WeekendTab;
  label: string;
  icon: string;
  roles: WeekendRole[];
}[] = [
  {
    id: "live",
    label: "Live",
    icon: "▦",
    roles: ["admin", "captain", "groupScorer", "player", "spectator"],
  },
  {
    id: "stats",
    label: "Stats",
    icon: "◷",
    roles: ["admin", "captain", "groupScorer", "player", "spectator"],
  },
  {
    id: "score",
    label: "Score",
    icon: "+",
    roles: ["admin", "captain", "groupScorer", "player"],
  },
  {
    id: "teams",
    label: "Teams",
    icon: "○",
    roles: ["admin", "captain", "groupScorer", "player", "spectator"],
  },
  {
    id: "admin",
    label: "Admin",
    icon: "⚙",
    roles: ["admin", "captain"],
  },
];

export default function WeekendBottomNav({
  activeTab,
  setActiveTab,
  role = "spectator",
}: {
  activeTab: WeekendTab;
  setActiveTab: (tab: WeekendTab) => void;
  role?: WeekendRole;
}) {
  const { themeMode } = useDuelTheme();
  const isDayTheme = themeMode === "day";

  const visibleTabs = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <div
      className={cx(
        "fixed bottom-0 left-0 right-0 z-50 border-t px-2 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 backdrop-blur-2xl",
        isDayTheme
          ? "border-black/10 bg-[rgba(248,245,236,0.88)]"
          : "border-white/10 bg-[rgba(8,10,16,0.88)]"
      )}
    >
      <div
        className="mx-auto grid max-w-[520px] gap-2"
        style={{
          gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))`,
        }}
      >
        {visibleTabs.map((item) => {
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cx(
                "flex flex-col items-center justify-center rounded-2xl px-2 py-2 transition-all duration-200 active:scale-[0.98]",
                active
                  ? "bg-[#d1c79f] text-black shadow-[0_10px_28px_rgba(209,199,159,0.35)]"
                  : isDayTheme
                  ? "text-black/55"
                  : "text-white/55"
              )}
            >
              <div
                className={cx(
                  "flex h-[22px] items-center justify-center font-black leading-none",
                  item.id === "score" ? "text-[25px]" : "text-[21px]",
                  active ? "opacity-100" : "opacity-80"
                )}
              >
                {item.icon}
              </div>

              <div
                className={cx(
                  "mt-1 text-[10px] font-black uppercase tracking-[0.16em]",
                  active ? "opacity-100" : "opacity-75"
                )}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
