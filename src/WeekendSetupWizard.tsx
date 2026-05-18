import { useMemo, useState } from "react";
import { Button, cx, validFormats } from "./data";

const PLAYER_OPTIONS = [1, 2, 4, 6, 8, 10, 12];

function firstName(name: string) {
  return String(name || "").split(" ")[0] || "Player";
}

function normalisePlayer(player: any, index: number) {
  return {
    id: player?.id || "player-" + (index + 1),
    name: player?.name || "",
    nickname: player?.nickname || "",
    handicap: player?.handicap ?? player?.rawHandicap ?? "",
    homeClub: player?.homeClub || "",
    preferredTee: player?.preferredTee || "Blue",
    photo: player?.photo || "",
    team: player?.team || "",
    regular: player?.regular ?? true,
  };
}

function balanceTeamsByHandicap(players: any[]) {
  const sorted = [...players]
    .map((player, index) => normalisePlayer(player, index))
    .sort((a, b) => Number(a.handicap || 0) - Number(b.handicap || 0));

  const red: any[] = [];
  const blue: any[] = [];
  let redTotal = 0;
  let blueTotal = 0;

  sorted.forEach((player) => {
    const hcp = Number(player.handicap || 0);

    if (red.length <= blue.length && redTotal <= blueTotal) {
      red.push({ ...player, team: "Red" });
      redTotal += hcp;
    } else if (blue.length < red.length || blueTotal <= redTotal) {
      blue.push({ ...player, team: "Blue" });
      blueTotal += hcp;
    } else {
      red.push({ ...player, team: "Red" });
      redTotal += hcp;
    }
  });

  return { red, blue };
}

function splitTeamsByOrder(players: any[]) {
  const half = Math.ceil(players.length / 2);

  return {
    red: players.slice(0, half).map((player) => ({ ...player, team: "Red" })),
    blue: players.slice(half).map((player) => ({ ...player, team: "Blue" })),
  };
}

function shuffleTeams(players: any[]) {
  const shuffled = [...players]
    .map((player) => ({ player, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ player }) => player);

  return splitTeamsByOrder(shuffled);
}

export default function WeekendSetupWizard({
  activeEvent,
  saveActiveEvent,
  eventDetails,
  setEventDetails,
  teamNames,
  setTeamNames,
  teamLogos,
  setTeamLogos,
  players,
  setPlayers,
  days,
  setDays,
  roster,
  setRoster,
  savedPlayers,
  setSavedPlayers,
  dayConfigs,
  setDayConfigs,
  setScreen,
  setEventLocked,
  setEventStarted,
  setActiveTab,
}: any) {
  const [step, setStep] = useState(0);
  const [teamMethod, setTeamMethod] = useState<"manual" | "random" | "handicap">(
    "handicap"
  );

  const eventCode = activeEvent?.eventCode || "DUEL";
  const adminPin = activeEvent?.adminPin || "0000";

  const totalPlayers = players * 2;
  const progress = ((step + 1) / 6) * 100;

  const playerList = useMemo(() => {
    const fromSaved = Array.isArray(savedPlayers) ? savedPlayers : [];
    const merged = [...fromSaved];

    while (merged.length < totalPlayers) {
      merged.push({
        id: "player-" + (merged.length + 1),
        name: "",
        nickname: "",
        handicap: "",
        homeClub: "",
        preferredTee: "Blue",
        photo: "",
        regular: true,
      });
    }

    return merged.slice(0, totalPlayers).map(normalisePlayer);
  }, [savedPlayers, totalPlayers]);

  const redPlayers = roster?.Red || [];
  const bluePlayers = roster?.Blue || [];

  const eventSummary = useMemo(
    () => ({
      name: eventDetails.name || activeEvent?.name || "Dual Weekend",
      location: eventDetails.location || activeEvent?.location || "Golf Weekend",
    }),
    [eventDetails, activeEvent]
  );

  function persistEvent(extra: any = {}) {
    if (!activeEvent) return;

    try {
      const updated = {
        ...activeEvent,
        name: eventDetails.name,
        location: eventDetails.location,
        startDate: eventDetails.startDate,
        endDate: eventDetails.endDate,
        days,
        ...extra,
      };

      const events = JSON.parse(
        localStorage.getItem("duel_weekend_events") || "{}"
      );

      events[updated.eventCode] = {
        ...events[updated.eventCode],
        ...updated,
        eventDetails,
        teamNames,
        teamLogos,
        players,
        days,
        dayConfigs,
        roster,
        savedPlayers,
        teamMethod,
        ...extra,
      };

      localStorage.setItem("duel_weekend_events", JSON.stringify(events));
      saveActiveEvent(updated);
    } catch (error) {
      console.warn("DUEL event save failed, continuing wizard:", error);
    }
  }

  function goNext() {
    if (step === 2) {
      applyTeamMethod(teamMethod);
    }

    persistEvent();
    setStep((value) => Math.min(5, value + 1));
  }

  function goBack() {
    persistEvent();
    setStep((value) => Math.max(0, value - 1));
  }

  function readImageFile(file: File | undefined, callback: (value: string) => void) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      callback(String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  }

  function updateSavedPlayer(index: number, field: string, value: any) {
    setSavedPlayers((current: any[]) => {
      const next = Array.isArray(current) ? [...current] : [];

      while (next.length < totalPlayers) {
        next.push({
          id: "player-" + (next.length + 1),
          name: "",
          nickname: "",
          handicap: "",
          homeClub: "",
          preferredTee: "Blue",
          photo: "",
          regular: true,
        });
      }

      next[index] = {
        ...normalisePlayer(next[index], index),
        [field]: value,
      };

      return next;
    });
  }

  function applyTeams(red: any[], blue: any[]) {
    setRoster((current: any) => ({
      ...current,
      Red: red.map((player, index) => ({
        ...player,
        id: player.id || "red-" + (index + 1),
        teamId: "red",
        name: player.name || "Red " + (index + 1),
        handicap: String(player.handicap || "0"),
      })),
      Blue: blue.map((player, index) => ({
        ...player,
        id: player.id || "blue-" + (index + 1),
        teamId: "blue",
        name: player.name || "Blue " + (index + 1),
        handicap: String(player.handicap || "0"),
      })),
    }));
  }

  function applyTeamMethod(method: "manual" | "random" | "handicap") {
    const list = playerList.map(normalisePlayer);

    if (method === "random") {
      const result = shuffleTeams(list);
      applyTeams(result.red, result.blue);
      return;
    }

    if (method === "handicap") {
      const result = balanceTeamsByHandicap(list);
      applyTeams(result.red, result.blue);
      return;
    }

    const manualRed = list.filter((player) => player.team === "Red");
    const manualBlue = list.filter((player) => player.team === "Blue");
    const unassigned = list.filter((player) => !player.team);

    const red = [...manualRed];
    const blue = [...manualBlue];

    unassigned.forEach((player) => {
      if (red.length <= blue.length) {
        red.push({ ...player, team: "Red" });
      } else {
        blue.push({ ...player, team: "Blue" });
      }
    });

    applyTeams(red, blue);
  }

  function updateManualTeam(index: number, team: "Red" | "Blue" | "") {
    updateSavedPlayer(index, "team", team);
    setTeamMethod("manual");
  }

  function updateDay(index: number, field: string, value: any) {
    setDayConfigs((current: any[]) =>
      current.map((day: any, i: number) =>
        i === index
          ? {
              ...day,
              [field]: value,
            }
          : day
      )
    );
  }

  function launchDuel() {
    persistEvent({
      eventLocked: true,
      eventStarted: true,
      activeRoundId: "day-1-round-1",
    });

    setEventLocked(true);
    setEventStarted(true);
    setActiveTab("live");
    setScreen("home");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setScreen("eventGate")}
          className="rounded-full border border-white/12 bg-black/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/70"
        >
          Back
        </button>

        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d1c79f]">
          Setup Wizard
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-[#d1c79f]/20 bg-black/48 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/38">
              Event Code
            </div>

            <div className="mt-1 text-[18px] font-black uppercase tracking-[0.12em] text-white">
              {eventCode}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/38">
              Admin PIN
            </div>

            <div className="mt-1 rounded-full bg-white px-3 py-1 text-[14px] font-black text-black">
              {adminPin}
            </div>
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#efe6bf] via-[#d1c79f] to-[#9f925f]"
            style={{ width: progress + "%" }}
          />
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pb-24">
        {step === 0 && (
          <Panel title="1. Event Details" subtitle="Name the weekend and set the dates.">
            <Field
              label="Event Name"
              value={eventDetails.name}
              onChange={(value: string) =>
                setEventDetails((current: any) => ({
                  ...current,
                  name: value,
                }))
              }
            />

            <Field
              label="Location"
              value={eventDetails.location}
              onChange={(value: string) =>
                setEventDetails((current: any) => ({
                  ...current,
                  location: value,
                }))
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Start Date"
                type="date"
                value={eventDetails.startDate}
                onChange={(value: string) =>
                  setEventDetails((current: any) => ({
                    ...current,
                    startDate: value,
                  }))
                }
              />

              <Field
                label="End Date"
                type="date"
                value={eventDetails.endDate}
                onChange={(value: string) =>
                  setEventDetails((current: any) => ({
                    ...current,
                    endDate: value,
                  }))
                }
              />
            </div>

            <div>
              <Label>Players per team</Label>

              <div className="grid grid-cols-7 gap-1.5">
                {PLAYER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPlayers(option)}
                    className={cx(
                      "rounded-xl border py-2 text-[11px] font-black",
                      players === option
                        ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                        : "border-white/10 bg-black/35 text-white/55"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">
                {totalPlayers} total players
              </div>
            </div>

            <div>
              <Label>Number of days</Label>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDays(option)}
                    className={cx(
                      "rounded-xl border py-3 text-[12px] font-black",
                      days === option
                        ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                        : "border-white/10 bg-black/35 text-white/55"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {step === 1 && (
          <Panel title="2. Teams & Logos" subtitle="Set team names and upload logos.">
            {(["Red", "Blue"] as const).map((team) => (
              <div
                key={team}
                className={cx(
                  "rounded-[24px] border p-4",
                  team === "Red"
                    ? "border-red-300/15 bg-[#320611]/80"
                    : "border-blue-300/15 bg-[#0a142b]/80"
                )}
              >
                <Label>{team} Team Name</Label>

                <input
                  value={teamNames[team]}
                  onChange={(e) =>
                    setTeamNames((current: any) => ({
                      ...current,
                      [team]: e.target.value,
                    }))
                  }
                  className="w-full rounded-[16px] border border-white/10 bg-black/45 px-4 py-3 text-[16px] font-black text-white outline-none"
                />

                <div className="mt-3">
                  <Label>{team} Logo</Label>

                  <label className="flex cursor-pointer items-center justify-between rounded-[18px] border border-white/10 bg-black/35 px-4 py-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55">
                      {teamLogos?.[team] ? "Logo Uploaded" : "Upload Logo"}
                    </span>

                    <span className="text-[22px]">＋</span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        readImageFile(e.target.files?.[0], (value) =>
                          setTeamLogos((current: any) => ({
                            ...current,
                            [team]: value,
                          }))
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </Panel>
        )}

        {step === 2 && (
          <Panel
            title="3. Players"
            subtitle="Add every player once. Teams are selected in the next step."
          >
            <div className="space-y-3">
              {playerList.map((player, index) => (
                <div
                  key={player.id || index}
                  className="rounded-[22px] border border-white/10 bg-black/42 p-3"
                >
                  <div className="flex items-center gap-3">
                    <label className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/55">
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[24px]">＋</span>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          readImageFile(e.target.files?.[0], (value: string) =>
                            updateSavedPlayer(index, "photo", value)
                          )
                        }
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <Label>Player {index + 1}</Label>

                      <input
                        value={player.name || ""}
                        onChange={(e) =>
                          updateSavedPlayer(index, "name", e.target.value)
                        }
                        placeholder={"Player " + (index + 1)}
                        className="w-full bg-transparent text-[18px] font-black text-white outline-none placeholder:text-white/25"
                      />
                    </div>

                    <div className="w-[70px]">
                      <Label>HCP</Label>

                      <input
                        value={player.handicap || ""}
                        onChange={(e) =>
                          updateSavedPlayer(index, "handicap", e.target.value)
                        }
                        placeholder="0"
                        inputMode="decimal"
                        className="w-full rounded-[14px] border border-white/10 bg-black/45 px-3 py-2 text-center text-[14px] font-black text-white outline-none placeholder:text-white/25"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-[1fr_92px] gap-2">
                    <input
                      value={player.homeClub || ""}
                      onChange={(e) =>
                        updateSavedPlayer(index, "homeClub", e.target.value)
                      }
                      placeholder="Home club"
                      className="rounded-[14px] border border-white/10 bg-black/45 px-3 py-2 text-[12px] font-bold text-white outline-none placeholder:text-white/25"
                    />

                    <select
                      value={player.preferredTee || "Blue"}
                      onChange={(e) =>
                        updateSavedPlayer(index, "preferredTee", e.target.value)
                      }
                      className="rounded-[14px] border border-white/10 bg-black/45 px-2 py-2 text-[11px] font-black uppercase text-white outline-none"
                    >
                      <option>Blue</option>
                      <option>White</option>
                      <option>Gold</option>
                      <option>Red</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {step === 3 && (
          <Panel
            title="4. Teams"
            subtitle="Choose the teams yourself, randomise, or balance by handicap."
          >
            <div className="grid grid-cols-3 gap-2">
              <TeamMethodButton
                active={teamMethod === "manual"}
                title="Choose"
                subtitle="Pick sides"
                onClick={() => setTeamMethod("manual")}
              />

              <TeamMethodButton
                active={teamMethod === "random"}
                title="Random"
                subtitle="Shuffle"
                onClick={() => {
                  setTeamMethod("random");
                  applyTeamMethod("random");
                }}
              />

              <TeamMethodButton
                active={teamMethod === "handicap"}
                title="Balance"
                subtitle="By HCP"
                onClick={() => {
                  setTeamMethod("handicap");
                  applyTeamMethod("handicap");
                }}
              />
            </div>

            {teamMethod === "manual" ? (
              <div className="space-y-2">
                {playerList.map((player, index) => (
                  <div
                    key={player.id || index}
                    className="grid grid-cols-[1fr_88px_88px] items-center gap-2 rounded-[18px] border border-white/10 bg-black/42 p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-black text-white">
                        {player.name || "Player " + (index + 1)}
                      </div>

                      <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
                        HCP {player.handicap || "0"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateManualTeam(index, "Red")}
                      className={cx(
                        "rounded-full border py-2 text-[10px] font-black uppercase tracking-[0.12em]",
                        player.team === "Red"
                          ? "border-red-200 bg-[#320611] text-white"
                          : "border-white/10 bg-black/30 text-white/35"
                      )}
                    >
                      Red
                    </button>

                    <button
                      type="button"
                      onClick={() => updateManualTeam(index, "Blue")}
                      className={cx(
                        "rounded-full border py-2 text-[10px] font-black uppercase tracking-[0.12em]",
                        player.team === "Blue"
                          ? "border-blue-200 bg-[#0a142b] text-white"
                          : "border-white/10 bg-black/30 text-white/35"
                      )}
                    >
                      Blue
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <TeamPreview redPlayers={redPlayers} bluePlayers={bluePlayers} />
            )}
          </Panel>
        )}

        {step === 4 && (
          <Panel title="5. Rounds" subtitle="Set each day before you press DUEL.">
            <div className="space-y-3">
              {dayConfigs.slice(0, days).map((day: any, index: number) => (
                <div
                  key={day.label}
                  className="rounded-[24px] border border-white/10 bg-black/42 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-[13px] font-black uppercase tracking-[0.18em] text-white">
                      Day {index + 1}
                    </div>

                    <div className="rounded-full border border-[#d1c79f]/25 bg-[#d1c79f]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#d1c79f]">
                      Setup
                    </div>
                  </div>

                  <Field
                    label="Course"
                    value={day.course}
                    onChange={(value: string) => updateDay(index, "course", value)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Tee"
                      value={day.tee}
                      onChange={(value: string) => updateDay(index, "tee", value)}
                    />

                    <Field
                      label="First Tee Time"
                      value={day.teeTime}
                      onChange={(value: string) => updateDay(index, "teeTime", value)}
                    />
                  </div>

                  <Label>Format</Label>

                  <select
                    value={day.format}
                    onChange={(e) => updateDay(index, "format", e.target.value)}
                    className="w-full rounded-[16px] border border-white/10 bg-black/45 px-4 py-3 text-[12px] font-black uppercase tracking-[0.08em] text-white outline-none"
                  >
                    {validFormats(players).map((format: string) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {step === 5 && (
          <Panel title="6. DUEL Launch" subtitle="Review and start the live round.">
            <div className="rounded-[26px] border border-[#d1c79f]/20 bg-black/45 p-5 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d1c79f]">
                Ready to Start
              </div>

              <div className="mt-3 text-[28px] font-black uppercase leading-none text-white">
                {eventSummary.name}
              </div>

              <div className="mt-2 text-[12px] font-bold uppercase tracking-[0.16em] text-white/42">
                {eventSummary.location}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <ReviewStat label="Players" value={totalPlayers} />
                <ReviewStat label="Days" value={days} />
                <ReviewStat label="Round" value="1" />
              </div>

              <button
                type="button"
                onClick={launchDuel}
                className="mt-6 w-full rounded-[30px] border border-[#efe6bf]/60 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#9f925f] py-6 text-[30px] font-black uppercase tracking-[0.22em] text-black shadow-[0_22px_55px_rgba(0,0,0,0.55)] active:scale-[0.98]"
              >
                DUEL
              </button>
            </div>
          </Panel>
        )}
      </div>

      <div className="pointer-events-auto relative z-50 grid grid-cols-2 gap-3 border-t border-white/8 bg-black/20 pb-1 pt-3 backdrop-blur-sm">
        <button
          type="button"
          disabled={step === 0}
          onClick={goBack}
          className="rounded-[18px] border border-white/10 bg-black/40 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-white/60 disabled:opacity-25"
        >
          Back
        </button>

        <button
          type="button"
          onClick={step === 5 ? persistEvent : goNext}
          className="rounded-[18px] bg-white py-4 text-[11px] font-black uppercase tracking-[0.16em] text-black"
        >
          {step === 5 ? "Save" : "Next"}
        </button>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }: any) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-black/50 p-4 shadow-[0_24px_65px_rgba(0,0,0,0.52)] backdrop-blur-xl">
      <div className="mb-4">
        <div className="text-[19px] font-black uppercase tracking-[0.04em] text-white">
          {title}
        </div>

        <div className="mt-1 text-[12px] leading-5 text-white/48">
          {subtitle}
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Label({ children }: any) {
  return (
    <div className="mb-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/42">
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <Label>{label}</Label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[16px] border border-white/10 bg-black/45 px-4 py-3 text-[13px] font-bold text-white outline-none"
      />
    </div>
  );
}

function TeamMethodButton({ active, title, subtitle, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-[18px] border px-2 py-4 text-center",
        active
          ? "border-[#d1c79f] bg-[#d1c79f] text-black"
          : "border-white/10 bg-black/35 text-white/55"
      )}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.12em]">
        {title}
      </div>

      <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] opacity-55">
        {subtitle}
      </div>
    </button>
  );
}

function TeamPreview({ redPlayers, bluePlayers }: any) {
  const redTotal = redPlayers.reduce(
    (sum: number, player: any) => sum + Number(player.handicap || 0),
    0
  );

  const blueTotal = bluePlayers.reduce(
    (sum: number, player: any) => sum + Number(player.handicap || 0),
    0
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <PreviewColumn team="Red" players={redPlayers} total={redTotal} />
      <PreviewColumn team="Blue" players={bluePlayers} total={blueTotal} />
    </div>
  );
}

function PreviewColumn({ team, players, total }: any) {
  const tone =
    team === "Red"
      ? "border-red-300/15 bg-[#320611]/65"
      : "border-blue-300/15 bg-[#0a142b]/65";

  return (
    <div className={cx("rounded-[22px] border p-3", tone)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
          {team}
        </div>

        <div className="rounded-full bg-black/35 px-2 py-1 text-[9px] font-black text-white/60">
          {total.toFixed(1)}
        </div>
      </div>

      <div className="space-y-1.5">
        {players.map((player: any, index: number) => (
          <div
            key={player.id || index}
            className="rounded-xl border border-white/10 bg-black/28 px-2 py-2"
          >
            <div className="truncate text-[11px] font-black text-white">
              {firstName(player.name || "Player " + (index + 1))}
            </div>

            <div className="mt-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/35">
              HCP {player.handicap || "0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewStat({ label, value }: any) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
      <div className="text-[18px] font-black text-white">{value}</div>

      <div className="mt-1 text-[8px] font-black uppercase tracking-[0.18em] text-white/38">
        {label}
      </div>
    </div>
  );
}
