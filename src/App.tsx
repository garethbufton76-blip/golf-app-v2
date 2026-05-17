import { useMemo, useState } from "react";
import {
  BACKGROUND_IMAGES,
  TEAM,
  AdminIcon,
  cx,
  homeTotals,
  makeRoster,
} from "./data";

import Launch from "./Launch";
import Home from "./Home";
import Roster from "./Roster";
import Score from "./Score";
import Admin from "./Admin";
import QuickGame from "./QuickGame";
import BottomNav from "./BottomNav";

type AppMode = "launch" | "weekend" | "quick";
type GameTab = "live" | "score" | "team";

export default function App() {
  const [mode, setMode] = useState<AppMode>("launch");

  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState(2);
  const [days, setDays] = useState(1);

  const [activeTab, setActiveTab] = useState<GameTab>("score");

  const [eventLocked, setEventLocked] = useState(false);
  const [eventStarted, setEventStarted] = useState(false);
  const [pairingLocks, setPairingLocks] = useState({});

  const [eventDetails, setEventDetails] = useState({
    name: "Dual in the Dunes",
    location: "St Michaels Golf Club",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [savedPlayers, setSavedPlayers] = useState([
    {
      id: "gareth",
      name: "Gareth Bufton",
      nickname: "Gareth",
      handicap: "4.0",
      homeClub: "",
      preferredTee: "Blue",
      photo: "",
      regular: true,
    },
    {
      id: "mark",
      name: "Mark McLeod",
      nickname: "Mark",
      handicap: "7.0",
      homeClub: "",
      preferredTee: "Blue",
      photo: "",
      regular: true,
    },
  ]);

  const [dayConfigs, setDayConfigs] = useState(
    Array.from({ length: 4 }, (_, i) => ({
      label: `Day ${i + 1}`,
      teeTime: i < 2 ? "8:00" : "8:30",
      course: "St Michaels",
      tee: "Blue",
      format: "Singles Match Play",
    }))
  );

  const [roster, setRoster] = useState(makeRoster);
  const [activeDay, setActiveDay] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [states, setStates] = useState({});
  const [scorecards, setScorecards] = useState({});
  const [dayLocks, setDayLocks] = useState({});

  const [teamLogos, setTeamLogos] = useState({
    Red: "",
    Blue: "",
  });

  const [teamNames, setTeamNames] = useState({
    Red: "Team Red",
    Blue: "Team Blue",
  });

  const totals = useMemo(
    () => homeTotals(dayConfigs, days, players, states),
    [dayConfigs, days, players, states]
  );

  const bg =
    screen === "rosterP"
      ? TEAM.red.bg
      : screen === "rosterB"
      ? TEAM.blue.bg
      : "from-[#092018] via-[#101010] to-black";

  const bgImage =
    mode === "quick"
      ? BACKGROUND_IMAGES.admin || BACKGROUND_IMAGES.home
      : BACKGROUND_IMAGES[screen] || BACKGROUND_IMAGES.home;

  const openMatch = (i: number) => {
    setSelectedMatch(i);
    setScreen("score");
    setActiveTab("score");
  };

  function handleQuickScreen(nextScreen: string) {
    if (nextScreen === "score") {
      setEventStarted(true);
      setEventLocked(true);
      setMode("weekend");
      setScreen("score");
      setActiveTab("score");
      return;
    }

    if (nextScreen === "home") {
      setMode("launch");
      setScreen("home");
      setActiveTab("score");
      return;
    }

    setScreen(nextScreen);
  }

  function handleBottomNav(tab: GameTab) {
    setActiveTab(tab);

    if (tab === "live") {
      setScreen("home");
      return;
    }

    if (tab === "score") {
      setScreen("score");
      return;
    }

    if (tab === "team") {
      setScreen("rosterP");
    }
  }

  if (mode === "launch") {
    return (
      <Launch
        onWeekend={() => {
          setMode("weekend");
          setScreen("admin");
          setActiveTab("score");
        }}
        onQuick={() => {
          setMode("quick");
          setScreen("quick");
          setActiveTab("score");
        }}
      />
    );
  }

  const showBottomNav =
    eventStarted &&
    screen !== "admin" &&
    screen !== "quick";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div
        className={cx(
          "relative h-[780px] w-[390px] overflow-hidden rounded-3xl bg-gradient-to-b",
          bg
        )}
      >
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}

        <div className="absolute inset-0 bg-black/15" />

        <div className="relative z-10 flex h-full flex-col p-4 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
          {mode === "quick" && (
            <QuickGame
              setScreen={handleQuickScreen}
              setPlayers={setPlayers}
              setTeamNames={setTeamNames}
              setRoster={setRoster}
              setDayConfigs={setDayConfigs}
              setActiveDay={setActiveDay}
              setStartMatch={setSelectedMatch}
              setStates={setStates}
              setScorecards={setScorecards}
              setEventStarted={setEventStarted}
              setEventLocked={setEventLocked}
            />
          )}

          {mode !== "quick" && screen === "home" && eventStarted && (
            <Home
              setScreen={setScreen}
              dayConfigs={dayConfigs}
              days={days}
              players={players}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              totals={totals}
              openMatch={openMatch}
              teamLogos={teamLogos}
              teamNames={teamNames}
              roster={roster}
              states={states}
            />
          )}

          {mode !== "quick" && screen === "rosterP" && (
            <Roster
              team="Red"
              setScreen={setScreen}
              roster={roster}
              setRoster={setRoster}
              players={players}
              dayConfigs={dayConfigs}
              days={days}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              teamLogos={teamLogos}
              teamNames={teamNames}
              eventLocked={eventLocked}
              pairingLocks={pairingLocks}
              setPairingLocks={setPairingLocks}
            />
          )}

          {mode !== "quick" && screen === "rosterB" && (
            <Roster
              team="Blue"
              setScreen={setScreen}
              roster={roster}
              setRoster={setRoster}
              players={players}
              dayConfigs={dayConfigs}
              days={days}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              teamLogos={teamLogos}
              teamNames={teamNames}
              eventLocked={eventLocked}
              pairingLocks={pairingLocks}
              setPairingLocks={setPairingLocks}
            />
          )}

          {mode !== "quick" && screen === "score" && eventStarted && (
            <Score
              setScreen={setScreen}
              dayConfigs={dayConfigs}
              players={players}
              activeDay={activeDay}
              roster={roster}
              states={states}
              setStates={setStates}
              scorecards={scorecards}
              setScorecards={setScorecards}
              startMatch={selectedMatch}
              teamLogos={teamLogos}
              teamNames={teamNames}
              eventLocked={eventLocked}
              pairingLocks={pairingLocks}
            />
          )}

          {mode !== "quick" && (screen === "admin" || !eventStarted) && (
            <Admin
              setScreen={setScreen}
              players={players}
              setPlayers={setPlayers}
              days={days}
              setDays={setDays}
              dayConfigs={dayConfigs}
              setDayConfigs={setDayConfigs}
              roster={roster}
              setRoster={setRoster}
              dayLocks={dayLocks}
              setDayLocks={setDayLocks}
              teamLogos={teamLogos}
              setTeamLogos={setTeamLogos}
              teamNames={teamNames}
              setTeamNames={setTeamNames}
              eventLocked={eventLocked}
              setEventLocked={setEventLocked}
              eventStarted={eventStarted}
              setEventStarted={setEventStarted}
              pairingLocks={pairingLocks}
              setPairingLocks={setPairingLocks}
              eventDetails={eventDetails}
              setEventDetails={setEventDetails}
              savedPlayers={savedPlayers}
              setSavedPlayers={setSavedPlayers}
            />
          )}

          {mode !== "quick" && screen === "home" && eventStarted && (
            <button
              onClick={() => setScreen("admin")}
              className="absolute left-4 top-4 z-40"
            >
              <AdminIcon />
            </button>
          )}

          {showBottomNav && (
            <BottomNav
              activeTab={activeTab}
              setActiveTab={handleBottomNav}
            />
          )}
        </div>
      </div>
    </div>
  );
}

