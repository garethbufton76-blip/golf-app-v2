import { useState } from "react";
import {
  Logo,
  Button,
  cx,
  matchCount,
  keyFor,
  blankHoles,
  playersForMatch,
  getResult,
  first,
} from "./data";

function DayButtons({
  dayConfigs,
  days,
  active,
  setActive,
}: any) {
  const shown = dayConfigs.slice(0, days);

  if (shown.length <= 1) return null;

  return (
    <div
      className="mb-3 grid gap-2"
      style={{
        gridTemplateColumns:
          "repeat(" + shown.length + ", minmax(0, 1fr))",
      }}
    >
      {shown.map((d: any, i: number) => (
        <Button
          key={d.label}
          active={i === active}
          onClick={() => setActive(i)}
          className="py-2 text-[10px]"
        >
          {d.label}
        </Button>
      ))}
    </div>
  );
}

function formatScore(value: any) {
  const n = Number(value || 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function namesFor(players: any[]) {
  if (!players?.length) return "TBC";

  return players.map((p: any) => first(p.name)).join(" / ");
}

function latestHoleText(holes: any[], teamNames: any) {
  const latest = [...holes]
    .reverse()
    .find((h: any) => h.status && h.status !== "pending");

  if (!latest) return "No holes scored yet";

  if (latest.status === "as") return "Hole " + latest.hole + " halved";

  if (latest.status === "red") {
    return (teamNames?.Red || "Red") + " won Hole " + latest.hole;
  }

  if (latest.status === "blue") {
    return (teamNames?.Blue || "Blue") + " won Hole " + latest.hole;
  }

  return "Hole " + latest.hole + " updated";
}

function displayMatchMain(result: any, teamNames: any) {
  if (!result.leader) return result.main;

  const label =
    teamNames?.[result.leader === "red" ? "Red" : "Blue"] ||
    result.leader.toUpperCase();

  return result.main.replace(result.leader.toUpperCase(), label.toUpperCase());
}


function compactMatchScore(result: any) {
  if (!result?.leader) return "A/S";

  return String(result.main || "")
    .replace(/TEAM\s+RED\s*/i, "")
    .replace(/TEAM\s+BLUE\s*/i, "")
    .replace(/RED\s*/i, "")
    .replace(/BLUE\s*/i, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

export default function Home({
  setScreen,
  dayConfigs,
  days,
  players,
  activeDay,
  setActiveDay,
  totals,
  openMatch,
  teamLogos,
  teamNames,
  roster,
  states,
}: any) {
  const [liveExpanded, setLiveExpanded] = useState(true);

  const day = dayConfigs[activeDay];
  const count = matchCount(players, day.format);

  const matchCards = Array.from({ length: count }, (_, i) => {
    const stateKey = keyFor(activeDay, i);
    const holes = states?.[stateKey] || blankHoles();
    const result = getResult(holes);
    const match = playersForMatch(roster, players, day.format, i);
    const holesPlayed = holes.filter((h: any) => h.status !== "pending").length;
    const holesToPlay = Math.max(0, 18 - holesPlayed);

    return {
      index: i,
      label: "Match " + (i + 1),
      holes,
      result,
      match,
      holesPlayed,
      holesToPlay,
      redNames: namesFor(match.red),
      blueNames: namesFor(match.blue),
      main: displayMatchMain(result, teamNames),
      sub: result.sub,
      latest: latestHoleText(holes, teamNames),
    };
  });

  return (
    <div className="relative flex-1 overflow-y-auto pb-[96px]">
      <div className="flex justify-center pt-2">
        <img
          src="/launch-logo.png"
          alt="DUEL"
          className={cx(
            "w-auto object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.75)] transition-all duration-500",
            liveExpanded ? "h-[34px]" : "h-[28px]"
          )}
        />
      </div>

      <div
        className={cx(
          "px-2 transition-all duration-500",
          liveExpanded ? "mt-16" : "mt-5"
        )}
      >
        {!liveExpanded && (
          <div className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.24em] text-white/52">
            {day.label} • {day.course || "St Michaels"} • {day.tee} Tee
          </div>
        )}

        {liveExpanded ? (
          <div className="mx-auto min-h-[525px] w-full max-w-[350px] transition-all duration-500">
            <div className="grid grid-cols-2 items-start gap-7">
              <button
                type="button"
                onClick={() => setScreen("rosterP")}
                className="text-center"
              >
                <Logo
                  team="red"
                  size="mx-auto h-28 w-28"
                  src={teamLogos?.Red}
                />

                <div
                  className="mt-16 text-[112px] font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)] transition-all duration-500"
                  style={{
                    fontFamily:
                      'Impact, "Arial Narrow", "Arial Black", sans-serif',
                    transform: "scaleY(1.22) scaleX(0.84)",
                  }}
                >
                  {formatScore(totals.official.red)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScreen("rosterB")}
                className="text-center"
              >
                <Logo
                  team="blue"
                  size="mx-auto h-28 w-28"
                  src={teamLogos?.Blue}
                />

                <div
                  className="mt-16 text-[112px] font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)] transition-all duration-500"
                  style={{
                    fontFamily:
                      'Impact, "Arial Narrow", "Arial Black", sans-serif',
                    transform: "scaleY(1.22) scaleX(0.84)",
                  }}
                >
                  {formatScore(totals.official.blue)}
                </div>
              </button>
            </div>

            <div className="mt-2 flex flex-col items-center justify-center transition-all duration-500">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d1c79f]">
                LIVE
              </div>

              <div className="mt-2 rounded-full border border-[#d1c79f]/20 bg-black/50 px-6 py-3 text-center shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-500">
                <span className="text-[28px] font-black">
                  {formatScore(totals.live.red)}
                </span>

                <span className="mx-3 text-white/35">-</span>

                <span className="text-[28px] font-black">
                  {formatScore(totals.live.blue)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLiveExpanded((value) => !value)}
                className="mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#d1c79f]/25 bg-black/42 text-[#efe6bf] shadow-[0_10px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all active:scale-95"
                aria-label="Show live matches"
              >
                <span className="translate-y-[-1px] text-[22px] leading-none">
                  ⌄
                </span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto grid w-full max-w-[520px] grid-cols-[1fr_auto_1fr] items-end gap-3 transition-all duration-500">
              <button
                type="button"
                onClick={() => setScreen("rosterP")}
                className="text-center"
              >
                <Logo
                  team="red"
                  size="mx-auto h-16 w-16"
                  src={teamLogos?.Red}
                />

                <div className="mt-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-white/55">
                  {teamNames?.Red || "Team Red"}
                </div>

                <div
                  className="mt-0.5 text-[54px] font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)] transition-all duration-500"
                  style={{
                    fontFamily:
                      'Impact, "Arial Narrow", "Arial Black", sans-serif',
                    transform: "scaleY(1.1) scaleX(0.86)",
                  }}
                >
                  {formatScore(totals.official.red)}
                </div>
              </button>

              <div className="mb-3 flex flex-col items-center justify-center">
                <div className="text-[8px] font-black uppercase tracking-[0.22em] text-[#d1c79f]">
                  LIVE
                </div>

                <div className="mt-1.5 rounded-full border border-[#d1c79f]/20 bg-black/50 px-3 py-1.5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  <span className="text-[14px] font-black">
                    {formatScore(totals.live.red)}
                  </span>

                  <span className="mx-2 text-white/35">-</span>

                  <span className="text-[14px] font-black">
                    {formatScore(totals.live.blue)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLiveExpanded((value) => !value)}
                  className="mt-2 flex h-7 w-7 rotate-180 items-center justify-center rounded-full border border-[#d1c79f]/25 bg-black/42 text-[#efe6bf] shadow-[0_10px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all active:scale-95"
                  aria-label="Show headline score"
                >
                  <span className="translate-y-[-1px] text-[18px] leading-none">
                    ⌄
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setScreen("rosterB")}
                className="text-center"
              >
                <Logo
                  team="blue"
                  size="mx-auto h-16 w-16"
                  src={teamLogos?.Blue}
                />

                <div className="mt-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-white/55">
                  {teamNames?.Blue || "Team Blue"}
                </div>

                <div
                  className="mt-0.5 text-[54px] font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)] transition-all duration-500"
                  style={{
                    fontFamily:
                      'Impact, "Arial Narrow", "Arial Black", sans-serif',
                    transform: "scaleY(1.1) scaleX(0.86)",
                  }}
                >
                  {formatScore(totals.official.blue)}
                </div>
              </button>
            </div>

            <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-[#d1c79f]/45 to-transparent" />

          </>
        )}
      </div>

      {!liveExpanded && (
        <div className="mt-2 px-1">
          <DayButtons
            dayConfigs={dayConfigs}
            days={days}
            active={activeDay}
            setActive={setActiveDay}
          />

          <div className="mb-3 px-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
            Live Matches
          </div>

          <div className="space-y-2.5">
            {matchCards.map((matchCard) => {
              const isRedLeader = matchCard.result.leader === "red";
              const isBlueLeader = matchCard.result.leader === "blue";
              const isAllSquare = !matchCard.result.leader;
              const heroScore = compactMatchScore(matchCard.result);

              return (
                <button
                  key={matchCard.label}
                  type="button"
                  onClick={() => openMatch(matchCard.index)}
                  className={cx(
                    "relative w-full overflow-hidden rounded-[20px] border px-4 py-3 text-left shadow-[0_12px_30px_rgba(0,0,0,0.48)] backdrop-blur-xl transition-all active:scale-[0.99]",
                    isRedLeader
                      ? "border-white/68 bg-[#320611]"
                      : isBlueLeader
                      ? "border-white/68 bg-[#0a142b]"
                      : "border-white/48 bg-gradient-to-r from-[#111311]/96 via-[#0b0d10]/98 to-[#090909]/99"
                  )}
                >
                  <div
                    className={cx(
                      "pointer-events-none absolute inset-0",
                      isRedLeader
                        ? "bg-[linear-gradient(90deg,rgba(0,0,0,0.06),transparent_36%,rgba(255,255,255,0.08)_68%,rgba(255,255,255,0.14)_100%)]"
                        : isBlueLeader
                        ? "bg-[linear-gradient(90deg,rgba(0,0,0,0.2),transparent_38%,rgba(255,255,255,0.035))]"
                        : "bg-[linear-gradient(90deg,rgba(255,255,255,0.025),transparent_42%,rgba(255,255,255,0.015))]"
                    )}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="max-w-[220px] text-[9px] font-black uppercase leading-[1.25] tracking-[0.22em] text-white">
                        {matchCard.label} • {day.format}
                      </div>

                      <div className="rounded-full bg-gradient-to-b from-[#f0d175] via-[#d6a936] to-[#a96f18] px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.14em] text-black shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
                        ⚑ Hole {Math.max(1, matchCard.holesPlayed + 1)}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-[0.82fr_1.02fr_0.82fr] items-center gap-2">
                      <div className="min-w-0 text-left">
                        <div
                          className={cx(
                            "whitespace-pre-line text-[14px] font-semibold uppercase leading-[1.05] tracking-[0.01em]",
                            isRedLeader ? "text-[#ff3a46]" : "text-red-100/92"
                          )}
                        >
                          {matchCard.redNames.replaceAll(" / ", "\n&\n")}
                        </div>
                      </div>

                      <div className="min-w-0 text-center">
                        <div
                          className={cx(
                            "font-black uppercase leading-[0.76] tracking-[0.02em]",
                            isRedLeader
                              ? "text-[#ff3a46]"
                              : isBlueLeader
                              ? "text-[#5f95ff]"
                              : "text-white"
                          )}
                          style={{
                            fontFamily:
                              'Impact, "Arial Narrow", "Arial Black", sans-serif',
                            fontSize: isAllSquare ? "32px" : "54px",
                            letterSpacing: isAllSquare ? "0.03em" : "0.02em",
                          }}
                        >
                          {heroScore}
                        </div>
                      </div>

                      <div className="min-w-0 text-right">
                        <div
                          className={cx(
                            "whitespace-pre-line text-[14px] font-semibold uppercase leading-[1.05] tracking-[0.01em]",
                            isBlueLeader ? "text-[#5f95ff]" : "text-blue-100/92"
                          )}
                        >
                          {matchCard.blueNames.replaceAll(" / ", "\n&\n")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-center text-[8px] font-black uppercase tracking-[0.18em] text-white/85">
                      {matchCard.latest}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

