import { useMemo, useState } from "react";
import {
  Button,
  Logo,
  Select,
  cx,
  playerOptions,
  times,
  validFormats,
} from "./data";
import { searchCourses } from "./lib/golfCourseApi";
import { COURSES, getDefaultTee } from "./courses";
import AdminHeaderNav from "./AdminHeaderNav";

type RoundStatus = "setup" | "locked" | "live" | "complete";
type CoursePickerMode = "summary" | "saved" | "search";

const STATUS_LABEL: Record<RoundStatus, string> = {
  setup: "Setup Open",
  locked: "Locked",
  live: "Live",
  complete: "Complete",
};

const STATUS_STYLE: Record<RoundStatus, string> = {
  setup: "border-white/15 bg-black/35 text-white/65",
  locked: "border-[#d1c79f]/45 bg-[#d1c79f]/15 text-[#efe6bf]",
  live: "border-[#4ade80]/45 bg-[#4ade80] text-black",
  complete: "border-[#60a5fa]/45 bg-[#60a5fa]/18 text-[#bfdbfe]",
};

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
  const [adminMode, setAdminMode] = useState<"day" | "teams" | "hcps" | "pairings" | "scorers">("day");
  const [selectedDay, setSelectedDay] = useState(0);
  const [editingTeam, setEditingTeam] = useState<"Red" | "Blue">("Red");

  const [roundStatuses, setRoundStatuses] = useState<Record<number, RoundStatus>>(() => {
    try {
      const stored = localStorage.getItem("duel_round_statuses");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }

    return {
      0: dayLocks?.[0] ? "locked" : "setup",
      1: dayLocks?.[1] ? "locked" : "setup",
      2: dayLocks?.[2] ? "locked" : "setup",
      3: dayLocks?.[3] ? "locked" : "setup",
    };
  });

  const [captains, setCaptains] = useState<Record<number, { red?: string; blue?: string }>>(() => {
    try {
      const stored = localStorage.getItem("duel_round_captains");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [groupScorers, setGroupScorers] = useState<Record<number, Record<number, string>>>(() => {
    try {
      const stored = localStorage.getItem("duel_group_scorers");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [coursePickerMode, setCoursePickerMode] = useState<Record<number, CoursePickerMode>>({});
  const [courseSearch, setCourseSearch] = useState<Record<number, string>>({});
  const [courseSearchResults, setCourseSearchResults] = useState<Record<number, any[]>>({});
  const [courseSearchStatus, setCourseSearchStatus] = useState<Record<number, string>>({});

  const [savedApiCourses, setSavedApiCourses] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("duel_saved_api_courses");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const savedCourses = useMemo(
    () => [...COURSES, ...savedApiCourses],
    [savedApiCourses]
  );

  const visibleDays = dayConfigs.slice(0, days);
  const day = visibleDays[selectedDay] || dayConfigs[0];
  const roundStatus: RoundStatus = roundStatuses[selectedDay] || "setup";
  const dayEditable = roundStatus === "setup";

  const redPlayers = (roster?.Red || roster?.red || []).slice(0, players);
  const bluePlayers = (roster?.Blue || roster?.blue || []).slice(0, players);
  const allPlayers = [
    ...redPlayers.map((p: any) => ({ ...p, team: "red" })),
    ...bluePlayers.map((p: any) => ({ ...p, team: "blue" })),
  ];

  function persistRoundStatuses(next: Record<number, RoundStatus>) {
    setRoundStatuses(next);
    localStorage.setItem("duel_round_statuses", JSON.stringify(next));
  }

  function updateRoundStatus(dayIndex: number, status: RoundStatus) {
    const next = {
      ...roundStatuses,
      [dayIndex]: status,
    };

    persistRoundStatuses(next);

    setDayLocks?.((current: any) => ({
      ...(current || {}),
      [dayIndex]: status !== "setup",
    }));

    if (status === "live") {
      setEventStarted?.(true);
      setEventLocked?.(false);
    }
  }

  function setDay(dayIndex: number, key: string, value: any) {
    setDayConfigs((configs: any[]) =>
      configs.map((config, index) =>
        index === dayIndex
          ? {
              ...config,
              [key]: value,
            }
          : config
      )
    );
  }

  function updateEventDetails(key: string, value: any) {
    setEventDetails?.((current: any) => ({
      ...(current || {}),
      [key]: value,
    }));
  }

  function updatePlayer(team: "Red" | "Blue", index: number, key: string, value: any) {
    setRoster((current: any) => {
      const next = {
        ...current,
        Red: [...(current?.Red || [])],
        Blue: [...(current?.Blue || [])],
      };

      next[team][index] = {
        ...next[team][index],
        [key]: value,
      };

      return next;
    });
  }

  function updateTeamName(team: "Red" | "Blue", value: string) {
    setTeamNames((current: any) => ({
      ...(current || {}),
      [team]: value,
    }));
  }

  function readImageFile(file: File | undefined, done: (value: string) => void) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => done(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function courseLabel(course: any) {
    return course?.name || course?.shortName || course?.course_name || "Unknown Course";
  }

  function courseLocation(course: any) {
    return (
      [course?.region, course?.state, course?.province, course?.country]
        .filter(Boolean)
        .join(" • ") || (course?.source === "GolfCourseAPI" ? "Saved from GolfCourseAPI" : "Saved Course")
    );
  }

  function currentCourseFor(dayConfig: any) {
    return (
      savedCourses.find(
        (course: any) =>
          dayConfig?.courseId === course.id ||
          dayConfig?.course === course.shortName ||
          dayConfig?.course === course.name
      ) || null
    );
  }

  function getCourseTees(courseId: string) {
    const course = savedCourses.find((c: any) => c.id === courseId);
    return course?.tees?.map((tee: any) => tee.id) || ["Blue", "White", "Gold", "Red"];
  }

  function selectSavedCourseForDay(dayIndex: number, course: any) {
    const tee = getDefaultTee?.(course.id) || course?.tees?.[0]?.id || "Blue";

    setDayConfigs((configs: any[]) =>
      configs.map((config, index) =>
        index === dayIndex
          ? {
              ...config,
              courseId: course.id,
              course: course.shortName || course.name,
              tee,
            }
          : config
      )
    );
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
        [dayIndex]: "Search failed",
      }));
    }
  }

  function importApiCourse(course: any, dayIndex: number) {
    const id = getApiCourseId(course);
    const name = getApiCourseName(course);

    const imported = {
      id,
      name,
      shortName: name,
      region: getApiCourseLocation(course),
      country: "",
      source: "GolfCourseAPI",
      raw: course,
      tees: [
        { id: "Blue" },
        { id: "White" },
        { id: "Gold" },
        { id: "Red" },
      ],
    };

    setSavedApiCourses((current) => {
      const exists = current.some((c: any) => c.id === id);
      const next = exists ? current : [...current, imported];
      localStorage.setItem("duel_saved_api_courses", JSON.stringify(next));
      return next;
    });

    selectSavedCourseForDay(dayIndex, imported);
  }

  function removeSavedApiCourse(courseId: string) {
    setSavedApiCourses((current) => {
      const next = current.filter((course: any) => course.id !== courseId);
      localStorage.setItem("duel_saved_api_courses", JSON.stringify(next));
      return next;
    });
  }

  function updateCaptain(dayIndex: number, team: "red" | "blue", value: string) {
    const next = {
      ...captains,
      [dayIndex]: {
        ...(captains[dayIndex] || {}),
        [team]: value,
      },
    };

    setCaptains(next);
    localStorage.setItem("duel_round_captains", JSON.stringify(next));
  }

  function updateScorer(dayIndex: number, matchIndex: number, value: string) {
    const next = {
      ...groupScorers,
      [dayIndex]: {
        ...(groupScorers[dayIndex] || {}),
        [matchIndex]: value,
      },
    };

    setGroupScorers(next);
    localStorage.setItem("duel_group_scorers", JSON.stringify(next));
  }

  function matchCountForDay(format: string) {
    if (/stableford/i.test(format || "")) return 1;
    if (/singles/i.test(format || "")) return players;
    return Math.max(1, Math.ceil(players / 2));
  }

  function playerNameOptions(team?: "red" | "blue") {
    const source =
      team === "red" ? redPlayers : team === "blue" ? bluePlayers : allPlayers;

    return source
      .map((p: any) => p?.name)
      .filter(Boolean);
  }

  return (
    <div className="relative flex h-full max-w-full flex-col overflow-hidden text-white">
      <AdminHeaderNav
        activeTab={adminMode}
        setActiveTab={setAdminMode}
      />

      <div className="flex-1 overflow-y-auto pb-28 pt-[124px]">
        {adminMode === "day" && (
          <div>
            <StatusPanel eventStarted={eventStarted} />

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {visibleDays.map((_: any, index: number) => {
                const active = selectedDay === index;
                const status = (roundStatuses[index] || "setup") as RoundStatus;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedDay(index)}
                    className={cx(
                      "shrink-0 rounded-full border px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em]",
                      active
                        ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                        : "border-white/10 bg-black/35 text-white/70"
                    )}
                  >
                    Day {index + 1}
                    <span className="ml-2 opacity-60">{STATUS_LABEL[status]}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 rounded-[26px] border border-white/12 bg-black/45 p-4 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[22px] font-black uppercase tracking-[0.16em]">
                    Day {selectedDay + 1}
                  </div>

                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                    {dayEditable ? "Edit day setup" : "Day locked"}
                  </div>
                </div>

                <div
                  className={cx(
                    "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em]",
                    STATUS_STYLE[roundStatus]
                  )}
                >
                  {STATUS_LABEL[roundStatus]}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {roundStatus === "setup" && (
                  <ControlButton tone="gold" onClick={() => updateRoundStatus(selectedDay, "locked")}>
                    Lock Day
                  </ControlButton>
                )}

                {roundStatus === "locked" && (
                  <>
                    <ControlButton tone="dark" onClick={() => updateRoundStatus(selectedDay, "setup")}>
                      Edit Day
                    </ControlButton>

                    <ControlButton tone="green" onClick={() => updateRoundStatus(selectedDay, "live")}>
                      Start Duel
                    </ControlButton>
                  </>
                )}

                {roundStatus === "live" && (
                  <ControlButton tone="red" onClick={() => updateRoundStatus(selectedDay, "complete")}>
                    End Duel
                  </ControlButton>
                )}

                {roundStatus === "complete" && (
                  <>
                    <ControlButton tone="dark" onClick={() => updateRoundStatus(selectedDay, "setup")}>
                      Reopen Day
                    </ControlButton>

                    <ControlButton tone="gold" onClick={() => setScreen("home")}>
                      View Results
                    </ControlButton>
                  </>
                )}
              </div>

              <div className={cx("mt-5 space-y-4", !dayEditable && "pointer-events-none opacity-45")}>
                <InputGroup
                  label="1st Tee Time"
                  value={day?.teeTime || "8:00"}
                  onChange={(value: string) => setDay(selectedDay, "teeTime", value)}
                  type="select"
                  options={times}
                />

                <WeekendCoursePicker
                  dayIndex={selectedDay}
                  day={day}
                  courseMode={coursePickerMode[selectedDay] || "summary"}
                  setCourseMode={(mode: CoursePickerMode) =>
                    setCoursePickerMode((current) => ({
                      ...current,
                      [selectedDay]: mode,
                    }))
                  }
                  savedCourses={savedCourses}
                  selectSavedCourse={(course: any) => selectSavedCourseForDay(selectedDay, course)}
                  removeSavedApiCourse={removeSavedApiCourse}
                  courseSearch={courseSearch[selectedDay] || ""}
                  setCourseSearch={(value: string) =>
                    setCourseSearch((current) => ({
                      ...current,
                      [selectedDay]: value,
                    }))
                  }
                  handleCourseSearch={() => handleCourseSearch(selectedDay)}
                  courseSearchStatus={courseSearchStatus[selectedDay] || ""}
                  courseSearchResults={courseSearchResults[selectedDay] || []}
                  importApiCourse={(course: any) => importApiCourse(course, selectedDay)}
                  getApiCourseName={getApiCourseName}
                  getApiCourseLocation={getApiCourseLocation}
                  getApiCourseId={getApiCourseId}
                  currentCourse={currentCourseFor(day)}
                  courseLabel={courseLabel}
                  courseLocation={courseLocation}
                />

                <InputGroup
                  label="Tee"
                  value={day?.tee || "Blue"}
                  onChange={(value: string) => setDay(selectedDay, "tee", value)}
                  type="select"
                  options={getCourseTees(day?.courseId || "st-michaels")}
                />

                <InputGroup
                  label="Format"
                  value={day?.format || "Singles Match Play"}
                  onChange={(value: string) => setDay(selectedDay, "format", value)}
                  type="select"
                  options={validFormats(players)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <InputGroup
                    label={`${teamNames?.Red || "Red"} Captain`}
                    value={captains[selectedDay]?.red || ""}
                    onChange={(value: string) => updateCaptain(selectedDay, "red", value)}
                    type="select"
                    options={["", ...playerNameOptions("red")]}
                  />

                  <InputGroup
                    label={`${teamNames?.Blue || "Blue"} Captain`}
                    value={captains[selectedDay]?.blue || ""}
                    onChange={(value: string) => updateCaptain(selectedDay, "blue", value)}
                    type="select"
                    options={["", ...playerNameOptions("blue")]}
                  />
                </div>
              </div>
            </div>

            <PairingsAndScorers
              day={day}
              selectedDay={selectedDay}
              players={players}
              roster={roster}
              teamNames={teamNames}
              scorers={groupScorers[selectedDay] || {}}
              updateScorer={updateScorer}
              playerOptions={["", ...playerNameOptions()]}
              matchCount={matchCountForDay(day?.format || "")}
              editable={dayEditable}
            />

            <EventDetailsPanel
              eventDetails={eventDetails}
              updateEventDetails={updateEventDetails}
              players={players}
              setPlayers={setPlayers}
              days={days}
              setDays={setDays}
            />
          </div>
        )}

        {adminMode === "teams" && (
          <TeamsPanel
            editingTeam={editingTeam}
            setEditingTeam={setEditingTeam}
            teamNames={teamNames}
            updateTeamName={updateTeamName}
            teamLogos={teamLogos}
            setTeamLogos={setTeamLogos}
            readImageFile={readImageFile}
          />
        )}

        {adminMode === "hcps" && (
          <PlayersPanel
            editingTeam={editingTeam}
            setEditingTeam={setEditingTeam}
            teamNames={teamNames}
            teamLogos={teamLogos}
            roster={roster}
            players={players}
            updatePlayer={updatePlayer}
            readImageFile={readImageFile}
          />
        )}

        {adminMode === "pairings" && (
          <PairingsAndScorers
            day={day}
            selectedDay={selectedDay}
            players={players}
            roster={roster}
            teamNames={teamNames}
            scorers={groupScorers[selectedDay] || {}}
            updateScorer={updateScorer}
            playerOptions={["", ...playerNameOptions()]}
            matchCount={matchCountForDay(day?.format || "")}
            editable={dayEditable}
            expanded
          />
        )}
 

        {adminMode === "scorers" && (
          <PairingsAndScorers
            day={day}
            selectedDay={selectedDay}
            players={players}
            roster={roster}
            teamNames={teamNames}
            scorers={groupScorers[selectedDay] || {}}
            updateScorer={updateScorer}
            playerOptions={["", ...playerNameOptions()]}
            matchCount={matchCountForDay(day?.format || "")}
            editable={dayEditable}
            expanded
          />
        )}
     </div>
    </div>
  );
}

function StatusPanel({ eventStarted }: any) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
        Weekend Status
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-[24px] font-black uppercase tracking-[0.12em]">
          {eventStarted ? "Event Live" : "Setup Open"}
        </div>

        <div
          className={cx(
            "rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em]",
            eventStarted ? "bg-[#4ade80] text-black" : "border border-white/15 bg-black/35 text-white/60"
          )}
        >
          {eventStarted ? "Live" : "Admin"}
        </div>
      </div>
    </div>
  );
}

function ControlButton({ tone, onClick, children }: any) {
  const styles: Record<string, string> = {
    gold: "bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black",
    green: "bg-gradient-to-b from-[#86efac] via-[#22c55e] to-[#15803d] text-black",
    red: "bg-gradient-to-b from-[#fb7185] via-[#ef4444] to-[#991b1b] text-white",
    dark: "border border-white/12 bg-black/40 text-white/75",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em]",
        styles[tone] || styles.dark
      )}
    >
      {children}
    </button>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  type = "text",
  options = [],
}: any) {
  return (
    <div>
      <div className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>

      {type === "select" ? (
        <Select value={value} onChange={onChange} options={options} darkMode />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-[18px] border border-white/10 bg-black/40 px-4 py-3 text-[14px] font-bold text-white outline-none"
        />
      )}
    </div>
  );
}

function WeekendCoursePicker({
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
  currentCourse,
  courseLabel,
  courseLocation,
}: any) {
  const currentCourseName =
    courseLabel(currentCourse) || day?.course || "No course selected";

  const currentCourseLocation =
    currentCourse ? courseLocation(currentCourse) : "Choose a course for this day";

  if (courseMode === "summary") {
    return (
      <div>
        <div className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
          Course
        </div>

        <div className="rounded-[20px] border border-[#d1c79f]/35 bg-black/35 p-4">
          <div className="text-[8px] font-black uppercase tracking-[0.18em] text-[#d1c79f]/70">
            Current Course
          </div>

          <div className="mt-2 text-[14px] font-black uppercase tracking-[0.12em] text-white">
            {currentCourseName}
          </div>

          <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/42">
            {currentCourseLocation}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <ControlButton tone="gold" onClick={() => setCourseMode("saved")}>
              Choose Course
            </ControlButton>

            <ControlButton tone="dark" onClick={() => setCourseMode("search")}>
              Search API
            </ControlButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
          Course
        </div>

        <button
          type="button"
          onClick={() => setCourseMode("summary")}
          className="rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-white/60"
        >
          Close
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
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
        <div>
          <div className="max-h-[250px] space-y-2 overflow-y-auto pr-1">
            {savedCourses.map((course: any) => {
              const active =
                day?.courseId === course.id ||
                day?.course === course.shortName ||
                day?.course === course.name;

              const isApiCourse = course.source === "GolfCourseAPI";

              return (
                <div
                  key={course.id}
                  className={cx(
                    "rounded-[16px] border p-3",
                    active
                      ? "border-[#d1c79f]/70 bg-[#d1c79f]/12"
                      : "border-white/10 bg-black/35"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      selectSavedCourse(course);
                      setCourseMode("summary");
                    }}
                    className="w-full text-left"
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white">
                      {course.name}
                    </div>

                    <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                      {isApiCourse ? "Saved from GolfCourseAPI" : courseLocation(course)}
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

          <button
            type="button"
            onClick={() => setCourseMode("summary")}
            className="mt-3 w-full rounded-full bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] py-3 text-[10px] font-black uppercase tracking-[0.16em] text-black"
          >
            Save Day Setup
          </button>
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

          <div className="mt-3 max-h-[250px] space-y-2 overflow-y-auto pr-1">
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
                  onClick={() => {
                    importApiCourse(course);
                    setCourseMode("summary");
                  }}
                  className="mt-3 w-full rounded-full bg-[#d1c79f] py-2 text-[9px] font-black uppercase tracking-[0.14em] text-black"
                >
                  Import & Save
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCourseMode("summary")}
            className="mt-3 w-full rounded-full border border-white/12 bg-black/45 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/65"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function PairingsAndScorers({
  day,
  selectedDay,
  players,
  roster,
  teamNames,
  scorers,
  updateScorer,
  playerOptions,
  matchCount,
  editable,
  expanded = false,
}: any) {
  const red = (roster?.Red || roster?.red || []).slice(0, players);
  const blue = (roster?.Blue || roster?.blue || []).slice(0, players);

  function namesFor(team: "red" | "blue", index: number) {
    if (/singles/i.test(day?.format || "")) {
      return team === "red"
        ? red[index]?.name || `${teamNames?.Red || "Red"} ${index + 1}`
        : blue[index]?.name || `${teamNames?.Blue || "Blue"} ${index + 1}`;
    }

    if (/stableford/i.test(day?.format || "")) {
      return team === "red"
        ? red.map((p: any) => p?.name).filter(Boolean).join(" / ") || teamNames?.Red || "Red"
        : blue.map((p: any) => p?.name).filter(Boolean).join(" / ") || teamNames?.Blue || "Blue";
    }

    const start = index * 2;
    const source = team === "red" ? red : blue;
    return (
      source
        .slice(start, start + 2)
        .map((p: any) => p?.name)
        .filter(Boolean)
        .join(" / ") || (team === "red" ? teamNames?.Red || "Red" : teamNames?.Blue || "Blue")
    );
  }

  return (
    <div className="mt-4 rounded-[26px] border border-white/12 bg-black/45 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d1c79f]">
            Team Pairings & Scorers
          </div>

          <div className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/40">
            Day {selectedDay + 1} • {day?.format}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {Array.from({ length: matchCount }, (_, index) => (
          <div
            key={index}
            className="rounded-[18px] border border-white/10 bg-black/35 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                Match {index + 1}
              </div>

              <div className="rounded-full border border-[#d1c79f]/25 bg-black/35 px-3 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#d1c79f]">
                {editable ? "Editable" : "Locked"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="text-[13px] font-black uppercase tracking-[0.06em] text-red-100">
                {namesFor("red", index)}
              </div>

              <div className="text-[13px] font-black text-white/70">VS</div>

              <div className="text-right text-[13px] font-black uppercase tracking-[0.06em] text-blue-100">
                {namesFor("blue", index)}
              </div>
            </div>

            <div className={cx("mt-3", !editable && "pointer-events-none opacity-45")}>
              <InputGroup
                label="Group Scorer"
                value={scorers[index] || ""}
                onChange={(value: string) => updateScorer(selectedDay, index, value)}
                type="select"
                options={playerOptions}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetailsPanel({
  eventDetails,
  updateEventDetails,
  players,
  setPlayers,
  days,
  setDays,
}: any) {
  return (
    <div className="mt-4 rounded-[26px] border border-white/12 bg-black/35 p-4 backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d1c79f]">
        Event Details
      </div>

      <div className="mt-4 space-y-3">
        <InputGroup
          label="Event Name"
          value={eventDetails?.name || ""}
          onChange={(value: string) => updateEventDetails("name", value)}
        />

        <InputGroup
          label="Location"
          value={eventDetails?.location || ""}
          onChange={(value: string) => updateEventDetails("location", value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <InputGroup
            label="Players / Team"
            value={players}
            onChange={(value: any) => setPlayers(Number(value))}
            type="select"
            options={playerOptions}
          />

          <InputGroup
            label="Comp Days"
            value={days}
            onChange={(value: any) => setDays(Number(value))}
            type="select"
            options={[1, 2, 3, 4]}
          />
        </div>
      </div>
    </div>
  );
}

function TeamsPanel({
  editingTeam,
  setEditingTeam,
  teamNames,
  updateTeamName,
  teamLogos,
  setTeamLogos,
  readImageFile,
}: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button active={editingTeam === "Red"} onClick={() => setEditingTeam("Red")}>
          {teamNames?.Red || "Team Red"}
        </Button>

        <Button active={editingTeam === "Blue"} onClick={() => setEditingTeam("Blue")}>
          {teamNames?.Blue || "Team Blue"}
        </Button>
      </div>

      <div className="rounded-[26px] border border-white/12 bg-black/45 p-4 backdrop-blur-xl">
        <div className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#d1c79f]">
          Team Setup
        </div>

        <div className="flex items-center gap-4">
          <label className="cursor-pointer">
            <Logo
              team={editingTeam === "Red" ? "red" : "blue"}
              size="h-20 w-20"
              src={teamLogos?.[editingTeam]}
            />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                readImageFile(e.target.files?.[0], (value: string) =>
                  setTeamLogos((current: any) => ({
                    ...(current || {}),
                    [editingTeam]: value,
                  }))
                )
              }
            />
          </label>

          <div className="min-w-0 flex-1">
            <InputGroup
              label="Team Name"
              value={teamNames?.[editingTeam] || ""}
              onChange={(value: string) => updateTeamName(editingTeam, value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayersPanel({
  editingTeam,
  setEditingTeam,
  teamNames,
  teamLogos,
  roster,
  players,
  updatePlayer,
  readImageFile,
}: any) {
  const teamRoster = (roster?.[editingTeam] || []).slice(0, players);
  const teamKey = editingTeam === "Red" ? "red" : "blue";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button active={editingTeam === "Red"} onClick={() => setEditingTeam("Red")}>
          {teamNames?.Red || "Team Red"}
        </Button>

        <Button active={editingTeam === "Blue"} onClick={() => setEditingTeam("Blue")}>
          {teamNames?.Blue || "Team Blue"}
        </Button>
      </div>

      <div className="space-y-3">
        {teamRoster.map((player: any, index: number) => (
          <div
            key={`${editingTeam}-${index}`}
            className="rounded-[22px] border border-white/12 bg-black/45 p-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <Logo
                  team={teamKey}
                  size="h-14 w-14"
                  src={player?.photo || teamLogos?.[editingTeam]}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    readImageFile(e.target.files?.[0], (value: string) =>
                      updatePlayer(editingTeam, index, "photo", value)
                    )
                  }
                />
              </label>

              <div className="min-w-0 flex-1">
                <input
                  value={player?.name || ""}
                  onChange={(e) => updatePlayer(editingTeam, index, "name", e.target.value)}
                  className="w-full bg-transparent text-[16px] font-black text-white outline-none"
                />

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    value={player?.handicap ?? ""}
                    onChange={(e) => updatePlayer(editingTeam, index, "handicap", Number(e.target.value))}
                    placeholder="HCP"
                    type="number"
                    step="0.1"
                    className="rounded-[12px] border border-white/10 bg-black/35 px-3 py-2 text-[12px] font-bold text-white outline-none"
                  />

                  <input
                    value={player?.playingHandicap ?? player?.handicap ?? ""}
                    onChange={(e) => updatePlayer(editingTeam, index, "playingHandicap", Number(e.target.value))}
                    placeholder="Playing"
                    type="number"
                    step="1"
                    className="rounded-[12px] border border-white/10 bg-black/35 px-3 py-2 text-[12px] font-bold text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
