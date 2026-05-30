import { cx } from "./data";

export type AdminHeaderTab = "day" | "teams" | "players" | "pairings";

const ADMIN_TABS: {
  id: AdminHeaderTab;
  label: string;
}[] = [
  {
    id: "day",
    label: "Days",
  },
  {
    id: "teams",
    label: "Teams",
  },
  {
    id: "players",
    label: "Players",
  },
  {
    id: "pairings",
    label: "Pairings",
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
  return (
    <div className="sticky top-0 z-40 -mx-4 mb-3 border-b border-white/10 bg-black/35 px-4 pb-2 pt-1 backdrop-blur-2xl">
      <div className="grid grid-cols-5 gap-1.5">
        {ADMIN_TABS.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                "rounded-2xl border px-2 py-2.5 text-[10px] font-black uppercase tracking-[0.08em] transition-all active:scale-[0.98]",
                active
                  ? "border-[#d1c79f] bg-[#d1c79f] text-black shadow-[0_10px_24px_rgba(209,199,159,0.28)]"
                  : "border-white/12 bg-black/38 text-white/70"
              )}
            >
              {tab.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onHome}
          className="rounded-2xl border border-white/12 bg-black/38 px-2 py-2.5 text-[10px] font-black uppercase tracking-[0.08em] text-white/70 transition-all active:scale-[0.98]"
        >
          Home
        </button>
      </div>
    </div>
  );
}

export { AdminHeaderNav };
export default AdminHeaderNav;

