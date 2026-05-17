import { useMemo, useState } from "react";
import {
  Button,
  Logo,
  Select,
  cx,
  dayOptions,
  playerOptions,
  rosterMeta,
  times,
  validFormats,
} from "./data";
import { searchCourses } from "./lib/golfCourseApi";
import { COURSES, getDefaultTee } from "./courses";

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
  eventDetails,
  setEventDetails,
  savedPlayers,
  setSavedPlayers,
}: any) {
  const [adminMode, setAdminMode] = useState("event");
  const [editingTeam, setEditingTeam] = useState("Red");

  const [savedApiCourses, setSavedApiCourses] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("duel_saved_api_courses");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [coursePickerMode, setCoursePickerMode] = useState<
    Record<number, "saved" | "search">
  >({});

  const [courseSearch, setCourseSearch] = useState<Record<number, string>>({});
  const [courseSearchResults, setCourseSearchResults] = useState<
    Record<number, any[]>
  >({});
  const [courseSearchStatus, setCourseSearchStatus] = useState<
    Record<number, string>
  >({});

  const savedCourses = useMemo(
    () => [...COURSES, ...savedApiCourses],
    [savedApiCourses]
  );

  function getCourseTeesForAdmin(courseId: string) {
    const course = COURSES.find((c) => c.id === courseId);

    return course?.tees?.map((tee: any) => tee.id) || [
      "Blue",
      "White",
      "Gold",
      "Red",
    ];
  }

  function getApiCourseName(course: any) {
    return (
      course?.course_name ||
      course?.name ||
      course?.club_name ||
      course?.facility_name ||
      "Unknown Course"
    );
  }

  function getApiCourseLocation(course: any) {
    return [course?.city, course?.state, course?.province, course?.country]
      .filter(Boolean)
      .join(", ");
  }

  function getApiCourseId(course: any) {
    return (
      course?.id ||
      course?.course_id ||
      course?.global_course_id ||
      course?.club_id ||
      getApiCourseName(course).toLowerCase().replace(/[^a-z0-9]+/g, "-")
    );
  }

  async function handleCourseSearch(dayIndex: number) {
    const query = String(courseSearch[dayIndex] || "").trim();

    if (!query) {
      setCourseSearchStatus((current) => ({
        ...current,
        [dayIndex]: "Enter a course name first",
      }));
      return;
    }

    setCourseSearchStatus((current) => ({
      ...current,
      [dayIndex]: "Searching...",
    }));

    try {
      const result = await searchCourses(query);
      const courses = Array.isArray(result?.courses)
        ? result.courses
        : Array.isArray(result)
        ? result
        : [];

      console.log("Weekend GolfCourseAPI search result:", result);

      setCourseSearchResults((current) => ({
        ...current,
        [dayIndex]: courses,
      }));

      setCourseSearchStatus((current) => ({
        ...current,
        [dayIndex]: courses.length
          ? `${courses.length} result${courses.length === 1 ? "" : "s"} found`
          : "No courses found",
      }));
    } catch (error) {
      console.error("Weekend GolfCourseAPI search error:", error);

      setCourseSearchStatus((current) => ({
        ...current,
        [dayIndex]: "Search failed — check console",
      }));
    }
  }

  function importApiCourse(apiCourse: any, dayIndex: number) {
    const apiId = getApiCourseId(apiCourse);

    const importedCourse = {
      id: `api-${apiId}`,
      name: getApiCourseName(apiCourse),
      shortName: getApiCourseName(apiCourse),
      region: getApiCourseLocation(apiCourse),
      country: apiCourse?.country || "",
      source: "GolfCourseAPI",
      raw: apiCourse,
    };

    setSavedApiCourses((current: any[]) => {
      const withoutDuplicate = current.filter(
        (course) => course.id !== importedCourse.id
      );

      const next = [...withoutDuplicate, importedCourse];

      localStorage.setItem("duel_saved_api_courses", JSON.stringify(next));

      return next;
    });

    setDay(dayIndex, "courseId", importedCourse.id);
    setDay(dayIndex, "course", importedCourse.shortName);
    setDay(dayIndex, "tee", getDefaultTee("st-michaels"));

    setCoursePickerMode((current) => ({
      ...current,
      [dayIndex]: "saved",
    }));

    setCourseSearchStatus((current) => ({
      ...current,
      [dayIndex]: `Saved ${importedCourse.name}`,
    }));
  }

  function selectSavedCourseForDay(dayIndex: number, course: any) {
    setDay(dayIndex, "courseId", course.id);
    setDay(dayIndex, "course", course.shortName || course.name);

    if (COURSES.some((c) => c.id === course.id)) {
      setDay(dayIndex, "tee", getDefaultTee(course.id));
    } else {
      setDay(dayIndex, "tee", getDefaultTee("st-michaels"));
    }
  }

  function removeSavedApiCourse(courseIdToRemove: string) {
    setSavedApiCourses((current: any[]) => {
      const next = current.filter((course) => course.id !== courseIdToRemove);

      localStorage.setItem("duel_saved_api_courses", JSON.stringify(next));

      return next;
    });
  }

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
      {/* HEADER */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2 overflow-x-auto">
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
            active={adminMode === "players"}
            onClick={() => setAdminMode("players")}
            className="px-3 py-2 text-xs"
          >
            Players
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
            }
          }}
          className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold"
        >
          Home
        </button>
      </div>

      {/* STATUS */}
      <StatusPanel
        eventLocked={eventLocked}
        eventStarted={eventStarted}
      />

      {/* EVENT */}
      {adminMode === "event" && (
        <div className="mt-3 flex-1 overflow-y-auto pb-3">
          {/* EVENT DETAILS */}
          <div className="rounded-[22px] border border-[#d1c79f]/20 bg-black/45 p-4 backdrop-blur-xl">
            <div className="mb-3 text-[10px] font-bold tracking-[0.22em] text-[#d1c79f]">
              EVENT DETAILS
            </div>

            <div className="space-y-3">
              <InputGroup
                label="EVENT NAME"
                value={eventDetails.name}
                disabled={eventLocked}
                onChange={(v: string) =>
                  setEventDetails((e: any) => ({
                    ...e,
                    name: v,
                  }))
                }
              />

              <InputGroup
                label="LOCATION"
                value={eventDetails.location}
                disabled={eventLocked}
                onChange={(v: string) =>
                  setEventDetails((e: any) => ({
                    ...e,
                    location: v,
                  }))
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <InputGroup
                  label="START DATE"
                  type="date"
                  value={eventDetails.startDate}
                  disabled={eventLocked}
                  onChange={(v: string) =>
                    setEventDetails((e: any) => ({
                      ...e,
                      startDate: v,
                    }))
                  }
                />

                <InputGroup
                  label="END DATE"
                  type="date"
                  value={eventDetails.endDate}
                  disabled={eventLocked}
                  onChange={(v: string) =>
                    setEventDetails((e: any) => ({
                      ...e,
                      endDate: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* CONFIG */}
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

          {/* DAYS */}
          <div className="mt-3 space-y-3">
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
                        {locked ? "EVENT LOCKED" : "SETUP OPEN"}
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

                    <WeekendCoursePicker
                      dayIndex={i}
                      day={day}
                      courseMode={coursePickerMode[i] || "saved"}
                      setCourseMode={(mode: "saved" | "search") =>
                        setCoursePickerMode((current) => ({
                          ...current,
                          [i]: mode,
                        }))
                      }
                      savedCourses={savedCourses}
                      selectSavedCourse={(course: any) =>
                        selectSavedCourseForDay(i, course)
                      }
                      removeSavedApiCourse={removeSavedApiCourse}
                      courseSearch={courseSearch[i] || ""}
                      setCourseSearch={(value: string) =>
                        setCourseSearch((current) => ({
                          ...current,
                          [i]: value,
                        }))
                      }
                      handleCourseSearch={() => handleCourseSearch(i)}
                      courseSearchStatus={courseSearchStatus[i] || ""}
                      courseSearchResults={courseSearchResults[i] || []}
                      importApiCourse={(course: any) => importApiCourse(course, i)}
                      getApiCourseName={getApiCourseName}
                      getApiCourseLocation={getApiCourseLocation}
                      getApiCourseId={getApiCourseId}
                    />

                    <div className="mt-3">
                      <Label>TEE</Label>

                      <Select
                        value={day.tee}
                        onChange={(v: any) => setDay(i, "tee", v)}
                        options={getCourseTeesForAdmin(day.courseId || "st-michaels")}
                      />
                    </div>

                    <div className="mt-3">
                      <Label>GAME FORMAT</Label>

                      <Select
                        value={day.format}
                        onChange={(v: any) => setDay(i, "format", v)}
                        options={validFormats(players)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* LOCK PANEL */}
          <LockPanel
            eventLocked={eventLocked}
            setEventLocked={setEventLocked}
            eventStarted={eventStarted}
            startEvent={startEvent}
          />
        </div>
      )}

      {/* TEAMS */}
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

      {/* PLAYER DATABASE */}
      {adminMode === "players" && (
        <div className="mt-3 flex-1 overflow-y-auto pb-3">
          <div className="rounded-[22px] border border-[#d1c79f]/20 bg-black/45 p-4">
            <div className="mb-2 text-[10px] font-bold tracking-[0.22em] text-[#d1c79f]">
              SAVED PLAYERS
            </div>

            <div className="text-[11px] leading-5 text-white/50">
              Store regular players for future weekends and quick setup.
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {savedPlayers.map((p: any) => (
              <div
                key={p.id}
                className="rounded-[22px] border border-white/15 bg-black/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <Logo
                    team="blue"
                    size="h-14 w-14"
                    src={p.photo}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[15px] font-semibold text-white">
                          {p.name}
                        </div>

                        <div className="mt-1 text-[11px] text-white/45">
                          {p.homeClub || "No Home Club"}
                        </div>
                      </div>

                      <div className="rounded-full border border-[#d1c79f]/25 bg-black/35 px-3 py-1 text-xs font-bold text-[#d1c79f]">
                        {p.handicap}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] text-white/55">
                        {p.preferredTee}
                      </div>

                      {p.regular && (
                        <div className="rounded-full border border-[#d1c79f]/20 bg-[#d1c79f]/10 px-3 py-1 text-[10px] font-bold text-[#d1c79f]">
                          REGULAR PLAYER
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setSavedPlayers((players: any[]) => [
                  ...players,
                  {
                    id: String(Date.now()),
                    name: "New Player",
                    nickname: "",
                    handicap: "0.0",
                    homeClub: "",
                    preferredTee: "Blue",
                    photo: "",
                    regular: false,
                  },
                ])
              }
              className="w-full rounded-[20px] border border-dashed border-[#d1c79f]/25 bg-black/35 py-4 text-sm font-semibold text-[#d1c79f]"
            >
              + Add Saved Player
            </button>
          </div>
        </div>
      )}

      {/* PAIRINGS */}
      {adminMode === "pairings" && (
        <div className="mt-3 flex-1 overflow-y-auto pb-3">
          {!eventLocked ? (
            <div className="rounded-[24px] border border-[#d1c79f]/25 bg-black/45 p-5 text-center">
              <div className="text-[11px] font-bold tracking-[0.26em] text-[#d1c79f]">
                EVENT NOT LOCKED
              </div>

              <div className="mt-3 text-sm leading-6 text-white/65">
                Lock the weekend setup before setting pairings.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {dayConfigs.slice(0, days).map((day: any, i: number) => {
                const locked = Boolean(pairingLocks[i]);

                return (
                  <div
                    key={day.label}
                    className="rounded-[24px] border border-[#d1c79f]/20 bg-black/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-black tracking-[0.18em] text-white">
                          {day.label.toUpperCase()}
                        </div>

                        <div className="mt-1 text-[11px] text-white/45">
                          {day.format} • {day.teeTime}
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
                        {locked ? "LOCKED" : "OPEN"}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function WeekendCoursePicker({
  dayIndex,
  day,
  courseMode,
  setCourseMode,
  savedCourses,
  selectSavedCourse,
  removeSavedApiCourse,
  courseSearch,
  setCourseSearch,
  handleCourseSearch,
  courseSearchStatus,
  courseSearchResults,
  importApiCourse,
  getApiCourseName,
  getApiCourseLocation,
  getApiCourseId,
}: any) {
  return (
    <div>
      <Label>COURSE</Label>

      <div className="mb-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setCourseMode("saved")}
          className={cx(
            "rounded-full border px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em]",
            courseMode === "saved"
              ? "border-[#d1c79f] bg-[#d1c79f] text-black"
              : "border-white/12 bg-black/40 text-white/65"
          )}
        >
          Saved
        </button>

        <button
          type="button"
          onClick={() => setCourseMode("search")}
          className={cx(
            "rounded-full border px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em]",
            courseMode === "search"
              ? "border-[#d1c79f] bg-[#d1c79f] text-black"
              : "border-white/12 bg-black/40 text-white/65"
          )}
        >
          Search API
        </button>
      </div>

      {courseMode === "saved" ? (
        <div className="space-y-2">
          {savedCourses.map((course: any) => {
            const active =
              day.courseId === course.id ||
              day.course === course.shortName ||
              day.course === course.name;

            const isApiCourse = course.source === "GolfCourseAPI";

            return (
              <div
                key={`${dayIndex}-${course.id}`}
                className={cx(
                  "rounded-[16px] border p-3",
                  active
                    ? "border-[#d1c79f]/70 bg-[#d1c79f]/12"
                    : "border-white/10 bg-black/35"
                )}
              >
                <button
                  type="button"
                  onClick={() => selectSavedCourse(course)}
                  className="w-full text-left"
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white">
                    {course.name}
                  </div>

                  <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                    {isApiCourse
                      ? "Saved from GolfCourseAPI"
                      : `${course.region || ""}${
                          course.country ? ` • ${course.country}` : ""
                        }` || "Saved Course"}
                  </div>
                </button>

                {isApiCourse ? (
                  <button
                    type="button"
                    onClick={() => removeSavedApiCourse(course.id)}
                    className="mt-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white/45"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search course"
              className="w-full rounded-full border border-white/10 bg-black/50 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-white outline-none placeholder:text-white/25"
            />

            <button
              type="button"
              onClick={handleCourseSearch}
              className="rounded-full border border-[#d1c79f]/50 bg-[#d1c79f] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-black"
            >
              Search
            </button>
          </div>

          {courseSearchStatus ? (
            <div className="mt-2 text-center text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
              {courseSearchStatus}
            </div>
          ) : null}

          <div className="mt-3 max-h-[240px] space-y-2 overflow-y-auto pr-1">
            {courseSearchResults.map((course: any, index: number) => (
              <div
                key={`${getApiCourseId(course)}-${index}`}
                className="rounded-[16px] border border-white/10 bg-black/35 p-3"
              >
                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white">
                  {getApiCourseName(course)}
                </div>

                <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                  {getApiCourseLocation(course) || "GolfCourseAPI result"}
                </div>

                <button
                  type="button"
                  onClick={() => importApiCourse(course)}
                  className="mt-3 w-full rounded-full bg-[#d1c79f] py-2 text-[9px] font-black uppercase tracking-[0.14em] text-black"
                >
                  Import & Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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
    <div className="mt-4 rounded-[24px] border border-[#d1c79f]/25 bg-black/55 p-4">
      <div className="text-[11px] font-black tracking-[0.22em] text-[#d1c79f]">
        EVENT CONTROL
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
          ? "EVENT LIVE"
          : eventLocked
          ? "UNLOCK EVENT"
          : "LOCK EVENT"}
      </button>

      {eventLocked && !eventStarted && (
        <button
          type="button"
          onClick={startEvent}
          className="mt-3 w-full rounded-[18px] bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#15803d] px-4 py-4 text-sm font-black tracking-[0.16em] text-black"
        >
          START EVENT
        </button>
      )}
    </div>
  );
}

function AdminPicker({
  title,
  options,
  value,
  setValue,
  locked = false,
}: any) {
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

function InputGroup({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
}: any) {
  return (
    <div>
      <div className="mb-1.5 text-[9px] tracking-[0.14em] text-white/50">
        {label}
      </div>

      <input
        type={type}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "w-full rounded-[14px] border border-[#d1c79f]/20 bg-black/40 px-4 py-3 text-sm text-white outline-none",
          disabled && "opacity-45"
        )}
      />
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

