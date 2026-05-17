import {
  Logo,
  Button,
  cx,
  matchCount,
} from "./data";

function DayButtons({
  dayConfigs,
  days,
  active,
  setActive,
}: any) {
  const shown = dayConfigs.slice(0, days);

  if (shown.length <= 1) return null;

  return (
    <div
      className="mb-3 grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))`,
      }}
    >
      {shown.map((d: any, i: number) => (
        <Button
          key={d.label}
          active={i === active}
          onClick={() => setActive(i)}
          className="py-2 text-[10px]"
        >
          {d.label}
        </Button>
      ))}
    </div>
  );
}

function formatScore(value: any) {
  const n = Number(value || 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export default function Home({
  setScreen,
  dayConfigs,
  days,
  players,
  activeDay,
  setActiveDay,
  totals,
  openMatch,
  teamLogos,
  teamNames,
}: any) {
  const day = dayConfigs[activeDay];
  const count = matchCount(players, day.format);

  const matchCards = Array.from({ length: count }, (_, i) => ({
    label: `Match ${i + 1}`,
    status: i === 0 ? "Live now" : "Ready",
    detail: day.format,
    progress: i === 0 ? "14 to play" : "18 to play",
  }));

  return (
    <div className="relative flex-1 overflow-y-auto pb-[96px]">
      <div className="flex justify-center pt-2">
        <img
          src="/launch-logo.png"
          alt="DUEL"
          className="h-[34px] w-auto object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.75)]"
        />
      </div>

      <div className="mt-4 rounded-[28px] border border-white/12 bg-black/48 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
          {day.label} • {day.course || "St Michaels"} • {day.tee} Tee
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <button
            type="button"
            onClick={() => setScreen("rosterP")}
            className="text-center"
          >
            <Logo
              team="red"
              size="mx-auto h-20 w-20"
              src={teamLogos?.Red}
            />

            <div className="mt-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/60">
              {teamNames?.Red || "Team Red"}
            </div>

            <div
              className="mt-2 text-[76px] font-black leading-none tracking-[-0.1em] text-white"
              style={{
                fontFamily: 'Impact, "Arial Narrow", "Arial Black", sans-serif',
                transform: "scaleY(1.12) scaleX(0.86)",
              }}
            >
              {formatScore(totals.official.red)}
            </div>
          </button>

          <div className="flex flex-col items-center justify-center">
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#d1c79f]">
              LIVE
            </div>

            <div className="mt-2 rounded-full border border-[#d1c79f]/20 bg-black/55 px-4 py-2 text-center">
              <span className="text-lg font-black">
                {formatScore(totals.live.red)}
              </span>

              <span className="mx-2 text-white/35">-</span>

              <span className="text-lg font-black">
                {formatScore(totals.live.blue)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setScreen("rosterB")}
            className="text-center"
          >
            <Logo
              team="blue"
              size="mx-auto h-20 w-20"
              src={teamLogos?.Blue}
            />

            <div className="mt-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/60">
              {teamNames?.Blue || "Team Blue"}
            </div>

            <div
              className="mt-2 text-[76px] font-black leading-none tracking-[-0.1em] text-white"
              style={{
                fontFamily: 'Impact, "Arial Narrow", "Arial Black", sans-serif',
                transform: "scaleY(1.12) scaleX(0.86)",
              }}
            >
              {formatScore(totals.official.blue)}
            </div>
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-white/10 bg-black/42 p-4 backdrop-blur-xl">
        <DayButtons
          dayConfigs={dayConfigs}
          days={days}
          active={activeDay}
          setActive={setActiveDay}
        />

        <div className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
          Live Matches
        </div>

        <div className="space-y-3">
          {matchCards.map((match, i) => (
            <button
              key={match.label}
              type="button"
              onClick={() => openMatch(i)}
              className={cx(
                "w-full overflow-hidden rounded-[22px] border p-4 text-left shadow-[0_14px_32px_rgba(0,0,0,0.35)]",
                i % 2 === 0
                  ? "border-red-300/15 bg-gradient-to-r from-[#5b1218]/88 via-[#1a1214]/92 to-[#0c1018]/92"
                  : "border-blue-300/15 bg-gradient-to-r from-[#101522]/92 via-[#14213a]/90 to-[#07101c]/92"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                    {match.label}
                  </div>

                  <div className="mt-1 text-[18px] font-black uppercase tracking-[0.08em] text-white">
                    All Square
                  </div>
                </div>

                <div className="rounded-full border border-[#d1c79f]/20 bg-black/35 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#d1c79f]">
                  {match.status}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.13em] text-white/55">
                <span>{match.detail}</span>
                <span>{match.progress}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
