// src/QuickGame.tsx

import { useState } from "react";
import { cx } from "./data";

const COURSES = ["St Michaels"];

const QUICK_FORMATS = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "2-Ball Ambrose",
  "Stableford",
  "2-Ball Better Ball Stableford",
];

const TEES = ["Blue", "White", "Gold", "Red"];

export default function QuickGame({
  setScreen,
  setPlayers,
  setTeamNames,
  setRoster,
  setDayConfigs,
  setActiveDay,
  setStartMatch,
  setStates,
  setScorecards,
  setEventStarted,
  setEventLocked,
}: any) {
  const [course, setCourse] = useState("St Michaels");
  const [playersPerTeam, setPlayersPerTeam] = useState(1);
  const [format, setFormat] = useState("Singles Match Play");
  const [tee, setTee] = useState("Blue");

  const [redName, setRedName] = useState("Team Red");
  const [blueName, setBlueName] = useState("Team Blue");

  const [redPlayers, setRedPlayers] = useState([
    { name: "Red 1", handicap: 18 },
    { name: "Red 2", handicap: 18 },
  ]);

  const [bluePlayers, setBluePlayers] = useState([
    { name: "Blue 1", handicap: 18 },
    { name: "Blue 2", handicap: 18 },
  ]);

  function updatePlayer(
    team: "red" | "blue",
    index: number,
    key: string,
    value: any
  ) {
    const setter = team === "red" ? setRedPlayers : setBluePlayers;

    setter((current: any[]) =>
      current.map((p, i) =>
        i === index
          ? {
              ...p,
              [key]: key === "handicap" ? Number(value) : value,
            }
          : p
      )
    );
  }

  function startQuickGame() {
    const red = redPlayers.slice(0, playersPerTeam).map((p, i) => ({
      id: `quick-red-${i}`,
      name: p.name || `Red ${i + 1}`,
      nickname: p.name || `Red ${i + 1}`,
      handicap: Number(p.handicap || 0),
      rawHandicap: Number(p.handicap || 0),
      team: "red",
      teamId: "red",
      rosterIndex: i,
      photo: "",
      homeClub: "",
      preferredTee: tee,
      regular: false,
    }));

    const blue = bluePlayers.slice(0, playersPerTeam).map((p, i) => ({
      id: `quick-blue-${i}`,
      name: p.name || `Blue ${i + 1}`,
      nickname: p.name || `Blue ${i + 1}`,
      handicap: Number(p.handicap || 0),
      rawHandicap: Number(p.handicap || 0),
      team: "blue",
      teamId: "blue",
      rosterIndex: i,
      photo: "",
      homeClub: "",
      preferredTee: tee,
      regular: false,
    }));

    setPlayers(playersPerTeam);

    setTeamNames({
      Red: redName,
      Blue: blueName,
    });

    setRoster({
      Red: red,
      Blue: blue,
    });

    setDayConfigs([
      {
        label: "Quick Game",
        teeTime: "",
        course,
        tee,
        format,
      },
    ]);

    setActiveDay(0);
    setStartMatch(0);
    setStates({});
    setScorecards({});
    setEventStarted(true);
    setEventLocked(true);

    setScreen("score");
  }

  return (
    <div className="relative h-full w-full overflow-y-auto pb-24 text-white">
      <div className="relative z-20 mx-auto max-w-[430px]">
        <div className="mb-3 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.32em] text-[#d1c79f]">
            Quick Game
          </div>

          <h1 className="mt-1 text-[26px] font-black uppercase leading-none text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)]">
            Set Up
          </h1>
        </div>

        <Section title="Course">
          <div className="relative">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#d1c79f]/45 bg-black/55 px-4 py-3 pr-10 text-[13px] font-black uppercase tracking-[0.06em] text-white outline-none backdrop-blur-xl"
            >
              {COURSES.map((c) => (
                <option key={c} value={c} className="bg-black text-white">
                  {c}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#d1c79f]">
              ●
            </div>

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#d1c79f]">
              ▾
            </div>
          </div>
        </Section>

        {/* 1v1 / 2v2 SELECTOR */}
        <div className="mt-3 mb-3 grid grid-cols-2 gap-3">
          {[1, 2].map((n) => {
            const active = playersPerTeam === n;

            return (
              <button
                type="button"
                key={n}
                onClick={() => setPlayersPerTeam(n)}
                className={cx(
                  "relative overflow-hidden rounded-[22px] border px-4 py-3 text-center shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all",
                  active
                    ? "border-[#d1c79f]/80 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#9b8d5c] text-black"
                    : "border-white/12 bg-black/42 text-white"
                )}
              >
                <div className="text-[28px] font-black uppercase leading-none tracking-[-0.04em]">
                  {n}v{n}
                </div>

                <div
                  className={cx(
                    "mt-0.5 text-[7px] font-black uppercase tracking-[0.2em]",
                    active ? "text-black/55" : "text-white/35"
                  )}
                >
                  Players
                </div>
              </button>
            );
          })}
        </div>

        {/* TEAM / PLAYER PANELS */}
        <div className="grid grid-cols-2 gap-3">
          <TeamSetupColumn
            tone="red"
            teamName={redName}
            setTeamName={setRedName}
            players={redPlayers}
            count={playersPerTeam}
            updatePlayer={updatePlayer}
          />

          <TeamSetupColumn
            tone="blue"
            teamName={blueName}
            setTeamName={setBlueName}
            players={bluePlayers}
            count={playersPerTeam}
            updatePlayer={updatePlayer}
          />
        </div>

        <Section title="Tee">
          <div className="grid grid-cols-4 gap-2">
            {TEES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTee(t)}
                className={cx(
                  "rounded-2xl border px-2 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition-all",
                  tee === t
                    ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                    : "border-white/12 bg-black/42 text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Format">
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#d1c79f]/40 bg-black/55 px-4 py-3 pr-10 text-[12px] font-black uppercase tracking-[0.06em] text-white outline-none backdrop-blur-xl"
            >
              {QUICK_FORMATS.map((f) => (
                <option key={f} value={f} className="bg-black text-white">
                  {f}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#d1c79f]">
              ▾
            </div>
          </div>
        </Section>

        <div className="mt-4 flex justify-center pb-6">
          <button
            type="button"
            onClick={startQuickGame}
            className="flex h-[78px] w-[78px] items-center justify-center rounded-full border border-[#d1c79f]/40 bg-gradient-to-b from-[#245438] via-[#163d2b] to-[#071b13] shadow-[0_18px_40px_rgba(0,0,0,0.65),0_0_22px_rgba(42,115,73,0.45)]"
            aria-label="Start quick game"
          >
            <img
              src="/launch-logo.png"
              alt="DUEL"
              className="h-[31px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)]"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamSetupColumn({
  tone,
  teamName,
  setTeamName,
  players,
  count,
  updatePlayer,
}: any) {
  const isRed = tone === "red";

  return (
    <div
      className={cx(
        "rounded-[24px] border p-2.5 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl",
        isRed
          ? "border-[#7a2424]/45 bg-[#250305]/54"
          : "border-[#343957]/55 bg-[#060a16]/56"
      )}
    >
      <div className="mb-2">
        <div
          className={cx(
            "mb-0.5 text-[7px] font-black uppercase tracking-[0.24em]",
            isRed ? "text-red-200/45" : "text-blue-100/45"
          )}
        >
          Team
        </div>

        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className={cx(
            "w-full border-0 bg-transparent p-0 text-[16px] font-black uppercase leading-none text-white outline-none",
            "placeholder:text-white/25"
          )}
        />

        <div
          className={cx(
            "mt-1.5 h-[2px] w-full rounded-full",
            isRed ? "bg-[#661716]" : "bg-[#2a2e46]"
          )}
        />
      </div>

      <div className="space-y-2">
        {players.slice(0, count).map((p: any, i: number) => (
          <div key={i} className="rounded-[18px] border border-white/8 bg-black/34 p-2.5">
            <div className="mb-0.5 text-[7px] font-black uppercase tracking-[0.2em] text-white/32">
              Player {i + 1}
            </div>

            <input
              value={p.name}
              onChange={(e) => updatePlayer(tone, i, "name", e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-[15px] font-black text-white outline-none placeholder:text-white/25"
            />

            <div className="mt-2 grid grid-cols-[1fr_46px] items-end gap-2">
              <div>
                <div className="mb-0.5 text-[7px] font-black uppercase tracking-[0.2em] text-white/32">
                  Handicap
                </div>

                <input
                  type="number"
                  value={p.handicap}
                  onChange={(e) =>
                    updatePlayer(tone, i, "handicap", e.target.value)
                  }
                  className="w-full border-0 bg-transparent p-0 text-[20px] font-black leading-none text-white outline-none"
                />
              </div>

              <div
                className={cx(
                  "rounded-full px-2 py-0.5 text-center text-[7px] font-black uppercase tracking-[0.12em]",
                  isRed ? "bg-[#661716] text-red-100" : "bg-[#2a2e46] text-blue-100"
                )}
              >
                HCP
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mt-3 rounded-[22px] border border-white/10 bg-black/46 p-3 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div className="mb-2 text-[9px] font-black uppercase tracking-[0.24em] text-white/45">
        {title}
      </div>

      {children}
    </div>
  );
}
