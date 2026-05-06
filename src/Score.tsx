import { useState } from "react";
import { gold, holesByTee } from "./data";

function cx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function first(name = "Player") {
  return String(name).split(" ")[0];
}

function getResult(holes: any[], teamNames: any) {
  const done = holes.filter((h) => h.status !== "pending");
  const red = done.filter((h) => h.status === "red").length;
  const blue = done.filter((h) => h.status === "blue").length;
  const halves = done.filter((h) => h.status === "halve").length;
  const diff = red - blue;
  const left = 18 - done.length;

  if (!done.length || diff === 0) {
    return {
      main: "ALL SQUARE",
      sub: `${red}-${blue}-${halves} • ${left} TO PLAY`,
      leader: null,
    };
  }

  const leader = diff > 0 ? "Red" : "Blue";
  const lead = Math.abs(diff);
  const name = teamNames[leader]?.toUpperCase() || leader.toUpperCase();

  if (lead > left) {
    return {
      main: `${name} ${lead}&${left}`,
      sub: "MATCH CLOSED",
      leader,
    };
  }

  if (lead === left && left > 0) {
    return {
      main: `${name} DORMIE`,
      sub: `${lead}UP • ${left} TO PLAY`,
      leader,
    };
  }

  return {
    main: `${name} ${lead}UP`,
    sub: `${red}-${blue}-${halves} • ${left} TO PLAY`,
    leader,
  };
}

export default function Score({ state, setState, setScreen }: any) {
  const holes = state.holes;
  const tee = state.day.tee || "Blue";
  const result = getResult(holes, state.teamNames);

  const nextHole =
    holes.find((h: any) => h.status === "pending")?.hole || 18;

  const current = holesByTee[nextHole][tee];

  const [selectedHole, setSelectedHole] = useState<any>(null);
  const [redScore, setRedScore] = useState(4);
  const [blueScore, setBlueScore] = useState(4);

  const redPlayer = state.roster.Red[0];
  const bluePlayer = state.roster.Blue[0];

  function openHole(holeNumber: number) {
    const detail = holesByTee[holeNumber][tee];
    setSelectedHole(detail);
    setRedScore(detail.par);
    setBlueScore(detail.par);
  }

  function saveHole() {
    if (!selectedHole) return;

    let status = "halve";

    if (redScore < blueScore) status = "red";
    if (blueScore < redScore) status = "blue";

    const updated = holes.map((h: any) =>
      h.hole === selectedHole.hole ? { ...h, status } : h
    );

    setState({
      ...state,
      holes: updated,
    });

    const next = updated.find((h: any) => h.status === "pending");

    if (next) {
      const nextDetail = holesByTee[next.hole][tee];
      setSelectedHole(nextDetail);
      setRedScore(nextDetail.par);
      setBlueScore(nextDetail.par);
    } else {
      setSelectedHole(null);
    }
  }

  function quickCycle(holeNumber: number) {
    const updated = holes.map((h: any) => {
      if (h.hole !== holeNumber) return h;

      const next =
        h.status === "pending"
          ? "red"
          : h.status === "red"
          ? "blue"
          : h.status === "blue"
          ? "halve"
          : "pending";

      return { ...h, status: next };
    });

    setState({
      ...state,
      holes: updated,
    });
  }

  return (
    <div className="min-h-[100svh] bg-[#050505] p-4 text-white">
      <div className="mx-auto max-w-[430px] pb-24">
        <div
          className={cx(
            "rounded-[30px] border p-4 shadow-2xl backdrop-blur-xl",
            result.leader === "Red"
              ? "border-red-400/30 bg-gradient-to-b from-red-950/80 to-black"
              : result.leader === "Blue"
              ? "border-blue-400/30 bg-gradient-to-b from-blue-950/80 to-black"
              : "border-white/10 bg-gradient-to-b from-[#171717] to-black"
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.28em] text-white/45">
                {state.day.course.toUpperCase()} • {tee.toUpperCase()}
              </div>

              <div
                className="mt-1 text-[12px] font-bold tracking-[0.16em]"
                style={{ color: gold }}
              >
                Hole {current.hole} • SI {current.si} • {current.metres}m
              </div>
            </div>

            <button
              onClick={() => setScreen("home")}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80"
            >
              Back
            </button>
          </div>

          <div className="mb-3 text-center text-[11px] font-black tracking-[0.32em] text-white/70">
            {state.day.format.toUpperCase()}
          </div>

          <div className="grid grid-cols-[1fr_46px_1fr] items-start gap-3">
            <TeamHeader
              side="red"
              team={state.teamNames.Red}
              logo={state.teamLogos.Red}
              player={redPlayer}
              onClick={() => setScreen("rosterRed")}
            />

            <div className="flex h-[78px] items-center justify-center text-2xl font-black text-white/55">
              VS
            </div>

            <TeamHeader
              side="blue"
              team={state.teamNames.Blue}
              logo={state.teamLogos.Blue}
              player={bluePlayer}
              onClick={() => setScreen("rosterBlue")}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
            <div className="text-[23px] font-black tracking-[0.08em]">
              {result.main}
            </div>

            <div className="mt-1 text-[10px] tracking-[0.18em] text-white/45">
              {result.sub}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[30px] border border-white/10 bg-gradient-to-b from-[#151515] to-black p-4 shadow-xl">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.24em] text-white/45">
                HOLE TRACKER
              </div>

              <div className="mt-1 text-[15px] font-bold tracking-[0.08em]">
                Next: Hole{" "}
                <span style={{ color: gold }}>
                  {current.hole}
                </span>
              </div>
            </div>

            <div
              className="rounded-full px-3 py-1 text-[10px] font-black tracking-[0.16em] text-black"
              style={{ background: gold }}
            >
              LIVE
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2.5">
            {holes.map((h: any) => {
              const detail = holesByTee[h.hole][tee];
              const active = h.hole === nextHole;

              return (
                <button
                  key={h.hole}
                  onClick={() => openHole(h.hole)}
                  onDoubleClick={() => quickCycle(h.hole)}
                  className={cx(
                    "relative h-[88px] rounded-[18px] border px-2 py-2 text-center transition-all",
                    h.status === "red" &&
                      "border-red-400/50 bg-gradient-to-b from-red-800 to-black",
                    h.status === "blue" &&
                      "border-blue-400/50 bg-gradient-to-b from-blue-800 to-black",
                    h.status === "halve" &&
                      "border-white/20 bg-gradient-to-b from-neutral-700 to-black",
                    h.status === "pending" &&
                      "border-white/10 bg-gradient-to-b from-[#111] to-black"
                  )}
                  style={
                    active
                      ? {
                          border: `2px solid ${gold}`,
                          boxShadow:
                            "0 0 0 2px rgba(209,199,159,0.45), 0 0 22px rgba(209,199,159,0.85)",
                          transform: "scale(1.06)",
                          zIndex: 2,
                        }
                      : undefined
                  }
                >
                  {active && (
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-black text-black"
                      style={{ background: gold }}
                    >
                      NOW
                    </div>
                  )}

                  <div className="h-5 text-[10px] font-black">
                    {h.status === "red" && "R"}
                    {h.status === "blue" && "B"}
                    {h.status === "halve" && "AS"}
                  </div>

                  <div className="mt-1 text-[16px] font-black">
                    {h.hole}
                  </div>

                  <div className="mt-1 text-[9px] text-white/45">
                    PAR {detail.par}
                  </div>

                  <div className="text-[9px] text-white/45">
                    SI {detail.si}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-center text-[10px] leading-4 text-white/35">
            Tap a hole to score. Save auto-opens the next hole.
          </div>
        </div>
      </div>

      {selectedHole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-[390px] rounded-[30px] border border-[#d1c79f]/35 bg-gradient-to-b from-[#151515] to-black p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold tracking-[0.26em] text-white/45">
                  SCORE HOLE
                </div>

                <div
                  className="mt-1 text-[16px] font-black"
                  style={{ color: gold }}
                >
                  Hole {selectedHole.hole} • Par {selectedHole.par} • SI{" "}
                  {selectedHole.si}
                </div>
              </div>

              <button
                onClick={saveHole}
                className="rounded-full px-5 py-2 text-sm font-black text-black"
                style={{ background: gold }}
              >
                Save
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreBox
                side="red"
                name={first(redPlayer.name)}
                score={redScore}
                setScore={setRedScore}
                par={selectedHole.par}
              />

              <ScoreBox
                side="blue"
                name={first(bluePlayer.name)}
                score={blueScore}
                setScore={setBlueScore}
                par={selectedHole.par}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamHeader({ side, team, logo, player, onClick }: any) {
  return (
    <button onClick={onClick} className="flex min-w-0 flex-col items-center">
      <div
        className={cx(
          "flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border text-3xl font-black shadow-xl",
          side === "red"
            ? "border-red-300/25 bg-gradient-to-b from-red-600 to-red-950"
            : "border-blue-300/25 bg-gradient-to-b from-blue-500 to-blue-950"
        )}
      >
        {logo ? (
          <img src={logo} className="h-full w-full object-cover" />
        ) : (
          team[0]
        )}
      </div>

      <div className="mt-2 max-w-[118px] truncate text-center text-[12px] font-black tracking-[0.12em]">
        {team}
      </div>

      <div className="mt-1 text-[11px] text-white/45">
        {first(player.name)}
      </div>
    </button>
  );
}

function ScoreBox({ side, name, score, setScore, par }: any) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#d1c79f]/20 bg-black/60">
      <div
        className={cx(
          "px-3 py-2 text-center text-[11px] font-black tracking-[0.12em]",
          side === "red"
            ? "bg-red-900 text-red-100"
            : "bg-blue-900 text-blue-100"
        )}
      >
        {name}
      </div>

      <div className="relative h-[112px]">
        <button
          onClick={() => setScore(Math.max(0, score - 1))}
          className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/75 text-2xl font-black"
        >
          −
        </button>

        <div className="flex h-full items-center justify-center text-[64px] font-black">
          {score === par + 4 ? "P" : score}
        </div>

        <button
          onClick={() => setScore(Math.min(par + 4, score + 1))}
          className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/75 text-2xl font-black"
        >
          +
        </button>
      </div>

      <div
        className={cx(
          "px-3 py-2 text-center text-[10px] font-bold tracking-[0.16em]",
          side === "red"
            ? "bg-red-900 text-red-100"
            : "bg-blue-900 text-blue-100"
        )}
      >
        {score === par + 4 ? "PICKUP" : `${score} GROSS`}
      </div>
    </div>
  );
}
