import { cx } from "./data";
import { useDuelTheme } from "./useDuelTheme";

export type AdminHeaderTab =
  | "day"
  | "teams"
  | "hcps"
  | "pairings"
  | "scorers";

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
    id: "hcps",
    label: "HCPS",
    icon: "±",
  },
  {
    id: "pairings",
    label: "Pairings",
    icon: "⇄",
  },
  {
    id: "scorers",
    label: "Scorers",
    icon: "⚑",
  },
];

function AdminHeaderNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: AdminHeaderTab;
  setActiveTab: (tab: AdminHeaderTab) => void;
}) {
  const { themeMode } = useDuelTheme();
  const isDayTheme = themeMode === "day";

  return (
    <div
      className={cx(
        "absolute left-1/2 top-[-16px] z-50 h-[128px] w-[390px] max-w-none -translate-x-1/2 border-b px-2 pb-2 pt-[max(env(safe-area-inset-top),10px)] backdrop-blur-2xl",
        isDayTheme
          ? "border-black/10 bg-[rgba(248,245,236,0.92)]"
          : "border-white/10 bg-[rgba(8,10,16,0.94)]"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-[42px] shrink-0 items-center justify-center">
          <img
            src="/launch-logo.png"
            alt="DUEL"
            className={cx(
              "h-8 object-contain opacity-95",
              isDayTheme ? "brightness-0" : "brightness-0 invert"
            )}
          />
        </div>

        <div className="grid flex-1 grid-cols-5 gap-2">
          {ADMIN_TABS.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cx(
                  "flex flex-col items-center justify-center rounded-2xl px-1.5 py-2 transition-all duration-200 active:scale-[0.98]",
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
                    tab.id === "pairings" ? "text-[22px]" : "text-[20px]",
                    active ? "opacity-100" : "opacity-80"
                  )}
                >
                  {tab.icon}
                </div>

                <div
                  className={cx(
                    "mt-1 text-[8.5px] font-black uppercase tracking-[0.1em]",
                    active ? "opacity-100" : "opacity-75"
                  )}
                >
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { AdminHeaderNav };
export default AdminHeaderNav;
