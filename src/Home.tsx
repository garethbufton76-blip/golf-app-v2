export default function Home({ state, setScreen }: any) {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-black">
      <img
        src="https://i.ibb.co/B5MCPFwV/hf-20260406-212338-4e6f71fe-a63d-4837-9341-31237b0552c3.png"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-4 pb-6 pt-8">
        <div className="text-center">
          <div className="tracking-[0.55em] text-[12px] text-[#d1c79f]">
            ST MICHAELS
          </div>

          <div className="mt-4 text-[64px] font-black leading-none tracking-[0.18em] text-[#d1c79f]">
            DUEL
          </div>

          <div className="mt-2 text-sm text-white/60">
            Match Play Scoring Engine
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <TeamCard
              side="red"
              team={state.teamNames.Red}
              logo={state.teamLogos.Red}
              score={0}
            />

            <div className="text-[#d1c79f]">VS</div>

            <TeamCard
              side="blue"
              team={state.teamNames.Blue}
              logo={state.teamLogos.Blue}
              score={0}
            />
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button
            onClick={() => setScreen("score")}
            className="w-full rounded-2xl bg-[#d1c79f] py-4 text-lg font-black text-black"
          >
            START MATCH
          </button>

          <button
            onClick={() => setScreen("admin")}
            className="w-full rounded-2xl border border-white/15 bg-white/5 py-4 text-sm tracking-[0.2em] text-white/70"
          >
            ADMIN
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ side, team, logo, score }: any) {
  return (
    <div className="flex w-[42%] flex-col items-center">
      <div
        className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 ${
          side === "red" ? "border-[#8b1f2d]" : "border-[#214aa8]"
        } bg-black/40`}
      >
        {logo ? (
          <img src={logo} className="h-full w-full object-cover" />
        ) : (
          <div className="text-3xl font-black text-white">
            {team[0]}
          </div>
        )}
      </div>

      <div className="mt-3 text-center text-sm font-bold tracking-[0.15em]">
        {team}
      </div>

      <div className="mt-2 text-3xl font-black text-[#d1c79f]">
        {score}
      </div>
    </div>
  );
}
