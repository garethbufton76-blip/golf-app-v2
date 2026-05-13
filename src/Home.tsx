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
          className="h-[34px] w-auto object-contain opacity-95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.65)]"
        />
      </div>

      <div className="mt-[126px] grid grid-cols-2 text-center">
        {["red", "blue"].map((team: any) => (
          <button
            key={team}
            onClick={() =>
              setScreen(team === "red" ? "rosterP" : "rosterB")
            }
          >
            <Logo
              team={team}
              size="mx-auto h-44 w-44"
              src={
                teamLogos[
                  team === "red" ? "Red" : "Blue"
                ]
              }
            />

            <div className="mt-3 text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d]">
              {totals.official[team]}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 flex justify-center">
        <div className="inline-flex items-center gap-4 rounded-full border border-[#d1c79f]/20 bg-black/55 px-4 py-2 backdrop-blur-xl">
          <b>{totals.live.red}</b>

          <span className="text-[11px] tracking-[0.18em] text-white/65">
            LIVE
          </span>

          <b>{totals.live.blue}</b>
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
          <MatchButtons
            count={count}
            setActive={openMatch}
          />
        </div>
      </div>
    </>
  );
}
