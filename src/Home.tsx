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
  teamNames,
}: any) {
  const count = matchCount(players, dayConfigs[activeDay].format);

  return (
    <>
      <div className="flex justify-center mt-4">
        <img
          src="https://i.ibb.co/23Rs55J9/DUEL-LOGO.png"
          alt="DUEL"
          className="h-20 object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]"
        />
      </div>

      <div className="mt-[108px] grid grid-cols-2 text-center">
        <button onClick={() => setScreen("rosterP")}>
          <Logo
            team="red"
            size="mx-auto h-36 w-36"
            src={teamLogos.Red}
          />

          <div className="mt-2 text-[11px] font-semibold tracking-[0.18em] text-white/75">
            {teamNames.Red}
          </div>

          <div className="text-[140px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d]">
            {totals.official.red}
          </div>
        </button>

        <button onClick={() => setScreen("rosterB")}>
          <Logo
            team="blue"
            size="mx-auto h-36 w-36"
            src={teamLogos.Blue}
          />

          <div className="mt-2 text-[11px] font-semibold tracking-[0.18em] text-white/75">
            {teamNames.Blue}
          </div>

          <div className="text-[140px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d]">
            {totals.official.blue}
          </div>
        </button>
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
        {days > 1 && (
          <div className="mb-2">
            <DayButtons
              dayConfigs={dayConfigs}
              days={days}
              active={activeDay}
              setActive={setActiveDay}
            />
          </div>
        )}

        <div className="text-[9px] tracking-[0.22em] text-white/60">
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
