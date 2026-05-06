import { useState } from "react";
import {
  Button,
  Logo,
  Select,
  cx,
  dayOptions,
  formats,
  playerOptions,
  rosterMeta,
  tees,
  times,
  validFormats,
} from "./data";

export default function Admin({
  setScreen,
  players,
  setPlayers,
  days,
  setDays,
  dayConfigs,
  setDayConfigs,
  roster,
  setRoster,
  dayLocks,
  setDayLocks,
  teamLogos,
  setTeamLogos,
  teamNames,
  setTeamNames,
}: any) {
  const [adminMode, setAdminMode] = useState("event");
  const [editingTeam, setEditingTeam] = useState("Red");

  const readImageFile = (file: File | undefined, callback: (value: string) => void) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      callback(String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  };

  const setDay = (i: number, field: string, value: any) => {
    if (dayLocks[i]) return;

    setDayConfigs((ds: any[]) =>
      ds.map((d, idx) =>
        idx === i
          ? {
              ...d,
              [field]: value,
            }
          : d
      )
    );
  };

  const changePlayers = (count: number) => {
    setPlayers(count);

    setDayConfigs((ds: any[]) =>
      ds.map((d) =>
        validFormats(count).includes(d.format)
          ? d
          : {
              ...d,
              format: validFormats(count)[0],
            }
      )
    );
  };

  const updatePlayer = (
    team: string,
    index: number,
    field: string,
    value: any
  ) => {
    setRoster((current: any) => ({
      ...current,
      [team]: rosterMeta(
        current[team].map((p: any, i: number) =>
          i === index
            ? {
                ...p,
                [field]: value,
              }
            : p
        )
      ),
    }));
  };

  const shownPlayers = roster[editingTeam].slice(0, players);

  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button
            active={adminMode === "event"}
            onClick={() => setAdminMode("event")}
            className="px-3 py-2 text-xs"
          >
            Event
          </Button>

          <Button
            active={adminMode === "players"}
            onClick={() => setAdminMode("players")}
            className="px-3 py-2 text-xs"
          >
            Players
          </Button>
        </div>

        <button
          onClick={() => setScreen("home")}
          className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold"
        >
          Back
        </button>
      </div>

      {adminMode === "event" ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <AdminPicker
              title="PLAYERS / TEAM"
              options={playerOptions}
              value={players}
              setValue={changePlayers}
            />

            <AdminPicker
              title="COMP DAYS"
              options={dayOptions}
              value={days}
              setValue={setDays}
            />
          </div>

          <div className="mt-3 flex-1 space-y-3 overflow-y-auto pb-3">
            {dayConfigs.slice(0, days).map((day: any, i: number) => {
              const locked = Boolean(dayLocks[i]);

              return (
                <div
                  key={day.label}
                  className={cx(
                    "rounded-[22px] border p-3 backdrop-blur-xl",
                    locked
                      ? "border-[#d1c79f]/35 bg-black/55"
                      : "border-white/15 bg-black/40"
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold tracking-[0.18em] text-white/80">
                        {day.label.toUpperCase()}
                      </div>

                      <div className="mt-1 text-[10px] text-white/45">
                        {locked ? "SETUP LOCKED" : "SETUP OPEN"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setDayLocks((locks: any) => ({
                          ...locks,
                          [i]: !locks[i],
                        }))
                      }
                      className={cx(
                        "flex items-center gap-2 rounded-full border px-2 py-1.5 text-[10px] font-semibold",
                        locked
                          ? "border-[#d1c79f]/45 bg-[#d1c79f]/20 text-[#efe6bf]"
                          : "border-white/15 bg-black/35 text-white/70"
                      )}
                    >
                      {locked ? "LOCKED" : "OPEN"}
                    </button>
                  </div>

                  <div className={cx(locked && "pointer-events-none opacity-45")}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="text-[9px] text-white/50">
                        1ST TEE TIME
                      </div>

                      <Select
                        value={day.teeTime}
                        onChange={(v: any) => setDay(i, "teeTime", v)}
                        options={times}
                        darkMode
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <Label>COURSE</Label>

                        <Select
                          value={day.course}
                          onChange={(v: any) => setDay(i, "course", v)}
                          options={["St Michaels"]}
                        />
                      </div>

                      <div>
                        <Label>TEE</Label>

                        <Select
                          value={day.tee}
                          onChange={(v: any) => setDay(i, "tee", v)}
                          options={tees}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <Label>GAME FORMAT</Label>

                      <Select
                        value={day.format}
                        onChange={(v: any) => setDay(i, "format", v)}
                        options={validFormats(players)}
                      />

                      <div className="mt-2 text-[10px] text-white/45">
                        Only formats valid for the selected team size are shown.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="mt-3 flex-1 overflow-y-auto pb-3">
          <div className="mb-4 rounded-[20px] border border-[#d1c79f]/25 bg-black/40 p-3">
            <div className="mb-2 text-[10px] tracking-[0.18em] text-white/50">
              TEAM SETUP
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <Logo
                  team={editingTeam === "Red" ? "red" : "blue"}
                  size="h-16 w-16"
                  src={teamLogos[editingTeam]}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    readImageFile(e.target.files?.[0], (value) =>
                      setTeamLogos((t: any) => ({
                        ...t,
                        [editingTeam]: value,
                      }))
                    )
                  }
                />
              </label>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] tracking-[0.18em] text-white/45">
                  TEAM NAME
                </div>

                <input
                  className="mt-1 w-full bg-transparent text-[18px] font-semibold text-white outline-none"
                  value={teamNames[editingTeam]}
                  onChange={(e) =>
                    setTeamNames((names: any) => ({
                      ...names,
                      [editingTeam]: e.target.value,
                    }))
                  }
                />

                <div className="mt-1 text-[11px] leading-4 text-white/45">
                  Tap logo to change image.
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <Button
              active={editingTeam === "Red"}
              onClick={() => setEditingTeam("Red")}
            >
              {teamNames.Red || "Team Red"}
            </Button>

            <Button
              active={editingTeam === "Blue"}
              onClick={() => setEditingTeam("Blue")}
            >
              {teamNames.Blue || "Team Blue"}
            </Button>
          </div>

          <div className="space-y-3">
            {shownPlayers.map((p: any, i: number) => {
              const teamKey = editingTeam === "Red" ? "red" : "blue";

              return (
                <div
                  key={`${editingTeam}-${i}`}
                  className="rounded-[22px] border border-white/15 bg-black/40 p-3 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <label className="relative cursor-pointer">
                      <Logo
                        team={teamKey}
                        size="h-14 w-14"
                        src={p.photo || teamLogos[editingTeam]}
                      />

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          readImageFile(e.target.files?.[0], (value) =>
                            updatePlayer(editingTeam, i, "photo", value)
                          )
                        }
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] tracking-[0.18em] text-white/45">
                        {p.slot}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <input
                          className="flex-1 bg-transparent text-[16px] font-semibold text-white outline-none"
                          value={p.name}
                          onChange={(e) =>
                            updatePlayer(editingTeam, i, "name", e.target.value)
                          }
                        />

                        <input
                          className="w-[60px] rounded-lg border border-[#d1c79f]/25 bg-black/45 px-2 py-1 text-center text-sm text-white outline-none"
                          value={p.handicap}
                          onChange={(e) =>
                            updatePlayer(
                              editingTeam,
                              i,
                              "handicap",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function AdminPicker({ title, options, value, setValue }: any) {
  return (
    <div className="rounded-[18px] border border-[#d1c79f]/25 bg-black/40 p-3">
      <div className="mb-2 text-[9px] tracking-[0.16em] text-white/50">
        {title}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {options.map((o: any) => (
          <Button
            key={o}
            active={o === value}
            onClick={() => setValue(o)}
            className="rounded-lg py-2"
          >
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Label({ children }: any) {
  return (
    <div className="mb-1.5 text-[9px] tracking-[0.14em] text-white/50">
      {children}
    </div>
  );
}
