import { useState } from "react";
import {
  Button,
  Logo,
  Select,
  cx,
  dayOptions,
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
  eventLocked,
  setEventLocked,
  eventStarted,
  setEventStarted,
  pairingLocks,
  setPairingLocks,
}: any) {
  const [adminMode, setAdminMode] = useState("event");
  const [editingTeam, setEditingTeam] = useState("Red");

  const readImageFile = (
    file: File | undefined,
    callback: (value: string) => void
  ) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      callback(String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  };

  const setDay = (i: number, field: string, value: any) => {
    if (eventLocked || dayLocks[i]) return;

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
    if (eventLocked) return;

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

  const changeDays = (count: number) => {
    if (eventLocked) return;
    setDays(count);
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

  const startEvent = () => {
    if (!eventLocked) {
      setEventLocked(true);
    }

    setEventStarted(true);
    setScreen("home");
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
            active={adminMode === "teams"}
            onClick={() => setAdminMode("teams")}
            className="px-3 py-2 text-xs"
          >
            Teams
          </Button>

          <Button
            active={adminMode === "pairings"}
            onClick={() => setAdminMode("pairings")}
            className="px-3 py-2 text-xs"
          >
            Pairings
          </Button>
        </div>

        <button
          onClick={() => {
            if (eventStarted) {
              setScreen("home");
            } else {
              setScreen("admin");
            }
          }}
          className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold"
        >
          {eventStarted ? "Home" : "Setup"}
        </button>
      </div>

      <StatusPanel eventLocked={eventLocked} eventStarted={eventStarted} />

      {adminMode === "event" && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <AdminPicker
              title="PLAYERS / TEAM"
              options={playerOptions}
              value={players}
              setValue={changePlayers}
              locked={eventLocked}
            />

            <AdminPicker
              title="COMP DAYS"
              options={dayOptions}
              value={days}
              setValue={changeDays}
              locked={eventLocked}
            />
          </div>

          <div className="mt-3 flex-1 space-y-3 overflow-y-auto pb-3">
            {dayConfigs.slice(0, days).map((day: any, i: number) => {
              const locked = Boolean(eventLocked || dayLocks[i]);

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
                        {locked ? "EVENT SETUP LOCKED" : "SETUP OPEN"}
                      </div>
                    </div>

                    <div className="rounded-full border border-[#d1c79f]/25 bg-black/35 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-[#d1c79f]">
                      {day.format}
                    </div>
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

            <LockPanel
              eventLocked={eventLocked}
              setEventLocked={setEventLocked}
              eventStarted={eventStarted}
              startEvent={startEvent}
            />
          </div>
        </>
      )}

      {adminMode === "teams" && (
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
                  Names, photos and handicaps remain editable. Handicap changes
                  apply to future matches.
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

          <div className="mb-3 rounded-[18px] border border-[#d1c79f]/20 bg-black/35 p-3 text-[11px] leading-5 text-white/55">
            Weekend lock protects the event structure. Player handicaps are live
            and can be adjusted during the weekend.
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

      {adminMode === "pairings" && (
        <div className="mt-3 flex-1 overflow-y-auto pb-3">
          {!eventLocked ? (
            <div className="rounded-[24px] border border-[#d1c79f]/25 bg-black/45 p-5 text-center">
              <div className="text-[11px] font-bold tracking-[0.26em] text-[#d1c79f]">
                EVENT NOT LOCKED
              </div>

              <div className="mt-3 text-sm leading-6 text-white/65">
                Lock the weekend setup before setting daily pairings. This keeps
                formats, days and team sizes stable.
              </div>

              <button
                onClick={() => setAdminMode("event")}
                className="mt-5 rounded-full bg-[#d1c79f] px-5 py-2 text-sm font-bold text-black"
              >
                Go to Event Lock
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayConfigs.slice(0, days).map((day: any, i: number) => {
                const locked = Boolean(pairingLocks[i]);

                return (
                  <div
                    key={day.label}
                    className="rounded-[24px] border border-[#d1c79f]/20 bg-black/40 p-4 backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-black tracking-[0.18em] text-white">
                          {day.label.toUpperCase()}
                        </div>

                        <div className="mt-1 text-[11px] text-white/45">
                          {day.format} • {day.tee} tee • {day.teeTime}
                        </div>

                        <div className="mt-3 inline-flex rounded-full border border-[#d1c79f]/25 bg-black/35 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-[#d1c79f]">
                          {locked ? "PAIRINGS LOCKED" : "PAIRINGS OPEN"}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPairingLocks((locks: any) => ({
                            ...locks,
                            [i]: !locks[i],
                          }))
                        }
                        className={cx(
                          "rounded-full border px-3 py-2 text-[10px] font-bold",
                          locked
                            ? "border-[#d1c79f]/45 bg-[#d1c79f]/20 text-[#efe6bf]"
                            : "border-white/15 bg-black/35 text-white/70"
                        )}
                      >
                        {locked ? "Unlock" : "Lock"}
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setScreen("rosterP")}
                        disabled={locked}
                        className="rounded-[18px] border border-red-300/25 bg-red-950/35 px-3 py-3 text-xs font-bold text-red-100 disabled:opacity-35"
                      >
                        Edit Red Order
                      </button>

                      <button
                        onClick={() => setScreen("rosterB")}
                        disabled={locked}
                        className="rounded-[18px] border border-blue-300/25 bg-blue-950/35 px-3 py-3 text-xs font-bold text-blue-100 disabled:opacity-35"
                      >
                        Edit Blue Order
                      </button>
                    </div>

                    <div className="mt-3 text-[10px] leading-4 text-white/40">
                      Pairings are usually set after each day. Lock the day once
                      tee times or matches are agreed.
                    </div>
                  </div>
                );
              })}

              {eventLocked && !eventStarted && (
                <div className="rounded-[24px] border border-[#d1c79f]/30 bg-black/60 p-4">
                  <div className="text-[11px] font-black tracking-[0.22em] text-[#d1c79f]">
                    READY TO GO LIVE
                  </div>

                  <div className="mt-2 text-[11px] leading-5 text-white/55">
                    Once the pairings are set, start the event to open the live
                    scoreboard and match scoring.
                  </div>

                  <button
                    type="button"
                    onClick={startEvent}
                    className="mt-4 w-full rounded-[18px] bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] px-4 py-4 text-sm font-black tracking-[0.16em] text-black"
                  >
                    START EVENT
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function StatusPanel({ eventLocked, eventStarted }: any) {
  return (
    <div className="mt-3 rounded-[20px] border border-[#d1c79f]/20 bg-black/40 p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold tracking-[0.22em] text-white/45">
            WEEKEND STATUS
          </div>

          <div className="mt-1 text-sm font-black tracking-[0.12em] text-white">
            {eventStarted
              ? "EVENT LIVE"
              : eventLocked
              ? "EVENT LOCKED"
              : "SETUP OPEN"}
          </div>
        </div>

        <div
          className={cx(
            "rounded-full px-3 py-1 text-[10px] font-black tracking-[0.14em]",
            eventStarted
              ? "bg-[#4ade80] text-black"
              : eventLocked
              ? "bg-[#d1c79f] text-black"
              : "border border-white/15 bg-black/35 text-white/60"
          )}
        >
          {eventStarted ? "LIVE" : eventLocked ? "READY" : "ADMIN"}
        </div>
      </div>
    </div>
  );
}

function LockPanel({
  eventLocked,
  setEventLocked,
  eventStarted,
  startEvent,
}: any) {
  return (
    <div className="rounded-[24px] border border-[#d1c79f]/25 bg-black/55 p-4">
      <div className="text-[11px] font-black tracking-[0.22em] text-[#d1c79f]">
        EVENT LOCK CONTROL
      </div>

      <div className="mt-2 text-[11px] leading-5 text-white/55">
        Locking protects days, formats, course, tees and player count. Team
        names, photos and handicaps stay editable.
      </div>

      <button
        type="button"
        disabled={eventStarted}
        onClick={() => setEventLocked((v: boolean) => !v)}
        className={cx(
          "mt-4 w-full rounded-[18px] px-4 py-4 text-sm font-black tracking-[0.16em]",
          eventStarted
            ? "border border-white/10 bg-black/25 text-white/25"
            : eventLocked
            ? "border border-[#d1c79f]/30 bg-black/35 text-[#efe6bf]"
            : "bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
        )}
      >
        {eventStarted
          ? "EVENT IS LIVE"
          : eventLocked
          ? "UNLOCK EVENT SETUP"
          : "LOCK EVENT SETUP"}
      </button>

      {eventLocked && !eventStarted && (
        <button
          type="button"
          onClick={startEvent}
          className="mt-3 w-full rounded-[18px] bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#15803d] px-4 py-4 text-sm font-black tracking-[0.16em] text-black shadow-[0_0_24px_rgba(74,222,128,0.25)]"
        >
          START EVENT
        </button>
      )}
    </div>
  );
}

function AdminPicker({ title, options, value, setValue, locked = false }: any) {
  return (
    <div
      className={cx(
        "rounded-[18px] border border-[#d1c79f]/25 bg-black/40 p-3",
        locked && "opacity-45"
      )}
    >
      <div className="mb-2 text-[9px] tracking-[0.16em] text-white/50">
        {title}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {options.map((o: any) => (
          <Button
            key={o}
            active={o === value}
            onClick={() => !locked && setValue(o)}
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
