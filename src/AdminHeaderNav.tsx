import { cx } from "./data";
import { useDuelTheme } from "./useDuelTheme";

export type AdminHeaderTab = "day" | "teams" | "players" | "pairings";

const ADMIN_TABS: {
  id: AdminHeaderTab;
  label: string;
  icon: string;
}[] = [
  {
    id: "day",
    label: "Days",
    icon: "▦",
  },
  {
    id: "teams",
    label: "Teams",
    icon: "○",
  },
  {
    id: "players",
    label: "Players",
    icon: "◉",
  },
  {
    id: "pairings",
    label: "Pairings",
    icon: "⇄",
  },
];

function AdminHeaderNav({
  activeTab,
  setActiveTab,
  onHome,
}: {
  activeTab: AdminHeaderTab;
  setActiveTab: (tab: AdminHeaderTab) => void;
  onHome: () => void;
}) {
  const { themeMode } = useDuelTheme();
  const isDayTheme = themeMode === "day";

  return (
    <div
      className={cx(
        "absolute left-0 right-0 top-0 z-50 border-b px-2 pb-2 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur-2xl",
        isDayTheme
          ? "border-black/10 bg-[rgba(248,245,236,0.88)]"
          : "border-white/10 bg-[rgba(8,10,16,0.88)]"
      )}
    >
      <div className="mx-auto max-w-[520px]">
        <div className="mb-2 flex items-center justify-center">
          <img
            src="/launch-logo.png"
            alt="DUEL"
            className={cx(
              "h-7 object-contain opacity-95",
              isDayTheme ? "brightness-0" : "brightness-0 invert"
            )}
          />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {ADMIN_TABS.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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
                    tab.id === "pairings" ? "text-[21px]" : "text-[20px]",
                    active ? "opacity-100" : "opacity-80"
                  )}
                >
                  {tab.icon}
                </div>

                <div
                  className={cx(
                    "mt-1 text-[9px] font-black uppercase tracking-[0.13em]",
                    active ? "opacity-100" : "opacity-75"
                  )}
                >
                  {tab.label}
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onHome}
            className={cx(
              "flex flex-col items-center justify-center rounded-2xl px-2 py-2 transition-all duration-200 active:scale-[0.98]",
              isDayTheme ? "text-black/55" : "text-white/55"
            )}
          >
            <div className="flex h-[22px] items-center justify-center text-[20px] font-black leading-none opacity-80">
              ⌂
            </div>

            <div className="mt-1 text-[9px] font-black uppercase tracking-[0.13em] opacity-75">
              Home
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export { AdminHeaderNav };
export default AdminHeaderNav;
