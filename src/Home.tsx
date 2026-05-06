import {
  Logo,
  panel,
  gold,
} from "./data";

export default function Home({
  setScreen,
  dayConfigs,
  activeDay,
  totals,
  openMatch,
  teamLogos,
  teamNames,
}: any) {
  const count = 1;

  return (
    <>
      <div className="flex justify-center mt-4">
        <img
          src="https://i.ibb.co/23Rs55J9/DUEL-LOGO.png"
          className="h-20 object-contain opacity-95"
        />
      </div>

      <div className="mt-[110px] grid grid-cols-2 text-center">
        <button onClick={() => setScreen("rosterP")}>
          <Logo
            team="red"
            size="mx-auto h-36 w-36"
            src={teamLogos.Red}
          />

          <div className="mt-2 text-[11px] tracking-[0.18em] text-white/75">
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

          <div className="mt-2 text-[11px] tracking-[0.18em] text-white/75">
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
        <button
          onClick={() => openMatch(0)}
          className={`${gold} w-full rounded-2xl py-4 text-lg font-black`}
        >
          START MATCH
        </button>
      </div>
    </>
  );
}
