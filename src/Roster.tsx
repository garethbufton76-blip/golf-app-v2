import {
  TEAM,
  Logo,
  panel,
  first,
} from "./data";

export default function Roster({
  team,
  setScreen,
  roster,
  players,
  teamLogos,
  teamNames,
}: any) {
  const list = roster[team].slice(0, players);

  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm font-semibold tracking-[0.18em] text-white/75">
          {teamNames[team]}
        </div>

        <button
          onClick={() => setScreen("home")}
          className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold"
        >
          Back
        </button>
      </div>

      <div className="mt-4 space-y-3 overflow-y-auto pb-24">
        {list.map((p: any, i: number) => (
          <div
            key={i}
            className={`${panel} p-3`}
          >
            <div className="flex items-center gap-3">
              <Logo
                team={team === "Red" ? "red" : "blue"}
                size="h-16 w-16"
                src={p.photo || teamLogos[team]}
              />

              <div className="min-w-0 flex-1">
                <div className="text-[10px] tracking-[0.16em] text-white/50">
                  SLOT {i + 1}
                </div>

                <div className="truncate text-[18px] font-semibold">
                  {first(p.name)}
                </div>
              </div>

              <div className="rounded-[18px] border border-[#d1c79f]/25 bg-black/35 px-3 py-3 text-center">
                <div className="text-[10px] text-white/50">
                  HCP
                </div>

                <div className="text-[18px]">
                  {p.handicap}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
