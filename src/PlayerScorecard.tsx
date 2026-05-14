import { Logo } from "./data";

export default function PlayerScorecard({
  cardPlayer,
  close,
  day,
  teamLogos,
  playerScorecardRows,
}: any) {
  const { p, team } = cardPlayer;

  const isBlue = team === "blue";

  const accent = isBlue ? "#173f94" : "#8f070d";
  const accentBright = isBlue ? "#2557c8" : "#c50812";
  const accentDeep = isBlue ? "#061733" : "#250304";
  const bgImage = isBlue ? "/roster-blue-bg.jpg" : "/roster-red-bg.jpg";
  const teamName = isBlue ? "BLUE TEAM" : "RED TEAM";
  const teamLogo = teamLogos?.[isBlue ? "Blue" : "Red"] || "";

  const front = playerScorecardRows(p, team, 1, 9);
  const back = playerScorecardRows(p, team, 10, 18);
  const all = [...front, ...back];

  const parTotal = all.reduce(
    (sum: number, h: any) => sum + Number(h.par || 0),
    0
  );

  const grossTotal = all.reduce(
    (sum: number, h: any) => sum + (h.gross == null ? 0 : Number(h.gross)),
    0
  );

  const scoreVsPar = grossTotal ? grossTotal - parTotal : null;

  const scoreLabel =
    scoreVsPar == null
      ? "-"
      : scoreVsPar === 0
      ? "E"
      : scoreVsPar > 0
      ? `+${scoreVsPar}`
      : `${scoreVsPar}`;

  const nameParts = String(p.name || "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

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
                linear-gradient(180deg, rgba(0,0,0,0.16) 0%, ${accentDeep}44 42%, rgba(0,0,0,0.98) 100%)
              `,
            }}
          />

          <div className="absolute right-[-54px] top-[128px] opacity-[0.10]">
            <Logo team={team} size="h-[220px] w-[220px]" src={teamLogo} />
          </div>

          {p.photo ? (
            <>
              <img
                src={p.photo}
                alt=""
                className="absolute right-[-24px] top-[10px] h-[52%] w-[68%] object-cover object-top opacity-95 drop-shadow-[0_30px_50px_rgba(0,0,0,0.78)]"
              />
              <div className="absolute right-0 top-[39%] h-[18%] w-[72%] bg-gradient-to-b from-transparent via-black/20 to-black/80" />
            </>
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/8 to-black/88" />
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black via-black/96 to-transparent" />
        </div>

        {/* BACK / CLOSE PILL - intentionally small, matching app back pills */}
        <button
          onClick={close}
          className="absolute left-5 top-7 z-20 inline-flex items-center gap-2 rounded-full border border-[#d1c79f]/25 bg-black/38 px-4 py-1.5 text-sm font-semibold text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <span className="text-xl leading-none">‹</span>
          <span>Back</span>
        </button>

        <div className="relative z-10 flex h-full flex-col px-3 pb-3 pt-[118px]">
          {/* PLAYER IDENTITY BLOCK */}
          <div className="flex min-h-[390px] flex-col justify-end px-3 pb-4">
            <div className="mb-4">
              <Logo team={team} size="h-[72px] w-[72px]" src={teamLogo} />
            </div>

            <div
              className="text-[34px] font-black uppercase leading-[0.82] tracking-[-0.055em] text-white drop-shadow-[0_10px_18px_rgba(0,0,0,0.9)]"
              style={{
                fontFamily: 'Impact, "Arial Narrow", "Arial Black", sans-serif',
              }}
            >
              {nameParts.length ? (
                nameParts.map((part) => <div key={part}>{part}</div>)
              ) : (
                <div>PLAYER</div>
              )}
            </div>

            <div
              className="mt-3 h-[2px] w-[108px]"
              style={{ backgroundColor: accentBright }}
            />

            <div className="mt-3 space-y-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-white">
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
                <span>HCP {p.handicap}</span>
              </div>
            </div>
          </div>

          {/* SCORECARD PANEL */}
          <div className="mt-auto overflow-hidden rounded-[18px] border border-white/18 bg-black/90 shadow-[0_24px_55px_rgba(0,0,0,0.78)] backdrop-blur-xl">
            <NineScoreTable title="FRONT" rows={front} accent={accent} />
            <NineScoreTable title="BACK" rows={back} accent={accent} />

            <div
              className="grid grid-cols-3 items-center px-3 py-2.5 text-center text-white"
              style={{ backgroundColor: accent }}
            >
              <Summary label="Par" value={parTotal} />
              <Summary label="Total" value={grossTotal || "-"} bordered />
              <Summary label="To Par" value={scoreLabel} />
            </div>

            <div className="grid grid-cols-4 gap-1 bg-black px-2 py-2 text-[6px] font-bold uppercase tracking-[0.06em] text-white/70">
              <Legend icon="◎" label="Eagle+" />
              <Legend icon="○" label="Birdie" />
              <Legend icon="□" label="Bogey" />
              <Legend icon="▣" label="Double+" />
            </div>
          </div>

          <div className="mt-2 text-center text-[9px] font-black uppercase tracking-[0.22em] text-white/55">
            {teamName} • {day.format}
          </div>
        </div>
      </div>
    </div>
  );
}

function NineScoreTable({ title, rows, accent }: any) {
  const parTotal = rows.reduce(
    (sum: number, h: any) => sum + Number(h.par || 0),
    0
  );

  const grossTotal = rows.reduce(
    (sum: number, h: any) => sum + (h.gross == null ? 0 : Number(h.gross)),
    0
  );

  const pointsTotal = rows.reduce(
    (sum: number, h: any) => sum + (h.points == null ? 0 : Number(h.points)),
    0
  );

  return (
    <div>
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

      <div className="grid grid-cols-[42px_repeat(9,1fr)_36px] border-b border-white/5 bg-[#262626] px-1 py-2 text-center text-[10px] font-black text-white/55">
        <div className="text-left uppercase">Par</div>
        {rows.map((h: any) => (
          <div key={h.hole}>{h.par}</div>
        ))}
        <div>{parTotal}</div>
      </div>

      <div className="grid grid-cols-[42px_repeat(9,1fr)_36px] border-b border-white/5 bg-[#1d1d1d] px-1 py-2 text-center text-[10px] font-black text-white">
        <div className="text-left uppercase">Score</div>
        {rows.map((h: any) => (
          <div key={h.hole} className="flex items-center justify-center">
            <ScoreMark gross={h.gross} par={h.par} />
          </div>
        ))}
        <div>{grossTotal || "-"}</div>
      </div>

      <div className="grid grid-cols-[42px_repeat(9,1fr)_36px] bg-[#171717] px-1 py-2 text-center text-[10px] font-black text-[#d1a354]">
        <div className="text-left uppercase">STB</div>
        {rows.map((h: any) => (
          <div key={h.hole}>{h.points == null ? "-" : h.points}</div>
        ))}
        <div>{pointsTotal || "-"}</div>
      </div>
    </div>
  );
}

function ScoreMark({ gross, par }: any) {
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

function Summary({ label, value, bordered = false }: any) {
  return (
    <div className={bordered ? "border-x border-white/20" : ""}>
      <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-65">
        {label}
      </div>

      <div className="mt-0.5 text-[22px] font-black leading-none">
        {value}
      </div>
    </div>
  );
}

function Legend({ icon, label }: any) {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-red-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
