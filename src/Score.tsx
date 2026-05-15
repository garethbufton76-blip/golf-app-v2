import { useState } from "react";
import {
  Logo,
  MatchButtons,
  blankHoles,
  cx,
  first,
  holesByTee,
  keyFor,
  panel,
  playersForMatch,
  shots,
  stableford,
  TEAM,
  getResult,
} from "./data";
import PlayerScorecard from "./PlayerScorecard";

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

  const count = /singles/i.test(day.format)
    ? players
    : Math.max(1, Math.ceil(players / 2));

  const isAmbrose = /ambrose/i.test(day.format);
  const isBetterBall = /better ball/i.test(day.format);

  const [activeMatch, setActiveMatch] = useState(startMatch || 0);
  const [selectedHole, setSelectedHole] = useState<any>(null);
  const [cardPlayer, setCardPlayer] = useState<any>(null);

  const [draft, setDraft] = useState<any>({
    red: 4,
    blue: 4,
    red_0: 4,
    red_1: 4,
    blue_0: 4,
    blue_1: 4,
  });

  const [teeShotSelections, setTeeShotSelections] = useState<any>({});

  const stateKey = keyFor(activeDay, activeMatch);
  const holes = states[stateKey] || blankHoles();
  const match = playersForMatch(roster, players, day.format, activeMatch);
  const result = getResult(holes);

  const nextHoleNumber =
    holes.find((h: any) => h.status === "pending")?.hole || 18;

  const current = holesByTee[nextHoleNumber][day.tee];

  const displayMain = (() => {
    if (!result.leader) return result.main;

    const name =
      teamNames[result.leader === "red" ? "Red" : "Blue"] ||
      result.leader.toUpperCase();

    return result.main.replace(result.leader.toUpperCase(), name.toUpperCase());
  })();

  const playerKey = (team: string, p: any) =>
    `${team}-${p.rosterIndex}-${p.name}`;

  function teeSelectionKey(hole: number, team: string) {
    return `${stateKey}-hole-${hole}-${team}`;
  }

  function getSelectedTeePlayer(hole: number, team: string) {
    return teeShotSelections[teeSelectionKey(hole, team)] || "";
  }

  function selectTeeShot(hole: number, team: string, p: any) {
    setTeeShotSelections((current: any) => ({
      ...current,
      [teeSelectionKey(hole, team)]: playerKey(team, p),
    }));
  }

  function getTeeShotCount(team: string, p: any) {
    const key = playerKey(team, p);

    return Object.entries(teeShotSelections).filter(
      ([selectionKey, value]) =>
        selectionKey.startsWith(`${stateKey}-hole-`) && value === key
    ).length;
  }

  function openHole(holeNumber: number) {
    const detail = holesByTee[holeNumber][day.tee];

    setSelectedHole(detail);

    setDraft({
      red: detail.par,
      blue: detail.par,
      red_0: detail.par,
      red_1: detail.par,
      blue_0: detail.par,
      blue_1: detail.par,
    });
  }

  function teamHandicap(side: any[]) {
    const total = side.reduce((sum, p) => sum + Number(p.handicap || 0), 0);

    if (/ambrose/i.test(day.format)) {
      if (side.length === 2) return Math.round(total / 4);
      if (side.length === 3) return Math.round(total / 6);
      if (side.length === 4) return Math.round(total / 8);
      return Math.round(total / Math.max(1, side.length * 2));
    }

    if (/foursomes/i.test(day.format)) return Math.round(total * 0.5);

    if (/chapman|pinehurst|greensomes/i.test(day.format))
      return Math.round(total * 0.6);

    return Math.round(total);
  }

  function holeShotDots(detail: any) {
    const allPlayers = [...match.red, ...match.blue];

    if (allPlayers.length < 2) return { red: false, blue: false };

    if (/ambrose|foursomes|chapman|pinehurst|greensomes/i.test(day.format)) {
      const redHcp = teamHandicap(match.red);
      const blueHcp = teamHandicap(match.blue);
      const low = Math.min(redHcp, blueHcp);

      return {
        red: shots(Math.max(0, redHcp - low), detail.si) > 0,
        blue: shots(Math.max(0, blueHcp - low), detail.si) > 0,
      };
    }

    const lowMarker = Math.min(
      ...allPlayers.map((p) => Number(p.handicap || 0))
    );

    return {
      red: match.red.some(
        (p: any) =>
          shots(Math.max(0, Number(p.handicap || 0) - lowMarker), detail.si) >
          0
      ),
      blue: match.blue.some(
        (p: any) =>
          shots(Math.max(0, Number(p.handicap || 0) - lowMarker), detail.si) >
          0
      ),
    };
  }

  function saveHole() {
    if (!selectedHole) return;

    let status = "as";
    const nextScorecards: any = { ...scorecards };

    if (isBetterBall) {
      const allPlayers = [...match.red, ...match.blue];

      const lowMarker = Math.min(
        ...allPlayers.map((p: any) => Number(p.handicap || 0))
      );

      const redNets = match.red.map((p: any, i: number) => {
        const gross = Number(draft[`red_${i}`] ?? selectedHole.par);

        const strokeCount = shots(
          Math.max(0, Number(p.handicap || 0) - lowMarker),
          selectedHole.si
        );

        const k = playerKey("red", p);

        nextScorecards[k] = {
          ...(nextScorecards[k] || {}),
          [selectedHole.hole]: gross,
        };

        return gross - strokeCount;
      });

      const blueNets = match.blue.map((p: any, i: number) => {
        const gross = Number(draft[`blue_${i}`] ?? selectedHole.par);

        const strokeCount = shots(
          Math.max(0, Number(p.handicap || 0) - lowMarker),
          selectedHole.si
        );

        const k = playerKey("blue", p);

        nextScorecards[k] = {
          ...(nextScorecards[k] || {}),
          [selectedHole.hole]: gross,
        };

        return gross - strokeCount;
      });

      const redBest = Math.min(...redNets);
      const blueBest = Math.min(...blueNets);

      status = redBest < blueBest ? "red" : blueBest < redBest ? "blue" : "as";
    } else {
      const redScore = Number(draft.red ?? selectedHole.par);
      const blueScore = Number(draft.blue ?? selectedHole.par);

      const redHcp =
        /ambrose|foursomes|chapman|pinehurst|greensomes/i.test(day.format)
          ? teamHandicap(match.red)
          : Number(match.red[0]?.handicap || 0);

      const blueHcp =
        /ambrose|foursomes|chapman|pinehurst|greensomes/i.test(day.format)
          ? teamHandicap(match.blue)
          : Number(match.blue[0]?.handicap || 0);

      const low = Math.min(redHcp, blueHcp);

      const redNet =
        redScore - shots(Math.max(0, redHcp - low), selectedHole.si);

      const blueNet =
        blueScore - shots(Math.max(0, blueHcp - low), selectedHole.si);

      status = redNet < blueNet ? "red" : blueNet < redNet ? "blue" : "as";

      match.red.forEach((p: any) => {
        const k = playerKey("red", p);

        nextScorecards[k] = {
          ...(nextScorecards[k] || {}),
          [selectedHole.hole]: redScore,
        };
      });

      match.blue.forEach((p: any) => {
        const k = playerKey("blue", p);

        nextScorecards[k] = {
          ...(nextScorecards[k] || {}),
          [selectedHole.hole]: blueScore,
        };
      });
    }

    const updated = holes.map((h: any) =>
      h.hole === selectedHole.hole ? { ...h, status } : h
    );

    setStates((s: any) => ({
      ...s,
      [stateKey]: updated,
    }));

    setScorecards(nextScorecards);
    setSelectedHole(null);
  }

  function grossFor(team: string, p: any, hole: number) {
    return scorecards[playerKey(team, p)]?.[hole] ?? null;
  }

  function playerScorecardRows(p: any, team: string, from: number, to: number) {
    return Array.from({ length: to - from + 1 }, (_, i) => {
      const holeNo = from + i;
      const h = holesByTee[holeNo][day.tee];
      const gross = grossFor(team, p, h.hole);
      const shotCount = shots(Number(p.handicap || 0), h.si);
      const net = gross == null ? null : Math.max(1, Number(gross) - shotCount);
      const points = gross == null ? null : stableford(gross, h.par, shotCount);

      return {
        ...h,
        gross,
        net,
        points,
      };
    });
  }

  const Hole = ({ h }: any) => {
    const detail = holesByTee[h.hole][day.tee];
    const status = h.status;
    const active = h.hole === nextHoleNumber;

    const shotDot = holeShotDots(detail);
    const both = shotDot.red && shotDot.blue;
    const single = shotDot.red || shotDot.blue;

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
        onClick={() => openHole(h.hole)}
        className={cx(
          "relative h-[86px] rounded-[18px] border bg-gradient-to-b px-2 py-1 text-center transition-all",
          tone
        )}
        style={
          active
            ? {
                border: "2px solid #d1c79f",
                boxShadow:
                  "0 0 0 2px rgba(209,199,159,0.45), 0 0 18px rgba(209,199,159,0.85)",
                transform: "scale(1.05)",
                zIndex: 2,
              }
            : undefined
        }
      >
        <div className="absolute left-0 right-0 top-1 flex justify-center">
          {both ? (
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff6d6d] shadow-[0_0_7px_rgba(255,109,109,0.9)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#67a6ff] shadow-[0_0_7px_rgba(103,166,255,0.9)]" />
            </div>
          ) : single ? (
            <span
              className={cx(
                "h-1.5 w-1.5 rounded-full shadow-[0_0_7px_rgba(255,255,255,0.6)]",
                shotDot.red ? "bg-[#ff6d6d]" : "bg-[#67a6ff]"
              )}
            />
          ) : null}
        </div>

        <div className="flex h-5 items-center justify-center">
          {status === "red" || status === "blue" ? (
            <Logo
              team={status}
              size="h-5 w-5"
              src={teamLogos[status === "red" ? "Red" : "Blue"]}
            />
          ) : status === "as" ? (
            <span className="text-[9px]">AS</span>
          ) : null}
        </div>

        <div className="mt-0.5 text-[13px] font-medium">{h.hole}</div>

        <div className="mt-1 text-[9px] text-white/50">SI {detail.si}</div>
      </button>
    );
  };

  return (
    <>
      <div className="relative flex-1 overflow-y-auto pb-[220px]">
        <div
          className={cx(
            "relative mt-6 overflow-hidden rounded-[26px] border border-white/15 p-4 backdrop-blur-xl",
            result.leader === "red"
              ? "bg-gradient-to-b from-[#7c2430]/85 to-[#47151d]/85"
              : result.leader === "blue"
              ? "bg-gradient-to-b from-[#415aaf]/85 to-[#29386c]/85"
              : "bg-gradient-to-b from-[#5c5c5c]/80 to-[#2d2d2d]/80"
          )}
        >
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20px 20px, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.07) 11px, transparent 12px),
                radial-gradient(circle at 60px 60px, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.05) 11px, transparent 12px)
              `,
              backgroundSize: "80px 80px",
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_45%,rgba(0,0,0,0.08))]" />

          <div className="relative z-10">
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold tracking-[0.22em] text-white/60">
              <div>
                {day.label.toUpperCase()} •{" "}
                {(day.course || "ST MICHAELS").toUpperCase()} •{" "}
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
                isAmbrose={isAmbrose}
                getTeeShotCount={getTeeShotCount}
                setCardPlayer={setCardPlayer}
              />

              <div className="flex h-[70px] items-center justify-center text-2xl font-bold text-white/75">
                VS
              </div>

              <TeamPlayers
                team="blue"
                players={match.blue}
                teamLogos={teamLogos}
                isAmbrose={isAmbrose}
                getTeeShotCount={getTeeShotCount}
                setCardPlayer={setCardPlayer}
              />
            </div>

            <div className="mt-1 text-center">
              <div className="text-[20px] font-extrabold tracking-[0.08em]">
                {displayMain}
              </div>

              <div className="mt-0.5 text-[10px] tracking-[0.16em] text-white/55">
                {result.sub}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-4 rounded-[26px] border border-white/10 bg-black/45 p-4 backdrop-blur-xl">
          <div className="mb-4">
            <div className="text-[10px] tracking-[0.22em] text-white/60">
              HOLE TRACKER
            </div>

            <div className="text-[14px] font-bold tracking-[0.16em]">
              Hole {current.hole} • SI {current.si} • {current.metres}m
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2.5">
            {holes.map((h: any) => (
              <Hole key={h.hole} h={h} />
            ))}
          </div>
        </div>
      </div>

      {cardPlayer && (
        <PlayerScorecard
          cardPlayer={cardPlayer}
          close={() => setCardPlayer(null)}
          day={day}
          teamLogos={teamLogos}
          playerScorecardRows={playerScorecardRows}
        />
      )}

      {selectedHole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-[380px] rounded-[26px] border border-[#d1c79f]/30 bg-black/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] tracking-[0.24em] text-white/50">
                  SCORE HOLE
                </div>

                <div className="mt-1 text-[16px] font-black tracking-[0.08em] text-white">
                  Hole {selectedHole.hole} • Par {selectedHole.par} • SI{" "}
                  {selectedHole.si}
                </div>
              </div>

              <button
                onClick={saveHole}
                className="rounded-full bg-[#d1c79f] px-4 py-2 text-[12px] font-black text-black"
              >
                Save
              </button>
            </div>

            {isBetterBall ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  {match.red.map((p: any, i: number) => (
                    <ScoreBox
                      key={`red-${i}`}
                      team="red"
                      players={[p]}
                      score={draft[`red_${i}`]}
                      setScore={(v: number) =>
                        setDraft((d: any) => ({ ...d, [`red_${i}`]: v }))
                      }
                      par={selectedHole.par}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  {match.blue.map((p: any, i: number) => (
                    <ScoreBox
                      key={`blue-${i}`}
                      team="blue"
                      players={[p]}
                      score={draft[`blue_${i}`]}
                      setScore={(v: number) =>
                        setDraft((d: any) => ({ ...d, [`blue_${i}`]: v }))
                      }
                      par={selectedHole.par}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <ScoreBox
                  team="red"
                  players={match.red}
                  score={draft.red}
                  setScore={(v: number) =>
                    setDraft((d: any) => ({ ...d, red: v }))
                  }
                  par={selectedHole.par}
                />

                <ScoreBox
                  team="blue"
                  players={match.blue}
                  score={draft.blue}
                  setScore={(v: number) =>
                    setDraft((d: any) => ({ ...d, blue: v }))
                  }
                  par={selectedHole.par}
                />
              </div>
            )}

            {isAmbrose && (
              <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
                <div className="mb-2 text-center text-[9px] font-bold tracking-[0.22em] text-white/45">
                  TEE SHOT USED
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    {match.red.map((p: any) => {
                      const selected =
                        getSelectedTeePlayer(selectedHole.hole, "red") ===
                        playerKey("red", p);

                      return (
                        <button
                          key={`red-${p.name}`}
                          onClick={() =>
                            selectTeeShot(selectedHole.hole, "red", p)
                          }
                          className={cx(
                            "w-full rounded-xl border px-2 py-2 text-[11px] font-semibold transition-all",
                            selected
                              ? "border-red-300 bg-red-800 text-white shadow-[0_0_12px_rgba(255,109,109,0.45)]"
                              : "border-red-400/25 bg-red-950/35 text-red-100"
                          )}
                        >
                          {first(p.name)} • {getTeeShotCount("red", p)}/6
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    {match.blue.map((p: any) => {
                      const selected =
                        getSelectedTeePlayer(selectedHole.hole, "blue") ===
                        playerKey("blue", p);

                      return (
                        <button
                          key={`blue-${p.name}`}
                          onClick={() =>
                            selectTeeShot(selectedHole.hole, "blue", p)
                          }
                          className={cx(
                            "w-full rounded-xl border px-2 py-2 text-[11px] font-semibold transition-all",
                            selected
                              ? "border-blue-300 bg-blue-800 text-white shadow-[0_0_12px_rgba(103,166,255,0.45)]"
                              : "border-blue-400/25 bg-blue-950/35 text-blue-100"
                          )}
                        >
                          {first(p.name)} • {getTeeShotCount("blue", p)}/6
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

      <div
        className={cx(
          "absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-30 p-3",
          panel
        )}
      >
        <div className="mb-2 text-[9px] tracking-[0.22em] text-white/60">
          MATCHES
        </div>

        <MatchButtons
          count={count}
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
  isAmbrose,
  getTeeShotCount,
  setCardPlayer,
}: any) {
  const fallbackLogo = teamLogos?.[team === "red" ? "Red" : "Blue"] || "";
  const logoSize =
    players.length > 1 ? "h-[50px] w-[50px]" : "h-[64px] w-[64px]";

  return (
    <div className="flex items-start justify-center gap-2 text-center">
      {players.map((p: any, i: number) => (
        <div key={`${p.name}-${i}`} className="flex w-[64px] flex-col items-center">
          <button
            onClick={() => setCardPlayer({ team, p, players, matchScore: displayMain })}
            className="flex h-[64px] items-center justify-center"
          >
            <Logo team={team} size={logoSize} src={p.photo || fallbackLogo} />
          </button>

          <div className="mt-1 w-full truncate text-[11px] leading-tight text-white">
            {first(p.name)}
          </div>

          {isAmbrose && (
            <div className="mt-1 flex justify-center gap-[2px]">
              {Array.from({ length: 6 }, (_, dot) => (
                <span
                  key={dot}
                  className={cx(
                    "h-1.5 w-1.5 rounded-full border border-white/25",
                    dot < getTeeShotCount(team, p)
                      ? team === "red"
                        ? "bg-[#ff6d6d]"
                        : "bg-[#67a6ff]"
                      : "bg-black/45"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


function ScoreBox({ team, players, score, setScore, par }: any) {
  const namesText =
    players.map((p: any) => first(p.name)).join(" & ") || TEAM[team].title;

  return (
    <div className="h-[146px] overflow-hidden rounded-[20px] border border-[#d1c79f]/20 bg-black/55 backdrop-blur-xl">
      <div
        className={cx(
          "border-b px-2 py-1.5 text-center text-[10px] font-semibold tracking-[0.14em]",
          team === "red"
            ? "bg-[#6f2a33] text-[#f1dada]"
            : "bg-[#3f56a0] text-[#d6e1ff]"
        )}
      >
        <span className="block truncate">{namesText}</span>
      </div>

      <div className="relative h-[92px]">
        <button
          onClick={() => setScore(Math.max(0, score - 1))}
          className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-xl text-white"
        >
          −
        </button>

        <div className="flex h-full items-center justify-center text-[58px] font-extrabold">
          {score === par + 4 ? "P" : score}
        </div>

        <button
          onClick={() => setScore(Math.min(par + 4, score + 1))}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-xl text-white"
        >
          +
        </button>
      </div>

      <div
        className={cx(
          "px-2 py-1.5 text-center text-[10px] font-semibold tracking-[0.16em]",
          team === "red"
            ? "bg-[#6f2a33] text-[#f1dada]"
            : "bg-[#3f56a0] text-[#d6e1ff]"
        )}
      >
        {stableford(score, par, 0)} POINTS
      </div>
    </div>
  );
}
