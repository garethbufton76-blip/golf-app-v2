import {
  Logo,
  MatchButtons,
  panel,
  Button,
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
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))`,
      }}
    >
      {shown.map((d: any, i: number) => (
        <Button
          key={d.label}
          active={i === active}
          onClick={() => setActive(i)}
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
}: any) {
  const count = matchCount(players, dayConfigs[activeDay].format);

  return (
    <>
      <div className="flex justify-center mt-2">
        <img
          src="/launch-logo.png"
          alt="DUEL"
          className="h-[34px] w-auto object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.75)]"
        />
      </div>

      <div className="mt-[92px] grid grid-cols-2 text-center">
        {["red", "blue"].map((team: any) => (
          <button
            key={team}
            onClick={() =>
              setScreen(team === "red" ? "rosterP" : "rosterB")
            }
          >
            <div className="mx-auto w-fit drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)]">
              <Logo
                team={team}
                size="mx-auto h-28 w-28"
                src={teamLogos[team === "red" ? "Red" : "Blue"]}
              />
            </div>

            <div
              className="mt-8 text-[104px] font-black leading-none tracking-[-0.08em] text-white drop-shadow-[0_14px_18px_rgba(0,0,0,0.85)]"
              style={{
                fontFamily:
                  'Impact, "Arial Black", "Helvetica Neue Condensed Black", sans-serif',
                WebkitTextStroke: "1px rgba(255,255,255,0.12)",
              }}
            >
              {formatScore(totals.official[team])}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-1 flex justify-center">
        <div className="inline-flex items-center gap-4 rounded-full border border-[#d1c79f]/20 bg-black/60 px-5 py-2.5 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.65)]">
          <b className="text-[22px]">{formatScore(totals.live.red)}</b>

          <span className="text-[11px] tracking-[0.24em] text-[#d1c79f]">
            LIVE
          </span>

          <b className="text-[22px]">{formatScore(totals.live.blue)}</b>
        </div>
      </div>

      <div
        className={`${panel} absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-30 p-3`}
      >
        <DayButtons
          dayConfigs={dayConfigs}
          days={days}
          active={activeDay}
          setActive={setActiveDay}
        />

        <div className="mt-2 text-[9px] tracking-[0.22em] text-white/60">
          MATCHES
        </div>

        <div className="mt-1.5">
          <MatchButtons count={count} setActive={openMatch} />
        </div>
      </div>
    </>
  );
}
