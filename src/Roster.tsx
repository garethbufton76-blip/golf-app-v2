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

  function reorder(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= list.length) return;

    const fullRoster = [...roster[team]];
    const visibleRoster = fullRoster.slice(0, players);
    const hiddenRoster = fullRoster.slice(players);

    const [moved] = visibleRoster.splice(fromIndex, 1);
    visibleRoster.splice(toIndex, 0, moved);

    setRoster((current: any) => ({
      ...current,
      [team]: rosterMeta([...visibleRoster, ...hiddenRoster]),
    }));
  }

  function movePlayer(toIndex: number) {
    if (draggedIndex === null || draggedIndex === toIndex) return;
    reorder(draggedIndex, toIndex);
    setDraggedIndex(null);
  }

  const pairs = Array.from({ length: Math.ceil(list.length / 2) }, (_, i) =>
    list.slice(i * 2, i * 2 + 2)
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

        <div className="grid grid-cols-3 gap-2">
          {pairs.map((pair: any[], i: number) => (
            <div
              key={i}
              className="min-h-[92px] rounded-[18px] border border-[#d1c79f]/20 bg-black/35 p-3"
            >
              <div className="mb-2 text-[8px] tracking-[0.16em] text-white/40">
                PAIR {i + 1}
              </div>

              <div className="truncate text-[12px] font-black leading-tight">
                {first(pair[0]?.name || "-")}
              </div>

              <div className="mt-1 truncate text-[12px] leading-tight text-white/65">
                {first(pair[1]?.name || "-")}
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
            className={`rounded-full border border-[#d1c79f]/20 bg-black/45 px-3 py-3 backdrop-blur-xl transition-all ${
              draggedIndex === i ? "scale-[0.98] opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Logo
                team={team === "Red" ? "red" : "blue"}
                size="h-14 w-14"
                src={p.photo || teamLogos[team]}
              />

              <div className="min-w-0 flex-1">
                <div className="text-[9px] tracking-[0.18em] text-white/40">
                  SLOT {i + 1}
                </div>

                <div className="truncate text-[18px] font-bold leading-tight">
                  {first(p.name)}
                </div>
              </div>

              <div className="rounded-full border border-[#d1c79f]/25 bg-black/35 px-3 py-2 text-center">
                <div className="text-[8px] tracking-[0.12em] text-white/40">
                  HCP
                </div>

                <div className="text-[17px] font-bold">
                  {p.handicap}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => reorder(i, i - 1)}
                  disabled={i === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d1c79f]/35 bg-[#d1c79f]/15 text-[#d1c79f] disabled:opacity-20"
                >
                  ▲
                </button>

                <button
                  onClick={() => reorder(i, i + 1)}
                  disabled={i === list.length - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d1c79f]/35 bg-[#d1c79f]/15 text-[#d1c79f] disabled:opacity-20"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
