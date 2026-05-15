// src/QuickGame.tsx

import { useState } from "react";
import { panel } from "./data";

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

  function updatePlayer(team: "red" | "blue", index: number, key: string, value: any) {
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
      name: p.name,
      handicap: Number(p.handicap || 0),
      team: "red",
      rosterIndex: i,
      photo: "",
    }));

    const blue = bluePlayers.slice(0, playersPerTeam).map((p, i) => ({
      id: `quick-blue-${i}`,
      name: p.name,
      handicap: Number(p.handicap || 0),
      team: "blue",
      rosterIndex: i,
      photo: "",
    }));

    setPlayers(playersPerTeam);

    setTeamNames({
      Red: redName,
      Blue: blueName,
    });

    setRoster({
      red,
      blue,
    });

    setDayConfigs([
      {
        label: "Quick Game",
        teeTime: "",
        course: "St Michaels",
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
    <div className="relative h-full overflow-y-auto bg-black px-4 pb-28 pt-8 text-white">
      <img
        src="/admin-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black" />

      <div className="relative z-10 mx-auto max-w-[430px]">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setScreen("home")}
            className="rounded-full border border-[#d1c79f]/25 bg-black/45 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur-xl"
          >
            ‹ Back
          </button>

          <img
            src="/launch-logo.png"
            alt="DUEL"
            className="h-[42px] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)]"
          />
        </div>

        <div className={`${panel} p-4`}>
          <div className="text-[11px] font-black uppercase tracking-[0.26em] text-[#d1c79f]">
            Quick Game
          </div>

          <h1 className="mt-2 text-[34px] font-black uppercase leading-none">
            Set up & play
          </h1>

          <p className="mt-2 text-sm text-white/65">
            No days. No weekend admin. Just choose the match and go.
          </p>
        </div>

        <Section title="Players per team">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((n) => (
              <button
                key={n}
                onClick={() => setPlayersPerTeam(n)}
                className={`rounded-2xl border px-4 py-4 text-lg font-black ${
                  playersPerTeam === n
                    ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                    : "border-white/15 bg-black/45 text-white"
                }`}
              >
                {n} v {n}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Teams">
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="Red team" value={redName} onChange={setRedName} />
            <TextInput label="Blue team" value={blueName} onChange={setBlueName} />
          </div>
        </Section>

        <Section title="Players">
          <div className="grid grid-cols-2 gap-3">
            <PlayerColumn
              title={redName}
              team="red"
              players={redPlayers}
              count={playersPerTeam}
              updatePlayer={updatePlayer}
            />

            <PlayerColumn
              title={blueName}
              team="blue"
              players={bluePlayers}
              count={playersPerTeam}
              updatePlayer={updatePlayer}
            />
          </div>
        </Section>

        <Section title="Format">
          <div className="grid gap-2">
            {QUICK_FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${
                  format === f
                    ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                    : "border-white/15 bg-black/45 text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Tee">
          <div className="grid grid-cols-4 gap-2">
            {TEES.map((t) => (
              <button
                key={t}
                onClick={() => setTee(t)}
                className={`rounded-2xl border px-2 py-3 text-xs font-black uppercase ${
                  tee === t
                    ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                    : "border-white/15 bg-black/45 text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        <div className="sticky bottom-4 z-30 mt-5">
          <button
            onClick={startQuickGame}
            className="w-full rounded-full bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#8f8256] px-6 py-4 text-lg font-black uppercase tracking-[0.18em] text-black shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className={`${panel} mt-3 p-4`}>
      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
        {title}
      </div>

      {children}
    </div>
  );
}

function TextInput({ label, value, onChange }: any) {
  return (
    <label className="block">
      <div className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/55 px-3 py-3 text-sm font-bold text-white outline-none focus:border-[#d1c79f]"
      />
    </label>
  );
}

function PlayerColumn({ title, team, players, count, updatePlayer }: any) {
  return (
    <div>
      <div
        className={`mb-2 rounded-full px-3 py-1 text-center text-[10px] font-black uppercase tracking-[0.16em] ${
          team === "red" ? "bg-[#661716]" : "bg-[#2a2e46]"
        }`}
      >
        {title}
      </div>

      <div className="space-y-3">
        {players.slice(0, count).map((p: any, i: number) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-2">
            <input
              value={p.name}
              onChange={(e) => updatePlayer(team, i, "name", e.target.value)}
              className="mb-2 w-full rounded-xl bg-black/55 px-3 py-2 text-sm font-bold text-white outline-none"
            />

            <input
              type="number"
              value={p.handicap}
              onChange={(e) => updatePlayer(team, i, "handicap", e.target.value)}
              className="w-full rounded-xl bg-black/55 px-3 py-2 text-sm font-bold text-white outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
