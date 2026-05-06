import { compressImage } from "./storage";

export default function Admin({ state, setState, setScreen }: any) {
  function uploadLogo(team: "Red" | "Blue", file: File) {
    compressImage(file, (data) => {
      setState({
        ...state,
        teamLogos: {
          ...state.teamLogos,
          [team]: data,
        },
      });
    });
  }

  return (
    <div className="min-h-[100svh] bg-black p-4 text-white">
      <div className="mx-auto max-w-[430px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-xl font-black tracking-[0.15em] text-[#d1c79f]">
            ADMIN
          </div>

          <button onClick={() => setScreen("home")}>
            Back
          </button>
        </div>

        <div className="space-y-6">
          {(["Red", "Blue"] as const).map((team) => (
            <div
              key={team}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-4 text-lg font-bold">
                {team} Team
              </div>

              <input
                value={state.teamNames[team]}
                onChange={(e) =>
                  setState({
                    ...state,
                    teamNames: {
                      ...state.teamNames,
                      [team]: e.target.value,
                    },
                  })
                }
                className="mb-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadLogo(team, file);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
