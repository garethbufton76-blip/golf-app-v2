// src/QuickGame.tsx

import { useMemo, useState } from "react";
import { searchCourses } from "./lib/golfCourseApi";
import { COURSES, getCourseById, getCourseTees, getDefaultTee } from "./courses";
import PlayerCard from "./components/quickgame/PlayerCard";
import { useDuelTheme } from "./useDuelTheme";

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
  const { theme } = useDuelTheme();

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
  const [showCourseSearchPanel, setShowCourseSearchPanel] = useState(false);
  const [showSavedCoursesPanel, setShowSavedCoursesPanel] = useState(false);

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

  function cleanApiTeeLabel(apiTee: any, index = 0) {
    const rawName = String(
      apiTee?.tee_name ||
        apiTee?.name ||
        apiTee?.label ||
        apiTee?.colour ||
        apiTee?.color ||
        `Tee ${index + 1}`
    );

    const parts = rawName
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => !/^\d+$/.test(part))
      .filter((part) => !/^usga$/i.test(part))
      .filter((part) => !/^men$/i.test(part))
      .filter((part) => !/^women$/i.test(part));

    const cleaned = parts
      .map((part) =>
        part
          .replace(/\s*\/\s*/g, "/")
          .replace(/\btee\b/gi, "")
          .trim()
      )
      .filter(Boolean);

    const colourWords = ["black", "blue", "white", "gold", "red", "yellow", "green"];

    const meaningful = cleaned.filter((part) => {
      const lower = part.toLowerCase();

      return (
        colourWords.some((colour) => lower.includes(colour)) ||
        lower.includes("challenge") ||
        lower.includes("championship") ||
        lower.includes("composite") ||
        lower.includes("social")
      );
    });

    if (meaningful.length) {
      const label = meaningful.join(" ").replace(/\s+/g, " ").toUpperCase();

      return label;
    }

    return (cleaned[0] || rawName).toUpperCase();
  }

  function apiTeeId(apiTee: any, index = 0) {
    const label = cleanApiTeeLabel(apiTee, index);
    const slope = Number(apiTee?.slope_rating || apiTee?.slope || 113);
    const rating = Number(apiTee?.course_rating || apiTee?.rating || 72);
    const par = Number(apiTee?.par_total || apiTee?.par || 72);

    return `${label}-${slope}-${rating}-${par}-${index}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const tees = useMemo(() => {
    const localCourse = COURSES.find((course) => course.id === courseId);

    if (localCourse) {
      return getCourseTees(courseId);
    }

    const rawCourse = selectedSavedCourse?.raw || selectedSavedCourse || {};
    const rawTees = rawCourse?.tees || {};

    const maleTees = Array.isArray(rawTees?.male) ? rawTees.male : [];
    const femaleTees = Array.isArray(rawTees?.female) ? rawTees.female : [];

    const femaleRedOnly = femaleTees.filter((apiTee: any) => {
      const teeName = String(apiTee?.tee_name || apiTee?.name || "").toLowerCase();

      return teeName.includes("red") && !teeName.includes("yellow");
    });

    const maleHasRed = maleTees.some((apiTee: any) => {
      const teeName = String(apiTee?.tee_name || apiTee?.name || "").toLowerCase();

      return teeName.includes("red");
    });

    // Quick Game prefers men's tee data, but many Australian courses store the Red tee
    // only in the female API set. Keep a single Red tee available and remove combo tees
    // such as Red/Yellow.
    const flatTees = Array.isArray(rawTees)
      ? rawTees
      : maleTees.length
      ? [...maleTees, ...(maleHasRed ? [] : femaleRedOnly)]
      : femaleTees;

    if (flatTees.length) {
      const mappedTees = flatTees.map((apiTee: any, index: number) => {
        const teeName = String(apiTee?.tee_name || apiTee?.name || `Tee ${index + 1}`);
        const cleanLabel = cleanApiTeeLabel(apiTee, index);
        const uniqueId = apiTeeId(apiTee, index);

        return {
          id: uniqueId,
          label: cleanLabel,
          name: cleanLabel,
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

      const exactDedupedTees = mappedTees.filter(
        (tee: any, index: number, arr: any[]) =>
          arr.findIndex(
            (t: any) =>
              t.label === tee.label &&
              t.slope === tee.slope &&
              Number(t.courseRating).toFixed(1) ===
                Number(tee.courseRating).toFixed(1) &&
              t.par === tee.par
          ) === index
      );

      const seenStandardColours = new Set<string>();

      return exactDedupedTees.filter((tee: any) => {
        const label = String(tee.label || "").toUpperCase();
        const fullName = String(tee.fullName || "").toUpperCase();

        const isSpecialTee =
          /CHALLENGE|CHAMPIONSHIP|COMPOSITE|TOURNAMENT/.test(label) ||
          /CHALLENGE|CHAMPIONSHIP|COMPOSITE|TOURNAMENT/.test(fullName);

        const colourMatch = label.match(
          /\b(BLACK|BLUE|WHITE|GOLD|RED|YELLOW|GREEN)\b/
        );

        if (!colourMatch || isSpecialTee || label.includes("/")) {
          return true;
        }

        const colour = colourMatch[1];

        if (seenStandardColours.has(colour)) {
          return false;
        }

        seenStandardColours.add(colour);

        return true;
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

    setTee(firstMaleTee ? apiTeeId(firstMaleTee, 0) : "white");
    setCourseMode("saved");
    setShowCourseSearchPanel(false);
    setShowSavedCoursesPanel(false);
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

  function getApiTeeLabel(apiTee: any, index = 0) {
    return apiTeeId(apiTee, index);
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
      (apiTee: any, index: number) =>
        getApiTeeLabel(apiTee, index) === String(tee || "").toLowerCase()
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

  function formatAllowance() {
    const f = String(format || "").toLowerCase();

    if (f.includes("ambrose")) {
      return 0.25;
    }

    if (f.includes("better ball")) {
      return 0.85;
    }

    if (f.includes("stableford")) {
      return 0.95;
    }

    return 1;
  }

  function courseHandicap(rawHandicap: any) {
    const handicapIndex = Number(rawHandicap || 0);
    const slope = selectedTeeSlope();
    const courseRating = selectedTeeCourseRating();
    const par = selectedTeePar();

    const calculated =
      handicapIndex * (slope / 113) + (courseRating - par);

    return Math.round(calculated);
  }

  function playingHandicap(rawHandicap: any) {
    const courseHcp = courseHandicap(rawHandicap);
    const allowance = formatAllowance();

    return Math.round(courseHcp * allowance);
  }

  function startQuickGame() {
    const selectedCourse = selectedSavedCourse || getCourseById("st-michaels");

    // The current Score screen still expects a seeded/local course id so it can
    // read hole-by-hole data safely. API courses are used here for course name,
    // tee rating, slope and handicap calculations, but we fall back to the
    // seeded St Michaels hole model until the Score screen is upgraded to read
    // API hole arrays directly.
    const localScoreCourse = COURSES.find((course: any) => course.id === courseId);
    const scoreCourseId = localScoreCourse ? courseId : "st-michaels";
    const scoreCourse = localScoreCourse || getCourseById("st-michaels");

    const red = redPlayers.slice(0, playersPerTeam).map((p, i) => ({
      id: `quick-red-${i}`,
      name: p.name || `Red ${i + 1}`,
      nickname: p.name || `Red ${i + 1}`,
      handicap: playingHandicap(p.handicap),
      rawHandicap: Number(p.handicap || 0),
      courseHandicap: courseHandicap(p.handicap),
      playingHandicap: playingHandicap(p.handicap),
      handicapAllowance: formatAllowance(),
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
      courseHandicap: courseHandicap(p.handicap),
      playingHandicap: playingHandicap(p.handicap),
      handicapAllowance: formatAllowance(),
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
        courseId: scoreCourseId,
        displayCourseId: courseId,
        course: selectedCourse.shortName || selectedCourse.name,
        scoringCourse: scoreCourse?.shortName || scoreCourse?.name || "St Michaels",
        tee,
        teeSlope: selectedTeeSlope(),
        teeCourseRating: selectedTeeCourseRating(),
        teePar: selectedTeePar(),
        handicapAllowance: formatAllowance(),
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
    <div className={cx("relative h-full w-full overflow-y-auto pb-24", theme.app)}>
      <div className="relative z-20 mx-auto max-w-[430px]">
        <div className="mb-3 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.32em] {theme.textGold}">
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
                    ? theme.goldButton
                    : theme.darkButton
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
              onClick={() => {
                setCourseMode("search");
                setShowCourseSearchPanel(true);
                setShowSavedCoursesPanel(false);
              }}
              className={cx(
                "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all",
                courseMode === "search"
                  ? theme.goldButton
                  : theme.darkButton
              )}
            >
              Course Search
            </button>

            <button
              type="button"
              onClick={() => {
                setCourseMode("saved");
                setShowSavedCoursesPanel(true);
                setShowCourseSearchPanel(false);
              }}
              className={cx(
                "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all",
                courseMode === "saved"
                  ? theme.goldButton
                  : theme.darkButton
              )}
            >
              Saved
            </button>
          </div>

          {showCourseSearchPanel ? (
            <div className="rounded-[18px] p-3 transition-all duration-300 {theme.panelSoft}">
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
          ) : null}

          {showSavedCoursesPanel ? (
            <div className="rounded-[18px] p-3 transition-all duration-300 {theme.panelSoft}">
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
                      onClick={() => {
                        changeCourse(course.id);
                        setShowCourseSearchPanel(false);
                        setShowSavedCoursesPanel(false);
                      }}
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
          ) : null}
        </Section>

        {selectedCourseTouched ? (
          <div className={cx("mt-3 rounded-[20px] p-3", theme.panel)}>
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
                  "min-h-[58px] rounded-2xl border px-2 py-2 text-[9px] font-black uppercase tracking-[0.08em] transition-all",
                  tee === t.id
                    ? theme.goldButton
                    : theme.darkButton
                )}
              >
                <div className="leading-[0.95]">
                  <div className="break-words">{t.label}</div>
                  <div className="mt-1 text-[7px] opacity-45">
                    S{t.slope || t.slopeRating || t.slope_rating || 113}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Format">
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className={cx("w-full appearance-none rounded-2xl px-4 py-3 pr-10 text-[12px] font-black uppercase tracking-[0.06em] outline-none", theme.panelSoft, theme.textPrimary)}
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

          <div className="mt-2 text-center text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
            Playing handicap allowance: {Math.round(formatAllowance() * 100)}%
          </div>
        </Section>

        <div className="mt-3 space-y-3">
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
        Playing handicap calculated from slope {courseSlope || 113} and format allowance
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  const { theme } = useDuelTheme();

  return (
    <div className={cx("mt-3 rounded-[22px] p-3", theme.panel)}>
      <div className="mb-2 text-[9px] font-black uppercase tracking-[0.24em] text-white/45">
        {title}
      </div>
      {children}
    </div>
  );
}
