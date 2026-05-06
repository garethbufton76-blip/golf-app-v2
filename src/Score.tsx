import { useState } from "react";
import {
  TEAM,
  Logo,
  MatchButtons,
  first,
  holesByTee,
  keyFor,
  panel,
  playersForMatch,
  shots,
  stableford,
  getResult,
} from "./data";

export default function Score({
  setScreen,
  dayConfigs,
  players,
  activeDay,
  roster,
  states,
  setStates,
  scorecards,
  setScorecards,
  startMatch,
  teamLogos,
  teamNames,
}: any) {
  const day = dayConfigs[activeDay];

  const [activeMatch, setActiveMatch] = useState(startMatch || 0);
  const [selectedHole, setSelectedHole] = useState<any>(null);

  const [draft, setDraft] = useState<any>({
    red: 4,
    blue: 4,
  });

  const [teeShots, setTeeShots] = useState<any>({});

  const stateKey = keyFor(activeDay, activeMatch);

  const holes = states[stateKey] || [];

  const match = playersForMatch(
    roster,
    players,
    day.format,
    activeMatch
  );

  const result = getResult(holes);

  const current = holesByTee[1][day.tee];

  const isAmbrose = /ambrose/i.test(day.format);

  function saveHole() {
    if (!selectedHole) return;

    const redScore = Number(draft.red);
    const blueScore = Number(draft.blue);

    const redNet =
      redScore -
      shots(
        Math.max(
          0,
          Number(match.red[0]?.handicap || 0) -
            Number(match.blue[0]?.handicap || 0)
        ),
        selectedHole.si
      );

    const blueNet =
      blueScore -
      shots(
        Math.max(
          0,
          Number(match.blue[0]?.handicap || 0) -
            Number(match.red[0]?.handicap || 0)
        ),
        selectedHole.si
      );

    const status =
      redNet < blueNet
        ? "red"
        : blueNet < redNet
        ? "blue"
        : "as";

    setStates((s: any) => ({
      ...s,
      [stateKey]: holes.map((h: any) =>
        h.hole === selectedHole.hole
          ? { ...h, status }
          : h
      ),
    }));

    setSelectedHole(null);
  }

  function toggleTeeShot(playerKey: string) {
    setTeeShots((prev: any) => {
      const current = prev[playerKey] || 0;

      return {
        ...prev,
        [playerKey]: current === 1 ? 0 : 1,
      };
    });
  }

  function teeShotTotal(player: any) {
    return teeShots[player.name] || 0;
  }

  function Hole({ h }: any) {
    const detail = holesByTee[h.hole][day.tee];

    const status = h.status;

    const tone =
      status === "red"
        ? "from-[#7c2430]/95 to-[#47151d]/95 border-[#b54854]/40"
        : status === "blue"
        ? "from-[#415aaf]/95 to-[#29386c]/95 border-[#627dd7]/40"
        : status === "as"
        ? "from-[#5c5c5c]/95 to-[#2d2d2d]/95 border-white/15"
        : "from-black/50 to-black/30 border-white/5";

    return (
      <button
        onClick={() => {
          setSelectedHole(detail);

          setDraft({
            red: detail.par,
            blue: detail.par,
          });
        }}
        className={`relative h-[86px] rounded-[18px] border bg-gradient-to-b px-2 py-1 text-center ${tone}`}
      >
        <div className="mt-1 text-[13px] font-medium">
          {h.hole}
        </div>

        <div className="mt-1 text-[9px] text-white/50">
          SI {detail.si}
        </div>
      </button>
    );
  }

  return (
    <>
      <div className="relative flex-1 overflow-y-auto pb-[220px]">
        <div
          className={`${panel} mt-6 rounded-[26px] border border-white/15 p-4`}
        >
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold tracking-[0.22em] text-white/60">
            <div>
              {day.label.toUpperCase()} • ST MICHAELS •{" "}
              {day.tee.toUpperCase()}
            </div>

            <button
              onClick={() => setScreen("home")}
              className="text-sm font-semibold tracking-normal text-white/85"
            >
              Back
            </button>
          </div>

          <div className="mb-2 text-center text-[11px] font-extrabold tracking-[0.32em] text-white/80">
            {day.format.toUpperCase()}
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-start gap-3">
            <TeamPlayers
              team="red"
              players={match.red}
              teamLogos={teamLogos}
            />

            <div className="flex h-[70px] items-center justify-center text-2xl font-bold text-white/75">
              VS
            </div>

            <TeamPlayers
              team="blue"
              players={match.blue}
              teamLogos={teamLogos}
            />
          </div>

          <div className="mt-1 text-center">
            <div className="text-[20px] font-extrabold tracking-[0.08em]">
              {result.main}
            </div>

            <div className="mt-0.5 text-[10px] tracking-[0.16em] text-white/55">
              {result.sub}
            </div>
          </div>
        </div>

        <div
          className={`${panel} relative mt-4 rounded-[26px] border border-white/10 bg-black/45 p-4`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] tracking-[0.22em] text-white/60">
                HOLE TRACKER
              </div>

              <div className="text-[14px] font-bold tracking-[0.16em]">
                Hole {current.hole} • SI {current.si} •{" "}
                {current.metres}m
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2.5">
            {holes.map((h: any) => (
              <Hole key={h.hole} h={h} />
            ))}
          </div>

          {selectedHole && (
            <div className="absolute inset-0 z-30">
              <div className="h-full rounded-[26px] border border-[#d1c79f]/25 bg-black/95 p-4 backdrop-blur-xl">
                <div className="mb-3 flex justify-between">
                  <div>
                    <div className="text-[11px] tracking-[0.28em] text-white/60">
                      SCORE HOLE
                    </div>

                    <div className="mt-2 text-[14px] font-bold tracking-[0.16em]">
                      Hole {selectedHole.hole} • Par{" "}
                      {selectedHole.par} • SI{" "}
                      {selectedHole.si}
                    </div>
                  </div>

                  <button
                    onClick={saveHole}
                    className="rounded-full border border-[#d1c79f]/40 bg-[#d1c79f]/15 px-4 py-2 text-sm font-semibold text-[#efe6bf]"
                  >
                    Save
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ScoreBox
                    team="red"
                    players={match.red}
                    score={draft.red}
                    setScore={(v: number) =>
                      setDraft((d: any) => ({
                        ...d,
                        red: v,
                      }))
                    }
                    par={selectedHole.par}
                  />

                  <ScoreBox
                    team="blue"
                    players={match.blue}
                    score={draft.blue}
                    setScore={(v: number) =>
                      setDraft((d: any) => ({
                        ...d,
                        blue: v,
                      }))
                    }
                    par={selectedHole.par}
                  />
                </div>

                {isAmbrose && (
                  <div className="mt-8 rounded-[28px] border border-white/10 bg-black/45 p-4">
                    <div className="mb-4 text-center text-[11px] font-bold tracking-[0.28em] text-white/45">
                      TEE SHOT USED
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* RED TEAM ALWAYS LEFT */}
                      <div className="space-y-3">
                        {match.red.map((p: any) => {
                          const active =
                            teeShotTotal(p) === 1;

                          return (
                            <button
                              key={p.name}
                              onClick={() =>
                                toggleTeeShot(p.name)
                              }
                              className={`h-[68px] w-full rounded-[22px] border text-center transition-all ${
                                active
                                  ? "border-[#ff9a9a] bg-[#b51d23] shadow-[0_0_24px_rgba(255,80,80,0.45)]"
                                  : "border-[#7c2430]/40 bg-[#3f0709]"
                              }`}
                            >
                              <div className="text-[15px] font-bold">
                                {first(p.name)} •{" "}
                                {teeShotTotal(p)}/6
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* BLUE TEAM ALWAYS RIGHT */}
                      <div className="space-y-3">
                        {match.blue.map((p: any) => {
                          const active =
                            teeShotTotal(p) === 1;

                          return (
                            <button
                              key={p.name}
                              onClick={() =>
                                toggleTeeShot(p.name)
                              }
                              className={`h-[68px] w-full rounded-[22px] border text-center transition-all ${
                                active
                                  ? "border-[#9dc3ff] bg-[#2c49bd] shadow-[0_0_24px_rgba(80,140,255,0.45)]"
                                  : "border-[#294aa5]/40 bg-[#071b54]"
                              }`}
                            >
                              <div className="text-[15px] font-bold">
                                {first(p.name)} •{" "}
                                {teeShotTotal(p)}/6
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`${panel} absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-30 p-3`}
      >
        <div className="mb-2 text-[9px] tracking-[0.22em] text-white/60">
          MATCHES
        </div>

        <MatchButtons
          count={Math.max(
            1,
            Math.ceil(players / 2)
          )}
          active={activeMatch}
          setActive={setActiveMatch}
        />
      </div>
    </>
  );
}

function TeamPlayers({
  team,
  players,
  teamLogos,
}: any) {
  const fallbackLogo =
    teamLogos?.[
      team === "red" ? "Red" : "Blue"
    ] || "";

  return (
    <div className="flex items-start justify-center gap-2 text-center">
      {players.map((p: any, i: number) => (
        <div
          key={`${p.name}-${i}`}
          className="flex w-[64px] flex-col items-center"
        >
          <div className="flex h-[64px] items-center justify-center">
            <Logo
              team={team}
              size="h-[58px] w-[58px]"
              src={p.photo || fallbackLogo}
            />
          </div>

          <div className="mt-1 w-full truncate text-[11px] leading-tight text-white">
            {first(p.name)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreBox({
  team,
  players,
  score,
  setScore,
  par,
}: any) {
  const namesText =
    players.map((p: any) => first(p.name)).join(" & ") ||
    TEAM[team].title;

  return (
    <div className="h-[290px] overflow-hidden rounded-[26px] border border-[#d1c79f]/20 bg-black/55 backdrop-blur-xl">
      <div
        className={`border-b px-3 py-2 text-center text-[11px] font-semibold tracking-[0.14em] ${
          team === "red"
            ? "bg-[#7d2b37] text-[#f1dada]"
            : "bg-[#4a61b5] text-[#d6e1ff]"
        }`}
      >
        {namesText}
      </div>

      <div className="relative flex h-[170px] items-center justify-center">
        <button
          onClick={() => setScore(Math.max(0, score - 1))}
          className="absolute left-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/65 text-4xl text-white"
        >
          −
        </button>

        <div className="text-[92px] font-extrabold">
          {score === par + 4 ? "P" : score}
        </div>

        <button
          onClick={() =>
            setScore(Math.min(par + 4, score + 1))
          }
          className="absolute right-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/65 text-4xl text-white"
        >
          +
        </button>
      </div>

      <div
        className={`px-3 py-3 text-center text-[13px] font-semibold tracking-[0.18em] ${
          team === "red"
            ? "bg-[#7d2b37] text-[#f1dada]"
            : "bg-[#4a61b5] text-[#d6e1ff]"
        }`}
      >
        {stableford(score, par, 0)} POINTS
      </div>
    </div>
  );
}
