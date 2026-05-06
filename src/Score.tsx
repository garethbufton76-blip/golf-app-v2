import { gold, holesByTee } from "./data";

export default function Score({
  state,
  setState,
  setScreen,
}: any) {
  const holes = state.holes;

  const nextHole =
    holes.find((h: any) => h.status === "pending")?.hole || 18;

  function setHole(hole: number, status: string) {
    setState({
      ...state,
      holes: holes.map((h: any) =>
        h.hole === hole ? { ...h, status } : h
      ),
    });
  }

  return (
    <div className="min-h-[100svh] bg-black p-3 text-white">
      <div className="mx-auto max-w-[430px]">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => setScreen("home")}>
            Back
          </button>

          <div className="text-sm tracking-[0.2em] text-[#d1c79f]">
            LIVE MATCH
          </div>

          <button onClick={() => setScreen("admin")}>
            Admin
          </button>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <TopTeam
              team={state.teamNames.Red}
              logo={state.teamLogos.Red}
              onClick={() => setScreen("rosterRed")}
            />

            <div className="text-[#d1c79f]">VS</div>

            <TopTeam
              team={state.teamNames.Blue}
              logo={state.teamLogos.Blue}
              onClick={() => setScreen("rosterBlue")}
            />
          </div>

          <div className="mt-5 text-center">
            <div className="text-xs tracking-[0.2em] text-white/50">
              {state.day.format}
            </div>

            <div className="mt-1 text-[#d1c79f]">
              ALL SQUARE
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-2">
          {holes.map((h: any) => {
            const hole = holesByTee[h.hole][state.day.tee];
            const active = h.hole === nextHole;

            return (
              <button
                key={h.hole}
                onClick={() =>
                  setHole(
                    h.hole,
                    h.status === "red"
                      ? "blue"
                      : h.status === "blue"
                      ? "halve"
                      : h.status === "halve"
                      ? "pending"
                      : "red"
                  )
                }
                style={
                  active
                    ? {
                        border: `2px solid ${gold}`,
                        boxShadow: `0 0 18px ${gold}`,
                      }
                    : undefined
                }
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2"
              >
                {active && (
                  <div className="absolute right-1 top-1 rounded-full bg-[#d1c79f] px-1.5 py-[1px] text-[9px] font-black text-black">
                    NOW
                  </div>
                )}

                <div className="text-lg font-black">
                  {h.hole}
                </div>

                <div className="mt-1 text-[10px] text-white/40">
                  PAR {hole.par}
                </div>

                <div className="text-[10px] text-white/40">
                  SI {hole.si}
                </div>

                <div className="mt-2 text-xs font-bold">
                  {h.status === "red" && "RED"}
                  {h.status === "blue" && "BLUE"}
                  {h.status === "halve" && "AS"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TopTeam({ team, logo, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-[38%] flex-col items-center"
    >
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/40">
        {logo ? (
          <img src={logo} className="h-full w-full object-cover" />
        ) : (
          <div className="text-2xl font-black">
            {team[0]}
          </div>
        )}
      </div>

      <div className="mt-2 text-xs font-bold tracking-[0.12em]">
        {team}
      </div>
    </button>
  );
}
