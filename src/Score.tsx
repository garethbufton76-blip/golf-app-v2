import { useState } from "react";
import PlayerScorecard from "./PlayerScorecard";
import {
  Logo,
  blankHoles,
  cx,
  first,
  holesByTee,
  keyFor,
  playersForMatch,
  shots,
  stableford,
  TEAM,
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
  setMode,
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
  const [finishStep, setFinishStep] = useState<"playing" | "signoff" | "overview">("playing");
  const [showFinishActions, setShowFinishActions] = useState(false);
  const [signedCards, setSignedCards] = useState<Record<string, boolean>>({});

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

  const rosterRed = roster?.Red || roster?.red || [];
  const rosterBlue = roster?.Blue || roster?.blue || [];

  const pairStart = activeMatch * 2;

  const scoringRedPlayers =
    isBetterBall && match.red.length < 2
      ? rosterRed.slice(pairStart, pairStart + 2)
      : match.red;

  const scoringBluePlayers =
    isBetterBall && match.blue.length < 2
      ? rosterBlue.slice(pairStart, pairStart + 2)
      : match.blue;

  const scoringPlayerCount = scoringRedPlayers.length + scoringBluePlayers.length;

  const matchScorecardPlayers = [
    ...scoringRedPlayers.map((p: any) => ({ team: "red", p })),
    ...scoringBluePlayers.map((p: any) => ({ team: "blue", p })),
  ];

  const scorecardKey = (team: string, p: any) =>
    `${team}-${p.rosterIndex}-${p.name}`;

  const allScorecardsSigned =
    matchScorecardPlayers.length > 0 &&
    matchScorecardPlayers.every(({ team, p }: any) => signedCards[scorecardKey(team, p)]);

  function toggleScorecardSigned(team: string, p: any) {
    const key = scorecardKey(team, p);

    setSignedCards((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function editSignedScores() {
    setFinishStep("playing");
    setShowFinishActions(false);
    setSelectedHole(null);
    setCardPlayer(null);
  }

  const result = getResult(holes);

  const isMatchFinished = holes.every(
    (h: any) => h.status !== "pending"
  );

  const redWins = holes.filter((h: any) => h.status === "red").length;
  const blueWins = holes.filter((h: any) => h.status === "blue").length;
  const halved = holes.filter((h: any) => h.status === "as").length;

  const nextHoleNumber =
    holes.find((h: any) => h.status === "pending")?.hole || 18;

  const teeKey =
    day.tee?.charAt(0).toUpperCase() + day.tee?.slice(1).toLowerCase();

  const current =
    holesByTee?.[nextHoleNumber]?.[teeKey] ||
    holesByTee?.[nextHoleNumber]?.White ||
    {
      hole: nextHoleNumber,
      par: 4,
      si: nextHoleNumber,
      metres: 0,
    };

  const displayMain = (() => {
    if (!result.leader) return result.main;

    const name =
      teamNames[result.leader === "red" ? "Red" : "Blue"] ||
      result.leader.toUpperCase();

    return result.main.replace(result.leader.toUpperCase(), name.toUpperCase());
  })();

  const playerKey = (team: string, p: any) =>
    `${team}-${p.rosterIndex}-${p.name}`;

  function teamRoundStats(team: "red" | "blue", teamPlayers: any[]) {
    return teamPlayers.reduce(
      (totals: any, p: any) => {
        for (let holeNo = 1; holeNo <= 18; holeNo += 1) {
          const detail =
            holesByTee?.[holeNo]?.[teeKey] ||
            holesByTee?.[holeNo]?.White ||
            {
              hole: holeNo,
              par: 4,
              si: holeNo,
              metres: 0,
            };

          const gross = grossFor(team, p, holeNo);

          if (gross == null) continue;

          if (Number(gross) < Number(detail.par)) {
            totals.birdies += 1;
          } else if (Number(gross) === Number(detail.par)) {
            totals.pars += 1;
          } else {
            totals.bogeys += 1;
          }
        }

        return totals;
      },
      {
        birdies: 0,
        pars: 0,
        bogeys: 0,
      }
    );
  }

  const redRoundStats = teamRoundStats("red", scoringRedPlayers);
  const blueRoundStats = teamRoundStats("blue", scoringBluePlayers);



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
    const detail =
      holesByTee?.[holeNumber]?.[teeKey] ||
      holesByTee?.[holeNumber]?.White ||
      {
        hole: holeNumber,
        par: 4,
        si: holeNumber,
        metres: 0,
      };

    const redTeamScore =
      match.red.length > 0
        ? grossFor("red", match.red[0], detail.hole)
        : null;

    const blueTeamScore =
      match.blue.length > 0
        ? grossFor("blue", match.blue[0], detail.hole)
        : null;

    const nextDraft: any = {
      red: redTeamScore ?? detail.par,
      blue: blueTeamScore ?? detail.par,
      red_0: detail.par,
      red_1: detail.par,
      blue_0: detail.par,
      blue_1: detail.par,
    };

    scoringRedPlayers.forEach((p: any, i: number) => {
      nextDraft[`red_${i}`] = grossFor("red", p, detail.hole) ?? detail.par;
    });

    scoringBluePlayers.forEach((p: any, i: number) => {
      nextDraft[`blue_${i}`] = grossFor("blue", p, detail.hole) ?? detail.par;
    });

    setSelectedHole(detail);
    setDraft(nextDraft);
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
    const allPlayers = [...scoringRedPlayers, ...scoringBluePlayers];

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
      const allPlayers = [...scoringRedPlayers, ...scoringBluePlayers];

      const lowMarker = Math.min(
        ...allPlayers.map((p: any) => Number(p.handicap || 0))
      );

      const redNets = scoringRedPlayers.map((p: any, i: number) => {
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

      const blueNets = scoringBluePlayers.map((p: any, i: number) => {
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

    const finished = updated.every((h: any) => h.status !== "pending");

    if (finished) {
      setTimeout(() => {
        setShowFinishActions(true);
      }, 400);
    }
  }

  function grossFor(team: string, p: any, hole: number) {
    return scorecards[playerKey(team, p)]?.[hole] ?? null;
  }

  function playerScorecardRows(p: any, team: string, from: number, to: number) {
    return Array.from({ length: to - from + 1 }, (_, i) => {
      const holeNo = from + i;
      const h =
        holesByTee?.[holeNo]?.[teeKey] ||
        holesByTee?.[holeNo]?.White ||
        {
          hole: holeNo,
          par: 4,
          si: holeNo,
          metres: 0,
        };

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
    const detail =
      holesByTee?.[h.hole]?.[teeKey] ||
      holesByTee?.[h.hole]?.White ||
      {
        hole: h.hole,
        par: 4,
        si: h.hole,
        metres: 0,
      };

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
        {finishStep === "signoff" ? (
          <div className="relative mt-6 overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-b from-[#381017]/92 via-[#1e151b]/92 to-[#07101d]/92 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.52)] backdrop-blur-xl">
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

            <div className="relative z-10">
              <div className="text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d1c79f]/65">
                  Sign Off Scorecards
                </div>

                <div className="mt-2 text-[24px] font-black uppercase leading-none tracking-[-0.02em] text-white">
                  Check Every Card
                </div>

                <div className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/42">
                  Review • Edit if needed • Sign off
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2">
                {matchScorecardPlayers.map(({ team, p }: any, index: number) => {
                  const key = scorecardKey(team, p);
                  const signed = !!signedCards[key];
                  const isRed = team === "red";

                  return (
                    <div
                      key={`signoff-card-${key}`}
                      className={cx(
                        "rounded-[20px] border p-3",
                        signed
                          ? "border-[#d1c79f]/45 bg-[#d1c79f]/12"
                          : "border-white/10 bg-black/28"
                      )}
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Logo
                            team={team}
                            size="h-[42px] w-[42px]"
                            src={p.photo || teamLogos?.[isRed ? "Red" : "Blue"]}
                          />

                          <div className="min-w-0">
                            <div className="truncate text-[12px] font-black uppercase tracking-[0.12em] text-white">
                              Scorecard {index + 1}
                            </div>
                            <div className="mt-0.5 truncate text-[10px] font-bold text-white/55">
                              {p.name}
                            </div>
                          </div>
                        </div>

                        <div
                          className={cx(
                            "rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-[0.12em]",
                            signed
                              ? "bg-[#d1c79f] text-black"
                              : "border border-white/10 bg-white/[0.04] text-white/45"
                          )}
                        >
                          {signed ? "Signed" : "Open"}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setCardPlayer({ team, p })}
                          className="rounded-full border border-white/12 bg-white/[0.04] px-2 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-white"
                        >
                          Review
                        </button>

                        <button
                          type="button"
                          onClick={editSignedScores}
                          className="rounded-full border border-white/12 bg-black/30 px-2 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-white/70"
                        >
                          Edit Scores
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleScorecardSigned(team, p)}
                          className={cx(
                            "rounded-full px-2 py-2 text-[9px] font-black uppercase tracking-[0.08em]",
                            signed
                              ? "border border-[#d1c79f]/35 bg-black/30 text-[#d1c79f]"
                              : "bg-[#d1c79f] text-black"
                          )}
                        >
                          {signed ? "Undo" : "Sign"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!allScorecardsSigned}
                onClick={() => setFinishStep("overview")}
                className={cx(
                  "mt-4 w-full rounded-[22px] px-4 py-4",
                  allScorecardsSigned
                    ? "border border-[#d1c79f]/35 bg-[#d1c79f] text-black"
                    : "border border-white/10 bg-white/[0.04] text-white/30"
                )}
              >
                <div className="text-[8px] font-black uppercase tracking-[0.16em] opacity-55">
                  Scorecards
                </div>
                <div className="mt-1 text-[13px] font-black uppercase">
                  Signed Off
                </div>
              </button>
            </div>
          </div>
        ) : finishStep === "overview" ? (
          <div className="fixed inset-y-0 left-1/2 z-[120] w-full max-w-[430px] -translate-x-1/2 overflow-hidden text-white">
            <div className="absolute inset-0">
              <img
                src="/admin-home-bg.jpg"
                alt=""
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/32 backdrop-blur-[6px]" />

              <div
                className={cx(
                  "absolute inset-0",
                  result.leader === "red"
                    ? "bg-[radial-gradient(circle_at_18%_22%,rgba(255,65,85,0.24),transparent_40%)]"
                    : result.leader === "blue"
                    ? "bg-[radial-gradient(circle_at_82%_22%,rgba(103,166,255,0.24),transparent_40%)]"
                    : "bg-[radial-gradient(circle_at_50%_18%,rgba(209,199,159,0.18),transparent_40%)]"
                )}
              />
            </div>

            <div className="relative flex h-[100dvh] flex-col px-3 pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]">
              <div
                className={cx(
                  "relative flex h-full flex-col overflow-hidden rounded-[30px] border p-3 shadow-[0_30px_90px_rgba(0,0,0,0.72)] backdrop-blur-2xl",
                  result.leader === "red"
                    ? "border-[#ff4154]/45 bg-[#090305]/58 shadow-[#ff2d44]/10"
                    : result.leader === "blue"
                    ? "border-[#58a6ff]/45 bg-[#020815]/58 shadow-[#58a6ff]/10"
                    : "border-white/18 bg-black/58"
                )}
              >
                <div
                  className={cx(
                    "pointer-events-none absolute inset-0 opacity-85",
                    result.leader === "red"
                      ? "bg-[radial-gradient(circle_at_12%_18%,rgba(255,48,66,0.42),transparent_34%),radial-gradient(circle_at_88%_22%,rgba(72,145,255,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.70))]"
                      : result.leader === "blue"
                      ? "bg-[radial-gradient(circle_at_88%_18%,rgba(72,145,255,0.42),transparent_34%),radial-gradient(circle_at_12%_22%,rgba(255,48,66,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.70))]"
                      : "bg-[radial-gradient(circle_at_50%_12%,rgba(209,199,159,0.24),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.72))]"
                  )}
                />

                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-screen"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20px 20px, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.05) 11px, transparent 12px),
                      radial-gradient(circle at 64px 64px, rgba(255,255,255,0.11) 0px, rgba(255,255,255,0.04) 11px, transparent 12px)
                    `,
                    backgroundSize: "86px 86px",
                  }}
                />

                <div className="relative z-10 flex h-full min-h-0 flex-col">
                  <div className="text-center">
                    <img
                      src="/launch-logo.png"
                      alt="DUEL"
                      className="mx-auto h-[38px] object-contain opacity-95"
                      style={{
                        filter: "brightness(0) invert(1)",
                      }}
                    />

                    <div className="mt-3 text-[9px] font-black uppercase tracking-[0.30em] text-[#d1c79f]/78">
                      Match Complete
                    </div>

                    <div
                      className={cx(
                        "mt-2 text-[30px] font-black uppercase leading-none tracking-[-0.06em] drop-shadow-[0_12px_30px_rgba(0,0,0,0.65)]",
                        result.leader === "red"
                          ? "text-[#ff4355]"
                          : result.leader === "blue"
                          ? "text-[#67a6ff]"
                          : "text-white"
                      )}
                    >
                      {displayMain}
                    </div>

                    <div className="mx-auto mt-3 flex max-w-[230px] items-center gap-4">
                      <div className="h-px flex-1 bg-[#d1c79f]/40" />
                      <div className="text-[15px] font-black uppercase tracking-[0.26em] text-[#d1c79f]">
                        Final
                      </div>
                      <div className="h-px flex-1 bg-[#d1c79f]/40" />
                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_40px_1fr] items-center gap-2">
                    <div className="flex justify-center gap-2">
                      {scoringRedPlayers.map((p: any, i: number) => (
                        <button
                          key={`complete-red-${p.name}-${i}`}
                          type="button"
                          onClick={() => setCardPlayer({ team: "red", p })}
                          className="group flex w-[68px] flex-col items-center"
                        >
                          <Logo
                            team="red"
                            size="h-[48px] w-[48px]"
                            src={p.photo || teamLogos?.Red}
                          />
                          <div className="mt-2 w-full truncate text-[10px] font-bold text-white/78 group-active:text-[#d1c79f]">
                            {first(p.name)}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="text-center text-[19px] font-black text-white/48">VS</div>

                    <div className="flex justify-center gap-2">
                      {scoringBluePlayers.map((p: any, i: number) => (
                        <button
                          key={`complete-blue-${p.name}-${i}`}
                          type="button"
                          onClick={() => setCardPlayer({ team: "blue", p })}
                          className="group flex w-[68px] flex-col items-center"
                        >
                          <Logo
                            team="blue"
                            size="h-[48px] w-[48px]"
                            src={p.photo || teamLogos?.Blue}
                          />
                          <div className="mt-2 w-full truncate text-[10px] font-bold text-white/78 group-active:text-[#d1c79f]">
                            {first(p.name)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 rounded-[18px] border border-white/12 bg-black/22 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <div className="mb-2 text-center text-[9px] font-black uppercase tracking-[0.22em] text-[#d1c79f]/70">
                      Match Stats
                    </div>

                    <StatRow label="Holes Won" red={redWins} blue={blueWins} />
                    <StatRow label="Birdies" red={redRoundStats.birdies} blue={blueRoundStats.birdies} />
                    <StatRow label="Pars" red={redRoundStats.pars} blue={blueRoundStats.pars} />
                    <StatRow label="Bogeys" red={redRoundStats.bogeys} blue={blueRoundStats.bogeys} />
                  </div>

                  <div className="mt-2 rounded-[18px] border border-white/10 bg-black/22 p-2.5">
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/42">
                      {day.course || "Course"}
                    </div>

                    <div className="mt-1 text-[14px] font-black uppercase tracking-[0.08em] text-white">
                      {day.format}
                    </div>

                    <div className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/42">
                      {day.label} • {String(day.tee || "").toUpperCase()}
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-center text-[8px] font-black uppercase tracking-[0.14em] text-white/48">
                      Tap a player crest to review their scorecard
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFinishStep("playing");
                        setShowFinishActions(false);
                        setSignedCards({});
                        setSelectedHole(null);
                        setCardPlayer(null);
                        if (setMode) {
                          setMode("launch");
                        }
                        setScreen("home");
                      }}
                      className={cx(
                        "mt-3 w-full rounded-full border px-4 py-3.5 text-[13px] font-black uppercase tracking-[0.16em] shadow-[0_0_26px_rgba(255,255,255,0.08)]",
                        result.leader === "red"
                          ? "border-[#ff4355]/55 bg-[#ff4355] text-white"
                          : result.leader === "blue"
                          ? "border-[#67a6ff]/55 bg-[#67a6ff] text-black"
                          : "border-[#d1c79f]/45 bg-[#d1c79f] text-black"
                      )}
                    >
                      New Game
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (

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
              <div className="mb-1 text-center text-[11px] font-semibold tracking-[0.22em] text-white/60">
                {day.label.toUpperCase()} •{" "}
                {(day.course || "ST MICHAELS").toUpperCase()} •{" "}
                {day.tee.toUpperCase()}
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
        )}

        <div className="relative mt-4 min-h-[calc(100vh-320px)] overflow-visible rounded-[26px] border border-white/10 bg-black/45 p-4 backdrop-blur-xl">
          {selectedHole ? (
            <div
              className={cx(
                "absolute left-0 right-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-[26px] bg-[#05070c]/98 p-4 pb-[82px] shadow-2xl backdrop-blur-xl",
                isBetterBall ? "top-[-232px]" : "top-0"
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(64,6,12,0.96), rgba(12,15,22,0.985) 48%, rgba(4,13,27,0.985))",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 22px 22px, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.06) 11px, transparent 12px),
                    radial-gradient(circle at 68px 68px, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.05) 11px, transparent 12px)
                  `,
                  backgroundSize: "90px 90px",
                }}
              />

              <div className="pointer-events-none absolute left-0 right-0 top-0 h-[132px] bg-gradient-to-b from-[#05070c] via-[#05070c]/96 to-transparent" />

              <img
                src="/launch-logo.png"
                alt="DUEL"
                className="pointer-events-none absolute bottom-5 left-1/2 z-20 h-7 -translate-x-1/2 object-contain opacity-85"
                style={{
                  filter: "brightness(0) invert(1)",
                }}
              />

              <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[9px] tracking-[0.24em] text-white/50">
                    SCORE HOLE
                  </div>

                  <div className="mt-0.5 text-[20px] font-black tracking-[0.04em] text-white">
                    Hole {selectedHole.hole} • Par {selectedHole.par} • SI{" "}
                    {selectedHole.si}
                  </div>
                </div>

                <button
                  onClick={saveHole}
                  className="rounded-full bg-[#d1c79f] px-5 py-2.5 text-[14px] font-black text-black"
                >
                  Save
                </button>
              </div>

              {isBetterBall ? (
                <div className="relative z-10 grid flex-1 grid-cols-2 gap-3 overflow-hidden pb-1">
                  <div className="grid h-full grid-rows-2 gap-3">
                    {scoringRedPlayers.map((p: any, i: number) => (
                      <ScoreBox
                        key={`red-${i}`}
                        team="red"
                        players={[p]}
                        score={draft[`red_${i}`]}
                        setScore={(v: number) =>
                          setDraft((d: any) => ({ ...d, [`red_${i}`]: v }))
                        }
                        par={selectedHole.par}
                        compact={scoringPlayerCount >= 4}
                      />
                    ))}
                  </div>

                  <div className="grid h-full grid-rows-2 gap-3">
                    {scoringBluePlayers.map((p: any, i: number) => (
                      <ScoreBox
                        key={`blue-${i}`}
                        team="blue"
                        players={[p]}
                        score={draft[`blue_${i}`]}
                        setScore={(v: number) =>
                          setDraft((d: any) => ({ ...d, [`blue_${i}`]: v }))
                        }
                        par={selectedHole.par}
                        compact={scoringPlayerCount >= 4}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative z-10 grid flex-1 grid-cols-2 gap-0 overflow-hidden rounded-[28px] border border-white/10 bg-black/25 shadow-[0_24px_54px_rgba(0,0,0,0.5)]">
                  <ScoreBox
                    team="red"
                    players={match.red}
                    score={draft.red}
                    setScore={(v: number) =>
                      setDraft((d: any) => ({ ...d, red: v }))
                    }
                    par={selectedHole.par}
                    splitSide="left"
                  />

                  <ScoreBox
                    team="blue"
                    players={match.blue}
                    score={draft.blue}
                    setScore={(v: number) =>
                      setDraft((d: any) => ({ ...d, blue: v }))
                    }
                    par={selectedHole.par}
                    splitSide="right"
                  />
                </div>
              )}

              {isAmbrose && (
                <div className="relative z-10 mt-3 max-h-[128px] overflow-y-auto rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
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
          ) : (
            <>
              {isMatchFinished && showFinishActions && finishStep === "playing" ? (
                <button
                  type="button"
                  onClick={() => setFinishStep("signoff")}
                  className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#d1c79f] px-8 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-black shadow-[0_0_22px_rgba(209,199,159,0.28)]"
                >
                  Finish Game
                </button>
              ) : (
                <img
                  src="/launch-logo.png"
                  alt="DUEL"
                  className="pointer-events-none absolute bottom-5 left-1/2 h-7 -translate-x-1/2 object-contain opacity-85 transition-all duration-500"
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                />
              )}

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
            </>
          )}
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



    </>
  );
}

function StatRow({ label, red, blue }: any) {
  return (
    <div className="grid grid-cols-[58px_1fr_58px] items-center border-t border-white/8 py-2 first:border-t-0">
      <div className="text-left text-[18px] font-black text-[#ff4355]">
        {red}
      </div>

      <div className="text-center text-[10px] font-black uppercase tracking-[0.16em] text-white/62">
        {label}
      </div>

      <div className="text-center text-[14px] font-black text-[#67a6ff]">
        {blue}
      </div>
    </div>
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
            onClick={() => setCardPlayer({ team, p })}
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



function ScoreBox({
  team,
  players,
  score,
  setScore,
  par,
  compact = false,
  splitSide = "single",
}: any) {
  const namesText =
    players.map((p: any) => first(p.name)).join(" & ") || TEAM[team].title;

  const points = stableford(score, par, 0);
  const isRed = team === "red";
  const isSplit = splitSide !== "single";

  const sideRadius =
    splitSide === "left"
      ? "rounded-l-[28px] rounded-r-none"
      : splitSide === "right"
      ? "rounded-r-[28px] rounded-l-none"
      : compact
      ? "rounded-[24px]"
      : "rounded-[28px]";

  return (
    <div
      className={cx(
        "relative overflow-hidden border backdrop-blur-xl",
        sideRadius,
        isSplit
          ? "h-full min-h-[270px] border-y-0 border-l-0 border-r-0 shadow-none"
          : compact
          ? "h-full min-h-0 shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
          : "min-h-[245px] shadow-[0_18px_45px_rgba(0,0,0,0.55)]",
        isRed
          ? "border-[#ff4d5e]/35 bg-gradient-to-b from-[#741923] via-[#35080d] to-[#130204]"
          : "border-[#58a6ff]/35 bg-gradient-to-b from-[#183a63] via-[#09192d] to-[#020913]"
      )}
    >
      {isSplit && splitSide === "left" ? (
        <div className="absolute bottom-0 right-0 top-0 w-px bg-gradient-to-b from-[#ff4d5e]/45 via-white/10 to-[#58a6ff]/30" />
      ) : null}

      <div
        className={cx(
          "pointer-events-none absolute inset-0 opacity-65",
          isRed
            ? "bg-[radial-gradient(circle_at_28%_10%,rgba(255,93,103,0.28),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_45%,rgba(0,0,0,0.38))]"
            : "bg-[radial-gradient(circle_at_72%_10%,rgba(94,169,255,0.28),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_45%,rgba(0,0,0,0.38))]"
        )}
      />

      <div
        className={cx(
          "pointer-events-none absolute bottom-[-34px] h-[145%] w-[56%] rotate-[14deg] opacity-[0.08]",
          isRed ? "right-[-42px] bg-white" : "left-[-42px] bg-[#9fc2ff]"
        )}
      />

      <div
        className={cx(
          "relative z-10 flex h-full flex-col items-center justify-between",
          isSplit ? "px-3 py-5" : compact ? "px-3 py-4" : "p-3"
        )}
      >
        <div
          className={cx(
            "max-w-full truncate text-center font-black uppercase text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]",
            isSplit
              ? "text-[18px] tracking-[0.14em]"
              : compact
              ? "text-[13px] tracking-[0.12em]"
              : "text-[16px] tracking-[0.12em]"
          )}
        >
          {isSplit ? TEAM[team].title : namesText}
        </div>

        <div
          className={cx(
            "font-black leading-none tracking-[-0.08em] text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]",
            isSplit ? "text-[92px]" : compact ? "text-[74px]" : "text-[98px]"
          )}
        >
          {score === par + 4 ? "P" : score}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setScore(Math.max(0, score - 1))}
            className={cx(
              "flex items-center justify-center rounded-full border bg-black/45 font-black text-white transition-all active:scale-95",
              isSplit ? "h-[48px] w-[48px] text-[34px]" : compact ? "h-[42px] w-[58px] text-[30px]" : "h-[44px] w-[64px] text-[34px]",
              isRed
                ? "border-[#ff4d5e] shadow-[0_0_18px_rgba(255,77,94,0.24)] hover:bg-[#ff4d5e]/18"
                : "border-[#58a6ff] shadow-[0_0_18px_rgba(88,166,255,0.24)] hover:bg-[#58a6ff]/18"
            )}
          >
            −
          </button>

          <button
            type="button"
            onClick={() => setScore(Math.min(par + 4, score + 1))}
            className={cx(
              "flex items-center justify-center rounded-full border bg-black/45 font-black text-white transition-all active:scale-95",
              isSplit ? "h-[48px] w-[48px] text-[34px]" : compact ? "h-[42px] w-[58px] text-[30px]" : "h-[44px] w-[64px] text-[34px]",
              isRed
                ? "border-[#ff4d5e] shadow-[0_0_18px_rgba(255,77,94,0.24)] hover:bg-[#ff4d5e]/18"
                : "border-[#58a6ff] shadow-[0_0_18px_rgba(88,166,255,0.24)] hover:bg-[#58a6ff]/18"
            )}
          >
            +
          </button>
        </div>

        <div
          className={cx(
            "rounded-full border px-4 py-1.5 text-center font-black uppercase tracking-[0.08em]",
            isSplit ? "text-[12px]" : compact ? "text-[11px]" : "text-[16px]",
            isRed
              ? "border-[#ff4d5e]/35 bg-[#3d0b12]/80 text-[#ff5f68]"
              : "border-[#58a6ff]/35 bg-[#0c203a]/80 text-[#69b3ff]"
          )}
        >
          {points} {points === 1 ? "POINT" : "POINTS"}
        </div>
      </div>
    </div>
  );
}
