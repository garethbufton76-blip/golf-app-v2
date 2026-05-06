import { useState } from "react";
import { Logo, panel, first, rosterMeta } from "./data";

export default function Roster({
  team,
  setScreen,
  roster,
  setRoster,
  players,
  teamLogos,
  teamNames,
}: any) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const list = roster[team].slice(0, players);

  function movePlayer(toIndex: number) {
    if (draggedIndex === null || draggedIndex === toIndex) return;

    const fullRoster = [...roster[team]];
    const visibleRoster = fullRoster.slice(0, players);
    const hiddenRoster = fullRoster.slice(players);

    const [moved] = visibleRoster.splice(draggedIndex, 1);
    visibleRoster.splice(toIndex, 0, moved);

    setRoster((current: any) => ({
      ...current,
      [team]: rosterMeta([...visibleRoster, ...hiddenRoster]),
    }));

    setDraggedIndex(null);
  }

  const pairs = Array.from(
    { length: Math.ceil(list.length / 2) },
    (_, i) => list.slice(i * 2, i * 2 + 2)
  );

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

      <div className={`${panel} mt-3 p-3`}>
        <div className="mb-2 text-[10px] tracking-[0.22em] text-white/50">
          PAIRING PREVIEW
        </div>

        <div className="grid grid-cols-2 gap-2">
          {pairs.map((pair: any[], i: number) => (
            <div
              key={i}
              className="rounded-[18px] border border-[#d1c79f]/20 bg-black/35 p-3"
            >
              <div className="mb-1 text-[9px] tracking-[0.18em] text-white/45">
                PAIR {i + 1}
              </div>

              <div className="truncate text-sm font-bold">
                {pair[0]?.name || "-"}
              </div>

              <div className="truncate text-sm text-white/70">
                {pair[1]?.name || "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3 overflow-y-auto pb-24">
        {list.map((p: any, i: number) => (
          <div
            key={`${p.name}-${i}`}
            draggable
            onDragStart={() => setDraggedIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => movePlayer(i)}
            onDragEnd={() => setDraggedIndex(null)}
            className={`${panel} p-3 transition-all ${
              draggedIndex === i ? "scale-[0.98] opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Logo
                team={team === "Red" ? "red" : "blue"}
                size="h-16 w-16"
                src={p.photo || teamLogos[team]}
              />

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full border border-[#d1c79f]/25 px-2 py-0.5 text-[9px] tracking-[0.14em] text-white/50">
                    DRAG
                  </span>

                  <span className="text-[10px] tracking-[0.16em] text-white/45">
                    SLOT {i + 1}
                  </span>
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
