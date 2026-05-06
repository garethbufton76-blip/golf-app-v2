export default function Roster({ team, state, setScreen }: any) {
  const players = state.roster[team];

  return (
    <div className="min-h-[100svh] bg-black p-4 text-white">
      <div className="mx-auto max-w-[430px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-xl font-black tracking-[0.15em] text-[#d1c79f]">
            {team.toUpperCase()} ROSTER
          </div>

          <button onClick={() => setScreen("score")}>
            Back
          </button>
        </div>

        <div className="space-y-3">
          {players.map((p: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-white/50">
                  Handicap {p.handicap}
                </div>
              </div>

              <div className="text-[#d1c79f]">
                #{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
