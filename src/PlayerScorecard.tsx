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

  // Matte team colours matched to roster backgrounds
  const accent = isBlue ? "#1f4aa8" : "#9f1720";
  const accentDeep = isBlue ? "#081b49" : "#32070b";
  const accentSoft = isBlue ? "#3a63c7" : "#c62828";
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

  const pointsTotal = all.reduce(
    (sum: number, h: any) => sum + (h.points == null ? 0 : Number(h.points)),
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
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={isBlue ? "/roster-blue-bg.jpg" : "/roster-red-bg.jpg"}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 78% 12%, ${accentSoft}40, transparent 30%),
                radial-gradient(circle at 20% 28%, rgba(255,255,255,0.08), transparent 22%),
                linear-gradient(180deg, rgba(0,0,0,0.20) 0%, ${accentDeep}72 48%, rgba(0,0,0,0.96) 100%)
              `,
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20px 20px, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.03) 11px, transparent 12px),
                radial-gradient(circle at 60px 60px, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.025) 10px, transparent 11px)
              `,
              backgroundSize: "82px 82px",
            }}
          />

          <div className="absolute right-[-52px] top-[82px] opacity-[0.11]">
            <Logo team={team} size="h-[220px] w-[220px]" src={teamLogo} />
          </div>

          {p.photo ? (
            <img
              src={p.photo}
              alt=""
              className="absolute right-[-32px] top-[-44px] h-[58%] w-[76%] object-cover object-top drop-shadow-[0_30px_50px_rgba(0,0,0,0.78)]"
            />
          ) : (
            <div className="absolute right-[16px] top-[74px] h-[258px] w-[220px] rounded-full bg-white/5 blur-2xl" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/86" />
          <div className="absolute inset-x-0 bottom-0 h-[43%] bg-gradient-to-t from-black via-black/96 to-transparent" />
        </div>

        {/* Back pill */}
        <button
          onClick={close}
          className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-[#d1c79f]/25 bg-black/35 px-4 py-1.5 text-sm font-semibold text-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <span className="text-xl leading-none">‹</span>
          <span>Back</span>
        </button>

        <div className="relative z-10 flex h-full flex-col px-3 pb-3 pt-[94px]">
          {/* Player identity */}
          <div className="flex min-h-[232px] flex-col justify-end px-3 pb-2">
            <div className="mb-2">
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
              className="mt-2 h-[2px] w-[108px]"
              style={{ backgroundColor: accentSoft }}
            />

            <div className="mt-2 space-y-1 text-[8px] font-black uppercase tracking-[0.14em] text-white">
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

          {/* Scorecard */}
          <div className="mt-auto overflow-hidden rounded-[18px] border border-white/20 bg-black/90 shadow-[0_24px_55px_rgba(0,0,0,0.78)] backdrop-blur-xl">
            <NineScoreTable title="FRONT" rows={front} accent={accent} />
            <NineScoreTable title="BACK" rows={back} accent={accent} />

            <div
              className="grid grid-cols-3 items-center px-3 py-2 text-center text-white"
              style={{ backgroundColor: accent }}
            >
              <Summary label="Par" value={parTotal} />
              <Summary label="Total" value={grossTotal || "-"} bordered />
              <Summary label="To Par" value={scoreLabel} />
            </div>

            <div className="grid grid-cols-4 gap-1 bg-black px-2 py-1.5 text-[6px] font-bold uppercase tracking-[0.06em] text-white/70">
              <Legend icon="◎" label="Eagle+" />
              <Legend icon="○" label="Birdie" />
              <Legend icon="□" label="Bogey" />
              <Legend icon="▣" label="Double+" />
            </div>
          </div>

          <div className="mt-1.5 text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
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
