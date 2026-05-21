// src/QuickGame.tsx

import { useMemo, useState } from "react";
import { searchCourses } from "./lib/golfCourseApi";
import { COURSES, getCourseById, getCourseTees, getDefaultTee } from "./courses";
import PlayerCard from "./components/quickgame/PlayerCard";

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}


const QUICK_FORMATS = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "2-Ball Ambrose",
  "Stableford",
  "2-Ball Better Ball Stableford",
];

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
  const [savedApiCourses, setSavedApiCourses] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("duel_saved_api_courses");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [courseMode, setCourseMode] = useState<"saved" | "search">("search");
  const [courseId, setCourseId] = useState("st-michaels");
  const [selectedCourseTouched, setSelectedCourseTouched] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseSearchResults, setCourseSearchResults] = useState<any[]>([]);
  const [courseSearchStatus, setCourseSearchStatus] = useState("");

  const savedCourses = useMemo(
    () => [...COURSES, ...savedApiCourses],
    [savedApiCourses]
  );

  const recentSavedCourses = useMemo(
    () => savedCourses.slice(-3).reverse(),
    [savedCourses]
  );

  const selectedSavedCourse = useMemo(
    () => savedCourses.find((course: any) => course.id === courseId) || COURSES[0],
    [savedCourses, courseId]
  );

  const tees = useMemo(() => {
    const localCourse = COURSES.find((course) => course.id === courseId);

    if (localCourse) {
      return getCourseTees(courseId);
    }

    const rawCourse = selectedSavedCourse?.raw || selectedSavedCourse || {};
    const rawTees = rawCourse?.tees || {};

    const maleTees = Array.isArray(rawTees?.male) ? rawTees.male : [];
    const femaleTees = Array.isArray(rawTees?.female) ? rawTees.female : [];

    // Quick Game defaults to men's tee data when the API separates tees by gender.
    // This prevents women's combination tees, such as Red/Yellow, appearing in the men's setup flow.
    const flatTees = Array.isArray(rawTees)
      ? rawTees
      : maleTees.length
      ? maleTees
      : femaleTees;

    if (flatTees.length) {
      return flatTees.map((apiTee: any, index: number) => {
        const teeName = String(apiTee?.tee_name || apiTee?.name || `Tee ${index + 1}`);
        const simpleLabel =
          teeName
            .split(",")
            .map((part) => part.trim())
            .find((part) =>
              ["blue", "white", "gold", "red", "black", "yellow", "green"].includes(
                part.toLowerCase()
              )
            ) || teeName;

        return {
          id: simpleLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          label: simpleLabel,
          name: simpleLabel,
          fullName: teeName,
          slope: Number(apiTee?.slope_rating || apiTee?.slope || 113),
          slopeRating: Number(apiTee?.slope_rating || apiTee?.slope || 113),
          courseRating: Number(apiTee?.course_rating || apiTee?.rating || 72),
          course_rating: Number(apiTee?.course_rating || apiTee?.rating || 72),
          par: Number(apiTee?.par_total || apiTee?.par || 72),
          par_total: Number(apiTee?.par_total || apiTee?.par || 72),
          holes: apiTee?.holes || [],
          raw: apiTee,
        };
      });
    }

    return getCourseTees("st-michaels");
  }, [courseId, selectedSavedCourse]);

  const [playersPerTeam, setPlayersPerTeam] = useState(1);
  const [format, setFormat] = useState("Singles Match Play");
  const [tee, setTee] = useState(getDefaultTee(courseId));

  const [redName, setRedName] = useState("Team Red");
  const [blueName, setBlueName] = useState("Team Blue");

  const [redPlayers, setRedPlayers] = useState([
    { name: "Red 1", handicap: "18.0" },
    { name: "Red 2", handicap: "18.0" },
  ]);

  const [bluePlayers, setBluePlayers] = useState([
    { name: "Blue 1", handicap: "18.0" },
    { name: "Blue 2", handicap: "18.0" },
  ]);

  function changeCourse(nextCourseId: string) {
    setCourseId(nextCourseId);
    setSelectedCourseTouched(true);

    const localCourse = COURSES.find((course) => course.id === nextCourseId);

    setTee(localCourse ? getDefaultTee(nextCourseId) : getDefaultTee("st-michaels"));
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
    const raw = course?.raw || course || {};

    const country =
      raw?.country ||
      raw?.country_name ||
      raw?.nation ||
      raw?.location?.country ||
      raw?.address?.country ||
      "";

    const state =
      raw?.state ||
      raw?.state_name ||
      raw?.province ||
      raw?.region ||
      raw?.administrative_area ||
      raw?.location?.state ||
      raw?.location?.region ||
      raw?.address?.state ||
      raw?.address?.region ||
      "";

    const county =
      raw?.county ||
      raw?.county_name ||
      raw?.district ||
      raw?.municipality ||
      raw?.location?.county ||
      raw?.address?.county ||
      "";

    const city =
      raw?.city ||
      raw?.town ||
      raw?.suburb ||
      raw?.locality ||
      raw?.location?.city ||
      raw?.location?.town ||
      raw?.address?.city ||
      raw?.address?.suburb ||
      "";

    const postcode =
      raw?.postcode ||
      raw?.postal_code ||
      raw?.zip ||
      raw?.address?.postcode ||
      raw?.address?.postal_code ||
      "";

    const parts = [country, state || county, city, postcode].filter(Boolean);

    return parts.length ? parts.join(" • ") : "";
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

  async function handleCourseSearch() {
    const query = courseSearch.trim();

    if (!query) {
      setCourseSearchStatus("Enter a course name first");
      return;
    }

    setCourseSearchStatus("Searching...");

    try {
      const result = await searchCourses(query);
      const courses = Array.isArray(result?.courses)
        ? result.courses
        : Array.isArray(result)
        ? result
        : [];

      console.log("GolfCourseAPI search result:", result);

      setCourseSearchResults(courses);
      setCourseSearchStatus(
        courses.length
          ? `${courses.length} result${courses.length === 1 ? "" : "s"} found`
          : "No courses found"
      );
    } catch (error) {
      console.error("GolfCourseAPI search error:", error);
      setCourseSearchStatus("Search failed — check console");
    }
  }

  function importApiCourse(apiCourse: any) {
    const apiId = getApiCourseId(apiCourse);
    const importedCourse = {
      id: `api-${apiId}`,
      name: getApiCourseName(apiCourse),
      shortName: getApiCourseName(apiCourse),
      region: getApiCourseLocation(apiCourse),
      country:
        apiCourse?.country ||
        apiCourse?.country_name ||
        apiCourse?.location?.country ||
        apiCourse?.address?.country ||
        "",
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

    setCourseId(importedCourse.id);
    setSelectedCourseTouched(true);

    const firstMaleTee = Array.isArray(apiCourse?.tees?.male)
      ? apiCourse.tees.male[0]
      : null;
    const firstApiTeeName = String(firstMaleTee?.tee_name || "White");
    const firstApiTeeLabel =
      firstApiTeeName
        .split(",")
        .map((part) => part.trim())
        .find((part) =>
          ["blue", "white", "gold", "red", "black", "yellow", "green"].includes(
            part.toLowerCase()
          )
        ) || "white";

    setTee(firstApiTeeLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    setCourseMode("saved");
    setCourseSearchStatus(`Saved ${importedCourse.name}`);
  }

  function removeSavedApiCourse(courseIdToRemove: string) {
    setSavedApiCourses((current: any[]) => {
      const next = current.filter((course) => course.id !== courseIdToRemove);

      localStorage.setItem("duel_saved_api_courses", JSON.stringify(next));

      return next;
    });

    if (courseId === courseIdToRemove) {
      changeCourse("st-michaels");
    }
  }

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
              [key]:
                key === "handicap"
                  ? String(value)
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1")
                  : value,
            }
          : p
      )
    );
  }

  function getApiTeeLabel(apiTee: any) {
    const teeName = String(
      apiTee?.tee_name ||
        apiTee?.name ||
        apiTee?.label ||
        apiTee?.colour ||
        apiTee?.color ||
        ""
    );

    const simpleLabel =
      teeName
        .split(",")
        .map((part) => part.trim())
        .find((part) =>
          ["blue", "white", "gold", "red", "black", "yellow", "green"].includes(
            part.toLowerCase()
          )
        ) || teeName;

    return simpleLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function selectedTeeData() {
    const localTee = tees.find(
      (t: any) =>
        String(t.id || "").toLowerCase() === String(tee || "").toLowerCase() ||
        String(t.label || "").toLowerCase() === String(tee || "").toLowerCase() ||
        String(t.name || "").toLowerCase() === String(tee || "").toLowerCase()
    );

    const rawCourse = selectedSavedCourse?.raw || selectedSavedCourse || {};
    const rawTees = rawCourse?.tees || {};

    const maleTees = Array.isArray(rawTees?.male) ? rawTees.male : [];
    const femaleTees = Array.isArray(rawTees?.female) ? rawTees.female : [];
    const flatApiTees = Array.isArray(rawTees)
      ? rawTees
      : [...maleTees, ...femaleTees];

    const apiTee = flatApiTees.find(
      (apiTee: any) => getApiTeeLabel(apiTee) === String(tee || "").toLowerCase()
    );

    return {
      ...(localTee || {}),
      ...(apiTee || {}),
      raw: apiTee || localTee?.raw || localTee || {},
    };
  }

  function teeNumberValue(teeData: any, keys: string[], fallback: number) {
    const sources = [teeData, teeData?.raw].filter(Boolean);

    for (const source of sources) {
      for (const key of keys) {
        const value = key
          .split(".")
          .reduce((current: any, part: string) => current?.[part], source);

        if (value !== undefined && value !== null && value !== "") {
          const numeric = Number(value);

          if (Number.isFinite(numeric)) {
            return numeric;
          }
        }
      }
    }

    return fallback;
  }

  function selectedTeeSlope() {
    const teeData = selectedTeeData();

    return teeNumberValue(
      teeData,
      [
        "slope_rating",
        "slope",
        "slopeRating",
        "menSlope",
        "mensSlope",
        "men.slope",
        "men.slope_rating",
        "ratings.men.slope",
      ],
      113
    );
  }

  function selectedTeeCourseRating() {
    const teeData = selectedTeeData();

    return teeNumberValue(
      teeData,
      [
        "course_rating",
        "courseRating",
        "rating",
        "scratchRating",
        "scratch_rating",
        "menRating",
        "mensRating",
        "men.rating",
        "men.course_rating",
        "ratings.men.rating",
        "ratings.men.course_rating",
      ],
      selectedTeePar()
    );
  }

  function selectedTeePar() {
    const teeData = selectedTeeData();

    return teeNumberValue(
      teeData,
      [
        "par_total",
        "par",
        "mensPar",
        "menPar",
        "men.par",
        "ratings.men.par",
      ],
      72
    );
  }

  function playingHandicap(rawHandicap: any) {
    const handicapIndex = Number(rawHandicap || 0);
    const slope = selectedTeeSlope();
    const courseRating = selectedTeeCourseRating();
    const par = selectedTeePar();

    const courseHandicap =
      handicapIndex * (slope / 113) + (courseRating - par);

    // DUEL displays the practical playing handicap as a whole number.
    // For St Michaels White, this keeps HI 12.4 / 12.5 at PLAY 14,
    // matching the official value you provided.
    return Math.floor(courseHandicap);
  }

  function startQuickGame() {
    const selectedCourse = selectedSavedCourse || getCourseById("st-michaels");

    const red = redPlayers.slice(0, playersPerTeam).map((p, i) => ({
      id: `quick-red-${i}`,
      name: p.name || `Red ${i + 1}`,
      nickname: p.name || `Red ${i + 1}`,
      handicap: playingHandicap(p.handicap),
      rawHandicap: Number(p.handicap || 0),
      playingHandicap: playingHandicap(p.handicap),
      team: "red",
      teamId: "red",
      rosterIndex: i,
      photo: p.photo || "",
      image: p.photo || "",
      photoUrl: p.photo || "",
      avatar: p.photo || "",
      homeClub: "",
      preferredTee: tee,
      regular: false,
    }));

    const blue = bluePlayers.slice(0, playersPerTeam).map((p, i) => ({
      id: `quick-blue-${i}`,
      name: p.name || `Blue ${i + 1}`,
      nickname: p.name || `Blue ${i + 1}`,
      handicap: playingHandicap(p.handicap),
      rawHandicap: Number(p.handicap || 0),
      playingHandicap: playingHandicap(p.handicap),
      team: "blue",
      teamId: "blue",
      rosterIndex: i,
      photo: p.photo || "",
      image: p.photo || "",
      photoUrl: p.photo || "",
      avatar: p.photo || "",
      homeClub: "",
      preferredTee: tee,
      regular: false,
    }));

    setPlayers(playersPerTeam);
    setTeamNames({ Red: redName, Blue: blueName });
    setRoster({ Red: red, Blue: blue });

    setDayConfigs([
      {
        label: "Quick Game",
        teeTime: "",
        courseId,
        course: selectedCourse.shortName || selectedCourse.name,
        tee,
        teeSlope: selectedTeeSlope(),
        teeCourseRating: selectedTeeCourseRating(),
        teePar: selectedTeePar(),
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

        <div className="mb-3 mt-3 grid grid-cols-2 gap-3">
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

        <Section title="Course">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCourseMode("search")}
              className={cx(
                "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all",
                courseMode === "search"
                  ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                  : "border-white/12 bg-black/42 text-white"
              )}
            >
              Course Search
            </button>

            <button
              type="button"
              onClick={() => setCourseMode("saved")}
              className={cx(
                "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all",
                courseMode === "saved"
                  ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                  : "border-white/12 bg-black/42 text-white"
              )}
            >
              Saved
            </button>
          </div>

          {courseMode === "search" ? (
            <div className="rounded-[18px] border border-white/10 bg-black/28 p-3">
              <div className="grid grid-cols-[1fr_78px] gap-2">
                <input
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search course"
                  className="w-full rounded-full border border-white/10 bg-black/50 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-white outline-none placeholder:text-white/25"
                />

                <button
                  type="button"
                  onClick={handleCourseSearch}
                  className="rounded-full border border-[#d1c79f]/50 bg-[#d1c79f] px-2 py-2.5 text-[8px] font-black uppercase tracking-[0.08em] text-black"
                >
                  Search
                </button>
              </div>

              {courseSearchStatus ? (
                <div className="mt-2 text-center text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
                  {courseSearchStatus}
                </div>
              ) : null}

              {courseSearchResults.length ? (
                <div className="mt-3 space-y-2">
                  {courseSearchResults.slice(0, 3).map((course: any, index: number) => (
                    <div
                      key={`${getApiCourseId(course)}-${index}`}
                      className="rounded-[16px] border border-white/10 bg-black/35 p-3"
                    >
                      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white">
                        {getApiCourseName(course)}
                      </div>

                      <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                        {getApiCourseLocation(course) || "Course details unavailable"}
                      </div>

                      <button
                        type="button"
                        onClick={() => importApiCourse(course)}
                        className="mt-2 w-full rounded-full bg-[#d1c79f] py-2 text-[8px] font-black uppercase tracking-[0.14em] text-black"
                      >
                        Import & Save
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[18px] border border-white/10 bg-black/28 p-3">
              <div className="mb-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/42">
                Last 3 Saved Courses
              </div>

              <div className="space-y-2">
                {recentSavedCourses.map((course: any) => {
                  const active = courseId === course.id;
                  const isApiCourse = course.source === "GolfCourseAPI";

                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => changeCourse(course.id)}
                      className={cx(
                        "w-full rounded-[16px] border p-3 text-left transition-all",
                        active
                          ? "border-[#d1c79f]/70 bg-[#d1c79f]/12"
                          : "border-white/10 bg-black/35"
                      )}
                    >
                      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white">
                        {course.name}
                      </div>

                      <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                        {isApiCourse
                          ? course.region || "Saved from GolfCourseAPI"
                          : `${course.region || ""}${
                              course.country ? ` • ${course.country}` : ""
                            }` || "Saved Course"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Section>


        {selectedCourseTouched ? (
          <div className="mt-3 rounded-[20px] border border-[#d1c79f]/45 bg-black/46 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            <div className="text-[7px] font-black uppercase tracking-[0.24em] text-[#d1c79f]/70">
              Selected Course
            </div>

            <div className="mt-1 text-[13px] font-black uppercase tracking-[0.1em] text-white">
              {selectedSavedCourse?.name || "Course Selected"}
            </div>

            <div className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/42">
              {selectedSavedCourse?.region ||
                selectedSavedCourse?.country ||
                "Ready for tee selection"}
            </div>

            <div className="mt-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#d1c79f]/70">
              Par {selectedTeePar()} • Rating {selectedTeeCourseRating().toFixed(1)} • Slope {selectedTeeSlope()}
            </div>
          </div>
        ) : null}

        <Section title="Tee">
          <div className="grid grid-cols-4 gap-2">
            {tees.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTee(t.id)}
                className={cx(
                  "rounded-2xl border px-2 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition-all",
                  tee === t.id
                    ? "border-[#d1c79f] bg-[#d1c79f] text-black"
                    : "border-white/12 bg-black/42 text-white"
                )}
              >
                <div className="leading-none">
                  <div>{t.label}</div>
                  <div className="mt-1 text-[7px] opacity-45">
                    S{t.slope || t.slopeRating || t.slope_rating || 113}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Section>

        <div className="space-y-3">
          <TeamSetupColumn
            tone="red"
            teamName={redName}
            setTeamName={setRedName}
            players={redPlayers}
            count={playersPerTeam}
            updatePlayer={updatePlayer}
            courseSlope={selectedTeeSlope()}
            playingHandicap={playingHandicap}
          />

          <TeamSetupColumn
            tone="blue"
            teamName={blueName}
            setTeamName={setBlueName}
            players={bluePlayers}
            count={playersPerTeam}
            updatePlayer={updatePlayer}
            courseSlope={selectedTeeSlope()}
            playingHandicap={playingHandicap}
          />
        </div>

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
  courseSlope,
  playingHandicap,
}: any) {
  const isRed = tone === "red";

  return (
    <div
      className={cx(
        "rounded-[28px] border p-3 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl",
        isRed
          ? "border-[#7a2424]/65 bg-[#320611]"
          : "border-[#33466c]/70 bg-[#0a142b]"
      )}
    >
      <div className="mb-3">
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full border-0 bg-transparent p-0 text-[20px] font-black uppercase leading-none text-white outline-none placeholder:text-white/25"
        />

        <div
          className={cx(
            "mt-3 h-[2px] w-full rounded-full",
            isRed ? "bg-[#781522]" : "bg-[#223a65]"
          )}
        />
      </div>

      <div className="space-y-2.5">
        {players.slice(0, count).map((p: any, i: number) => (
          <PlayerCard
            key={i}
            tone={tone}
            player={p}
            index={i}
            playingHandicap={playingHandicap}
            updatePlayer={updatePlayer}
          />
        ))}
      </div>

      <div className="mt-2 text-center text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        Playing handicap calculated from slope {courseSlope || 113}
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
