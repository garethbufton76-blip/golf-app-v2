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

        <div
          className={cx(
            "mx-auto grid w-full max-w-[720px] grid-cols-[1fr_auto_1fr] items-center transition-all duration-500",
            liveExpanded ? "gap-6 min-h-[405px]" : "gap-3"
          )}
        >
          <button
            type="button"
            onClick={() => setScreen("rosterP")}
            className="text-center"
          >
            <Logo
              team="red"
              size={liveExpanded ? "mx-auto h-28 w-28" : "mx-auto h-20 w-20"}
              src={teamLogos?.Red}
            />

            {!liveExpanded && (
              <div className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/60">
                {teamNames?.Red || "Team Red"}
              </div>
            )}

            <div
              className={cx(
                "font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)] transition-all duration-500",
                liveExpanded ? "mt-14 text-[112px]" : "mt-1 text-[74px]"
              )}
              style={{
                fontFamily: 'Impact, "Arial Narrow", "Arial Black", sans-serif',
                transform: liveExpanded
                  ? "scaleY(1.22) scaleX(0.84)"
                  : "scaleY(1.12) scaleX(0.86)",
              }}
            >
              {formatScore(totals.official.red)}
            </div>
          </button>

          <div
            className={cx(
              "flex flex-col items-center justify-center transition-all duration-500",
              liveExpanded ? "self-end pb-8" : ""
            )}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d1c79f]">
              LIVE
            </div>

            <div
              className={cx(
                "mt-2 rounded-full border border-[#d1c79f]/20 bg-black/50 text-center shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-500",
                liveExpanded ? "px-6 py-3" : "px-4 py-2"
              )}
            >
              <span
                className={cx(
                  "font-black",
                  liveExpanded ? "text-[28px]" : "text-lg"
                )}
              >
                {formatScore(totals.live.red)}
              </span>

              <span className="mx-3 text-white/35">-</span>

              <span
                className={cx(
                  "font-black",
                  liveExpanded ? "text-[28px]" : "text-lg"
                )}
              >
                {formatScore(totals.live.blue)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLiveExpanded((value) => !value)}
              className={cx(
                "mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#d1c79f]/25 bg-black/42 text-[#efe6bf] shadow-[0_10px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all active:scale-95",
                liveExpanded ? "" : "rotate-180"
              )}
              aria-label={
                liveExpanded ? "Show live matches" : "Show headline score"
              }
            >
              <span className="translate-y-[-1px] text-[22px] leading-none">
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
              size={liveExpanded ? "mx-auto h-28 w-28" : "mx-auto h-20 w-20"}
              src={teamLogos?.Blue}
            />

            {!liveExpanded && (
              <div className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/60">
                {teamNames?.Blue || "Team Blue"}
              </div>
            )}

            <div
              className={cx(
                "font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)] transition-all duration-500",
                liveExpanded ? "mt-14 text-[112px]" : "mt-1 text-[74px]"
              )}
              style={{
                fontFamily: 'Impact, "Arial Narrow", "Arial Black", sans-serif',
                transform: liveExpanded
                  ? "scaleY(1.22) scaleX(0.84)"
                  : "scaleY(1.12) scaleX(0.86)",
              }}
            >
              {formatScore(totals.official.blue)}
            </div>
          </button>
        </div>

        {!liveExpanded && (
          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#d1c79f]/45 to-transparent" />
        )}
      </div>

      {!liveExpanded && (
        <div className="mt-4 px-1">
          <DayButtons
            dayConfigs={dayConfigs}
            days={days}
            active={activeDay}
            setActive={setActiveDay}
          />

          <div className="mb-3 px-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
            Live Matches
          </div>

          <div className="space-y-3">
            {matchCards.map((matchCard) => (
              <button
                key={matchCard.label}
                type="button"
                onClick={() => openMatch(matchCard.index)}
                className={cx(
                  "w-full overflow-hidden rounded-[22px] border p-4 text-left shadow-[0_14px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl",
                  matchCard.result.leader === "red"
                    ? "border-red-300/18 bg-gradient-to-r from-[#68171d]/92 via-[#241316]/94 to-[#0b1018]/94"
                    : matchCard.result.leader === "blue"
                    ? "border-blue-300/18 bg-gradient-to-r from-[#0b1018]/94 via-[#13233f]/94 to-[#173f73]/86"
                    : "border-white/10 bg-gradient-to-r from-[#1d1d22]/88 via-[#101318]/94 to-[#111827]/90"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/42">
                      {matchCard.label} • {day.format}
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-black uppercase tracking-[0.08em] text-red-100/85">
                          {matchCard.redNames}
                        </div>

                        <div className="mt-1 truncate text-[12px] font-black uppercase tracking-[0.08em] text-blue-100/85">
                          {matchCard.blueNames}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-[17px] font-black uppercase tracking-[0.06em] text-white">
                          {matchCard.main}
                        </div>

                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                          {matchCard.holesPlayed} thru •{" "}
                          {matchCard.holesToPlay} to play
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white/52">
                  <span className="truncate">{matchCard.latest}</span>
                  <span className="shrink-0">{matchCard.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
