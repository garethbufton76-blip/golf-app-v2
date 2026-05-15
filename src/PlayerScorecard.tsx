import { useState } from "react";
import { Logo } from "./data";

type ScoreMode = "gross" | "net";

export default function PlayerScorecard({
  cardPlayer,
  close,
  day,
  teamLogos,
  playerScorecardRows,
}: any) {
  const { p, team } = cardPlayer;

  const playersForCard =
    Array.isArray(cardPlayer.players) && cardPlayer.players.length > 0
      ? cardPlayer.players
      : [p];

  const [scoreMode, setScoreMode] = useState<ScoreMode>("gross");
  const [individualPlayer, setIndividualPlayer] = useState<any>(null);

  const isBlue = team === "blue";
  const isDoubleFormat =
    playersForCard.length > 1 &&
    /ambrose|better ball|foursomes|chapman|pinehurst|greensomes|pairs|2-ball|fourball|4bbb/i.test(
      day.format || ""
    );

  const showingTeamCard = isDoubleFormat && !individualPlayer;
  const activePlayer = individualPlayer || p;

  const accent = isBlue ? "#173f94" : "#8f070d";
  const accentBright = isBlue ? "#2557c8" : "#c50812";
  const accentDeep = isBlue ? "#061733" : "#250304";

  const bgImage = isBlue ? "/roster-blue-bg.jpg" : "/roster-red-bg.jpg";
  const teamName = isBlue ? "BLUE TEAM" : "RED TEAM";
  const teamLogo = teamLogos?.[isBlue ? "Blue" : "Red"] || "";
  const showStableford = /stableford|stb|points/i.test(day.format || "");

  function rowsForPlayer(player: any, from: number, to: number) {
    return playerScorecardRows(player, team, from, to);
  }

  function combinedRows(from: number, to: number) {
    const allPlayerRows = playersForCard.map((player: any) =>
      rowsForPlayer(player, from, to)
    );

    const baseRows = allPlayerRows[0] || [];

    return baseRows.map((base: any, index: number) => {
      const sameHoleRows = allPlayerRows.map((r: any[]) => r[index]);

      const grossValues = sameHoleRows
        .map((r: any) => r?.gross)
        .filter((v: any) => v != null)
        .map(Number);

      const netValues = sameHoleRows
        .map((r: any) => r?.net)
        .filter((v: any) => v != null)
        .map(Number);

      const pointValues = sameHoleRows
        .map((r: any) => r?.points)
        .filter((v: any) => v != null)
        .map(Number);

      return {
        ...base,
        gross: grossValues.length ? Math.min(...grossValues) : null,
        net: netValues.length ? Math.min(...netValues) : null,
        points: pointValues.length ? Math.max(...pointValues) : null,
      };
    });
  }

  const front = showingTeamCard
    ? combinedRows(1, 9)
    : rowsForPlayer(activePlayer, 1, 9);

  const back = showingTeamCard
    ? combinedRows(10, 18)
    : rowsForPlayer(activePlayer, 10, 18);

  const all = [...front, ...back];

  const played = all.filter((h: any) => h.gross != null);

  const parPlayed = played.reduce(
    (sum: number, h: any) => sum + Number(h.par || 0),
    0
  );

  const scoreTotal = played.reduce((sum: number, h: any) => {
    const value = scoreMode === "net" ? h.net : h.gross;
    return sum + Number(value || 0);
  }, 0);

  const scoreVsPar = played.length ? scoreTotal - parPlayed : null;

  const scoreLabel =
    scoreVsPar == null
      ? "-"
      : scoreVsPar === 0
      ? "E"
      : scoreVsPar > 0
      ? `+${scoreVsPar}`
      : `${scoreVsPar}`;

  function namePartsFor(player: any) {
    return String(player?.name || "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2);
  }

  const titleNameParts = showingTeamCard
    ? []
    : namePartsFor(activePlayer);

  async function shareCard() {
    const names = showingTeamCard
      ? playersForCard.map((player: any) => player.name).join(" & ")
      : activePlayer.name;

    const text = `${names} • ${teamName} • ${day.format}`;

    if (navigator.share) {
      await navigator.share({
        title: "DUEL Scorecard",
        text,
      });
    }
  }

  const bottomModeLabel = scoreMode === "gross" ? "Gross" : "Net";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-2">
      <div className="relative h-[94vh] w-full max-w-[390px] overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl">
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 76% 22%, ${accentBright}33, transparent 32%),
                radial-gradient(circle at 28% 34%, rgba(255,255,255,0.08), transparent 24%),
                linear-gradient(
                  180deg,
                  rgba(0,0,0,0.16) 0%,
                  ${accentDeep}44 42%,
                  rgba(0,0,0,0.98) 100%
                )
              `,
            }}
          />

          <div className="absolute right-[-54px] top-[128px] opacity-[0.10]">
            <Logo
              team={team}
              size="h-[220px] w-[220px]"
              src={teamLogo}
            />
          </div>

          {!showingTeamCard && activePlayer?.photo ? (
            <img
              src={activePlayer.photo}
              alt=""
              className="absolute right-[-18px] top-[-8px] h-[50%] w-[66%] object-cover object-top opacity-95 drop-shadow-[0_30px_50px_rgba(0,0,0,0.78)]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 80%, rgba(0,0,0,0.65) 91%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 80%, rgba(0,0,0,0.65) 91%, transparent 100%)",
              }}
            />
          ) : null}

          {showingTeamCard ? (
            <DoublesHeroBackground
              players={playersForCard}
              team={team}
              teamLogo={teamLogo}
              onPlayerClick={setIndividualPlayer}
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/8 to-black/88" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/92 to-transparent" />
        </div>

        {/* DUEL LOGO */}
        <img
          src="/launch-logo.png"
          alt="DUEL"
          className={
            showingTeamCard
              ? "absolute left-1/2 top-7 z-20 h-[54px] -translate-x-1/2 object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)]"
              : "absolute left-5 top-7 z-20 h-[34px] object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)]"
          }
        />

        {/* TEAM LOGO FOR DOUBLE CARD */}
        {showingTeamCard ? (
          <div className="absolute left-1/2 top-[104px] z-20 -translate-x-1/2">
            <button
              onClick={() => setIndividualPlayer(null)}
              className="block"
            >
              <Logo
                team={team}
                size="h-[72px] w-[72px]"
                src={teamLogo}
              />
            </button>
          </div>
        ) : null}

        {/* CONTENT */}
        <div
          className={
            showingTeamCard
              ? "relative z-10 flex h-full flex-col px-3 pb-[72px] pt-[360px]"
              : "relative z-10 flex h-full flex-col px-3 pb-[72px] pt-[102px]"
          }
        >
          {!showingTeamCard ? (
            <div className="flex min-h-[220px] flex-col justify-end px-3 pb-2">
              <div className="mb-3">
                <Logo
                  team={team}
                  size="h-[72px] w-[72px]"
                  src={teamLogo}
                />
              </div>

              <div
                className="text-[34px] font-black uppercase leading-[0.86] tracking-[0.015em] text-white drop-shadow-[0_10px_18px_rgba(0,0,0,0.9)]"
                style={{
                  fontFamily:
                    'Impact, "Arial Narrow", "Arial Black", sans-serif',
                }}
              >
                {titleNameParts.length ? (
                  titleNameParts.map((part) => (
                    <div key={part}>{part}</div>
                  ))
                ) : (
                  <div>PLAYER</div>
                )}
              </div>

              <div
                className="mt-3 h-[2px] w-[108px]"
                style={{ backgroundColor: accentBright }}
              />

              <div className="mt-3 space-y-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-white">
                <MetaLines day={day} handicap={activePlayer.handicap} />
              </div>
            </div>
          ) : (
            <div className="mb-3 grid grid-cols-2 gap-3 px-3">
              {playersForCard.slice(0, 2).map((player: any) => {
                const parts = namePartsFor(player);

                return (
                  <button
                    key={player.name}
                    onClick={() => setIndividualPlayer(player)}
                    className="text-left"
                  >
                    <div
                      className="text-[28px] font-black uppercase leading-[0.86] tracking-[0.015em] text-white drop-shadow-[0_10px_18px_rgba(0,0,0,0.9)]"
                      style={{
                        fontFamily:
                          'Impact, "Arial Narrow", "Arial Black", sans-serif',
                      }}
                    >
                      {parts.map((part) => (
                        <div key={part}>{part}</div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* SCORECARD */}
          <div className="mt-5 overflow-hidden rounded-[18px] border border-white/18 bg-black/90 shadow-[0_24px_55px_rgba(0,0,0,0.78)] backdrop-blur-xl">
            <NineScoreTable
              title="FRONT"
              rows={front}
              accent={accent}
              scoreMode={scoreMode}
              showStableford={showStableford}
            />

            <NineScoreTable
              title="BACK"
              rows={back}
              accent={accent}
              scoreMode={scoreMode}
              showStableford={showStableford}
            />

            {/* TOTALS */}
            <div
              className="grid grid-cols-3 items-center px-3 py-3 text-center text-white"
              style={{ backgroundColor: accent }}
            >
              <Summary
                label="Par"
                value={played.length ? parPlayed : "-"}
              />

              <Summary
                label={scoreMode === "net" ? "Net" : "Gross"}
                value={played.length ? scoreTotal : "-"}
                bordered
              />

              <Summary
                label="To Par"
                value={scoreLabel}
              />
            </div>

            {/* LEGEND */}
            <div className="grid grid-cols-4 gap-1 bg-black px-2 py-2 text-[6px] font-bold uppercase tracking-[0.06em] text-white/70">
              <Legend icon="◎" label="Eagle+" />
              <Legend icon="○" label="Birdie" />
              <Legend icon="□" label="Bogey" />
              <Legend icon="▣" label="Double+" />
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-2 text-center text-[9px] font-black uppercase tracking-[0.22em] text-white/55">
            {teamName} • {day.format}
          </div>
        </div>

        {/* BOTTOM PILLS */}
        <div className="absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-30 grid grid-cols-3 gap-2">
          <button
            onClick={individualPlayer ? () => setIndividualPlayer(null) : close}
            className="rounded-full border border-[#d1c79f]/25 bg-black/45 px-3 py-2 text-[12px] font-bold text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            ‹ {individualPlayer ? "Team" : "Back"}
          </button>

          <button
            onClick={shareCard}
            className="rounded-full border border-[#d1c79f]/25 bg-black/45 px-3 py-2 text-[12px] font-bold text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            Share
          </button>

          <button
            onClick={() =>
              setScoreMode((m) => (m === "gross" ? "net" : "gross"))
            }
            className="rounded-full border border-[#d1c79f]/25 bg-black/45 px-3 py-2 text-[12px] font-bold text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            {bottomModeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DoublesHeroBackground({
  players,
  team,
  teamLogo,
  onPlayerClick,
}: any) {
  const left = players[0];
  const right = players[1];

  return (
    <>
      <div className="absolute left-1/2 top-0 z-[9] h-[48%] w-[3px] -translate-x-1/2 bg-black/80" />

      {left?.photo ? (
        <button
          onClick={() => onPlayerClick(left)}
          className="absolute left-[-14px] top-[-10px] z-[8] h-[48%] w-[55%]"
        >
          <img
            src={left.photo}
            alt=""
            className="h-full w-full object-cover object-top opacity-95 drop-shadow-[0_30px_50px_rgba(0,0,0,0.78)]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.62) 90%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.62) 90%, transparent 100%)",
            }}
          />
        </button>
      ) : null}

      {right?.photo ? (
        <button
          onClick={() => onPlayerClick(right)}
          className="absolute right-[-14px] top-[-10px] z-[8] h-[48%] w-[55%]"
        >
          <img
            src={right.photo}
            alt=""
            className="h-full w-full object-cover object-top opacity-95 drop-shadow-[0_30px_50px_rgba(0,0,0,0.78)]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.62) 90%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.62) 90%, transparent 100%)",
            }}
          />
        </button>
      ) : null}
    </>
  );
}

function MetaLines({ day, handicap }: any) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="text-[#d1a354]">▣</span>
        <span>{day.label.toUpperCase()}</span>
        <span className="text-[#d1a354]">•</span>
        <span>{(day.course || "ST MICHAELS").toUpperCase()}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="text-[#d1a354]">⚑</span>
        <span>{day.tee.toUpperCase()} TEE</span>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="text-[#d1a354]">♙</span>
        <span>HCP {handicap}</span>
      </div>
    </>
  );
}

function NineScoreTable({
  title,
  rows,
  accent,
  scoreMode,
  showStableford,
}: any) {
  const parTotal = rows.reduce(
    (sum: number, h: any) => sum + Number(h.par || 0),
    0
  );

  const scoreTotal = rows.reduce((sum: number, h: any) => {
    if (h.gross == null) return sum;

    const value = scoreMode === "net" ? h.net : h.gross;
    return sum + Number(value || 0);
  }, 0);

  const pointsTotal = rows.reduce(
    (sum: number, h: any) =>
      sum + (h.points == null ? 0 : Number(h.points)),
    0
  );

  return (
    <div>
      {/* HEADER */}
      <div
        className="grid grid-cols-[42px_repeat(9,1fr)_36px] px-1 py-1.5 text-center text-[7px] font-black uppercase text-white"
        style={{ backgroundColor: accent }}
      >
        <div>Hole</div>

        {rows.map((h: any) => (
          <div key={h.hole}>{h.hole}</div>
        ))}

        <div>{title}</div>
      </div>

      {/* PAR */}
      <div className="grid grid-cols-[42px_repeat(9,1fr)_36px] border-b border-white/5 bg-[#262626] px-1 py-1.5 text-center text-[10px] font-black text-white/55">
        <div className="text-left uppercase">Par</div>

        {rows.map((h: any) => (
          <div key={h.hole}>{h.par}</div>
        ))}

        <div>{parTotal}</div>
      </div>

      {/* SCORE */}
      <div className="grid grid-cols-[42px_repeat(9,1fr)_36px] border-b border-white/5 bg-[#1d1d1d] px-1 py-1.5 text-center text-[10px] font-black text-white">
        <div className="text-left uppercase">
          {scoreMode === "net" ? "Net" : "Score"}
        </div>

        {rows.map((h: any) => {
          const value =
            h.gross == null ? null : scoreMode === "net" ? h.net : h.gross;

          return (
            <div
              key={h.hole}
              className="flex items-center justify-center"
            >
              <ScoreMark
                gross={value}
                par={h.par}
              />
            </div>
          );
        })}

        <div>{scoreTotal || "-"}</div>
      </div>

      {/* STB */}
      {showStableford && (
        <div className="grid grid-cols-[42px_repeat(9,1fr)_36px] bg-[#171717] px-1 py-1.5 text-center text-[10px] font-black text-[#d1a354]">
          <div className="text-left uppercase">STB</div>

          {rows.map((h: any) => (
            <div key={h.hole}>
              {h.points == null ? "-" : h.points}
            </div>
          ))}

          <div>{pointsTotal || "-"}</div>
        </div>
      )}
    </div>
  );
}

function ScoreMark({
  gross,
  par,
}: any) {
  if (gross == null) return <span>-</span>;

  const diff = Number(gross) - Number(par);

  if (diff <= -2) {
    return (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-red-500 text-[9px] font-black text-white shadow-[0_0_10px_rgba(239,68,68,0.45)]">
        {gross}
      </span>
    );
  }

  if (diff === -1) {
    return (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-red-500 text-[9px] font-black text-white">
        {gross}
      </span>
    );
  }

  if (diff === 1) {
    return (
      <span className="flex h-[18px] w-[18px] items-center justify-center border-2 border-white/55 text-[9px] font-black text-white">
        {gross}
      </span>
    );
  }

  if (diff >= 2) {
    return (
      <span className="flex h-[18px] w-[18px] items-center justify-center border-[3px] border-white/55 text-[9px] font-black text-white">
        {gross}
      </span>
    );
  }

  return <span>{gross}</span>;
}

function Summary({
  label,
  value,
  bordered = false,
}: any) {
  return (
    <div className={bordered ? "border-x border-white/20" : ""}>
      <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-65">
        {label}
      </div>

      <div className="mt-0.5 text-[26px] font-black leading-none">
        {value}
      </div>
    </div>
  );
}

function Legend({
  icon,
  label,
}: any) {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-red-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
