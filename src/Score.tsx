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
} from "./data";

function getResult(holes: any[]) {
  const done = holes.filter((h) => h.status !== "pending");
  const red = done.filter((h) => h.status === "red").length;
  const blue = done.filter((h) => h.status === "blue").length;
  const as = done.filter((h) => h.status === "as").length;
  const diff = red - blue;
  const left = 18 - done.length;

  if (!done.length || diff === 0) {
    return {
      main: "ALL SQUARE",
      sub: `${red}-${blue}-${as} • ${left} TO PLAY`,
      leader: null,
    };
  }

  const leader = diff > 0 ? "red" : "blue";
  const lead = Math.abs(diff);

  if (lead > left) {
    return {
      main: `${leader.toUpperCase()} ${lead}&${left}`,
      sub: "MATCH CLOSED",
      leader,
    };
  }

  if (lead === left && left > 0) {
    return {
      main: `${leader.toUpperCase()} DORMIE`,
      sub: `${lead}UP • ${left} TO PLAY`,
      leader,
    };
  }

  return {
    main: `${leader.toUpperCase()} ${lead}UP`,
    sub: `${red}-${blue}-${as} • ${left} TO PLAY`,
    leader,
  };
}

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

  const [activeMatch, setActiveMatch] = useState(startMatch || 0);
  const [selectedHole, setSelectedHole] = useState<any>(null);
  const [cardPlayer, setCardPlayer] = useState<any>(null);
  const [draft, setDraft] = useState({ red: 4, blue: 4 });

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

  const grossFor = (team: string, p: any, hole: number) =>
    scorecards[playerKey(team, p)]?.[hole] ?? null;

  function openHole(holeNumber: number) {
    const detail = holesByTee[holeNumber][day.tee];

    setSelectedHole(detail);
    setDraft({
      red: detail.par,
      blue: detail.par,
    });
  }

  function teamHandicap(side: any[]) {
    const total = side.reduce(
      (sum, p) => sum + Number(p.handicap || 0),
      0
    );

    if (/ambrose/i.test(day.format)) {
      if (side.length === 2) return Math.round(total / 4);
      if (side.length === 3) return Math.round(total / 6);
      if (side.length === 4) return Math.round(total / 8);
      return Math.round(total / Math.max(1, side.length * 2));
    }

    if (/foursomes/i.test(day.format)) {
      return Math.round(total * 0.5);
    }

    if (/chapman|pinehurst|greensomes/i.test(day.format)) {
      return Math.round(total * 0.6);
    }

    return Math.round(total);
  }

  function holeShotDots(detail: any) {
    const allPlayers = [...match.red, ...match.blue];

    if (allPlayers.length < 2) {
      return { red: false, blue: false };
    }

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

    const redScore = Number(draft.red ?? selectedHole.par);
    const blueScore = Number(draft.blue ?? selectedHole.par);

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

    const status = redNet < blueNet ? "red" : blueNet < redNet ? "blue" : "as";

    const updated = holes.map((h: any) =>
      h.hole === selectedHole.hole ? { ...h, status } : h
    );

    setStates((s: any) => ({
      ...s,
      [stateKey]: updated,
    }));

    setScorecards((s: any) => {
      const next = { ...s };

      match.red.forEach((p: any) => {
        const k = playerKey("red", p);
        next[k] = {
          ...(next[k] || {}),
          [selectedHole.hole]: redScore,
        };
      });

      match.blue.forEach((p: any) => {
        const k = playerKey("blue", p);
        next[k] = {
          ...(next[k] || {}),
          [selectedHole.hole]: blueScore,
        };
      });

      return next;
    });

    setSelectedHole(null);
  }

  const playerCard = (p: any, team: string) =>
    Array.from({ length: 18 }, (_, i) => {
      const h = holesByTee[i + 1][day.tee];
      const gross = grossFor(team, p, h.hole);
      const shotCount = shots(Number(p.handicap || 0), h.si);

      return {
        ...h,
        gross,
        pts: gross == null ? null : stableford(gross, h.par, shotCount),
      };
    });

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
        {active && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#d1c79f] px-2 py-[1px] text-[8px] font-black text-black">
            NOW
          </div>
        )}

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

        <div className="mt-0.5 text-[13px] font-medium">
          {h.hole}
        </div>

        <div className="mt-1 text-[9px] text-white/50">
          SI {detail.si}
        </div>
      </button>
    );
  };

  return (
    <>
      <div className="relative flex-1 overflow-y-auto pb-[220px]">
        <div
          className={cx(
            "mt-6 rounded-[26px] border border-white/15 p-4 backdrop-blur-xl",
            result.leader === "red"
              ? "bg-gradient-to-b from-[#7c2430]/80 to-[#47151d]/80"
              : result.leader === "blue"
              ? "bg-gradient-to-b from-[#415aaf]/80 to-[#29386c]/80"
              : "bg-gradient-to-b from-[#5c5c5c]/70 to-[#2d2d2d]/70"
          )}
        >
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold tracking-[0.22em] text-white/60">
            <div>
              {day.label.toUpperCase()} • ST MICHAELS • {day.tee.toUpperCase()}
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
              setCardPlayer={setCardPlayer}
              teamLogos={teamLogos}
            />

            <div className="flex h-[70px] items-center justify-center text-2xl font-bold text-white/75">
              VS
            </div>

            <TeamPlayers
              team="blue"
              players={match.blue}
              setCardPlayer={setCardPlayer}
              teamLogos={teamLogos}
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

          {cardPlayer && (
            <Overlay tall>
              <div className="mb-4 flex justify-between">
                <div>
                  <div className="text-[11px] tracking-[0.28em] text-[#d1c79f]/70">
                    PLAYER SCORECARD
                  </div>

                  <div className="mt-2 text-[18px] font-bold">
                    {cardPlayer.p.name}
                  </div>

                  <div className="mt-1 text-[11px] text-[#d1c79f]/65">
                    {day.course} • {day.tee} TEE
                  </div>
                </div>

                <Close onClick={() => setCardPlayer(null)} />
              </div>

              <div className="grid grid-cols-6 gap-2 overflow-y-auto">
                {playerCard(cardPlayer.p, cardPlayer.team).map((h: any) => (
                  <div
                    key={h.hole}
                    className="rounded-[14px] border border-white/10 bg-black/45 p-2 text-center"
                  >
                    <div className="text-[9px] text-white/45">
                      HOLE
                    </div>

                    <div className="text-[15px] font-bold">
                      {h.hole}
                    </div>

                    <div className="mt-1 text-[9px] text-white/45">
                      PAR {h.par}
                    </div>

                    <div className="mt-2 text-[18px] font-black text-[#d1c79f]">
                      {h.gross == null ? "-" : h.gross}
                    </div>

                    <div className="mt-1 text-[9px] text-white/55">
                      {h.pts == null ? "" : `${h.pts} pts`}
                    </div>
                  </div>
                ))}
              </div>
            </Overlay>
          )}
        </div>
      </div>

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

            <div className="grid grid-cols-2 gap-3">
              <ScoreBox
                team="red"
                players={match.red}
                score={draft.red}
                setScore={(v: number) =>
                  setDraft((d) => ({ ...d, red: v }))
                }
                par={selectedHole.par}
              />

              <ScoreBox
                team="blue"
                players={match.blue}
                score={draft.blue}
                setScore={(v: number) =>
                  setDraft((d) => ({ ...d, blue: v }))
                }
                par={selectedHole.par}
              />
            </div>
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

function TeamPlayers({ team, players, setCardPlayer, teamLogos }: any) {
  const fallbackLogo =
    teamLogos?.[team === "red" ? "Red" : "Blue"] || "";

  const logoSize =
    players.length > 1 ? "h-[50px] w-[50px]" : "h-[64px] w-[64px]";

  return (
    <div className="flex items-start justify-center gap-2 text-center">
      {players.map((p: any, i: number) => (
        <div
          key={`${p.name}-${i}`}
          className="flex w-[64px] flex-col items-center"
        >
          <button
            onClick={() => setCardPlayer({ team, p })}
            className="flex h-[64px] items-center justify-center"
          >
            <Logo
              team={team}
              size={logoSize}
              src={p.photo || fallbackLogo}
            />
          </button>

          <div className="mt-1 w-full truncate text-[11px] leading-tight text-white">
            {first(p.name)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreBox({ team, players, score, setScore, par }: any) {
  const namesText =
    players.map((p: any) => first(p.name)).join(" & ") ||
    TEAM[team].title;

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
        <span className="block truncate">
          {namesText}
        </span>
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

function Overlay({ children, tall = false }: any) {
  return (
    <div
      className={cx(
        "absolute inset-0 z-30",
        tall && "-top-[160px] bottom-[-55px]"
      )}
    >
      <div className="h-full rounded-[26px] border border-[#d1c79f]/25 bg-black/90 p-4 backdrop-blur-xl shadow-2xl flex flex-col">
        {children}
      </div>
    </div>
  );
}

function Close({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-[#d1c79f]/40 bg-[#d1c79f]/15 px-3 py-1.5 text-xs font-semibold text-[#efe6bf]"
    >
      Close
    </button>
  );
}
