import { useMemo, useState } from "react";
import {
  BACKGROUND_IMAGES,
  TEAM,
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
import EventGate from "./EventGate";
import WeekendSetupWizard from "./WeekendSetupWizard";

type AppMode = "launch" | "weekend" | "quick";
type GameTab = "live" | "score" | "team";

type WeekendEvent = {
  id: string;
  eventCode: string;
  adminPin: string;
  createdAt: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  days: number;
};

export default function App() {
  const [mode, setMode] = useState<AppMode>("launch");
  const [activeEvent, setActiveEvent] = useState<WeekendEvent | null>(() => {
    try {
      const stored = localStorage.getItem("duel_active_weekend_event");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

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


  function saveActiveEvent(event: WeekendEvent) {
    setActiveEvent(event);
    localStorage.setItem("duel_active_weekend_event", JSON.stringify(event));
  }

  function persistWeekendEvent(extra: any = {}) {
    if (!activeEvent) return;

    const updated = {
      ...activeEvent,
      name: eventDetails.name,
      location: eventDetails.location,
      startDate: eventDetails.startDate,
      endDate: eventDetails.endDate,
      days,
      ...extra,
    };

    const events = JSON.parse(localStorage.getItem("duel_weekend_events") || "{}");

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
      states,
      scorecards,
      savedPlayers,
      eventStarted,
      eventLocked,
      ...extra,
    };

    localStorage.setItem("duel_weekend_events", JSON.stringify(events));
    saveActiveEvent(updated);
  }

  function createWeekendEvent() {
    const eventCode = "DUEL-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const adminPin = String(Math.floor(1000 + Math.random() * 9000));

    const event: WeekendEvent = {
      id: "event-" + Date.now(),
      eventCode,
      adminPin,
      createdAt: new Date().toISOString(),
      name: eventDetails.name || "Dual Weekend",
      location: eventDetails.location || "Golf Weekend",
      startDate: eventDetails.startDate || "",
      endDate: eventDetails.endDate || "",
      days,
    };

    saveActiveEvent(event);

    const events = JSON.parse(localStorage.getItem("duel_weekend_events") || "{}");
    events[eventCode] = {
      ...event,
      eventDetails,
      teamNames,
      teamLogos,
      players,
      days,
      dayConfigs,
      roster,
      states,
      scorecards,
      savedPlayers,
    };

    localStorage.setItem("duel_weekend_events", JSON.stringify(events));
    setScreen("setupWizard");
  }

  function joinWeekendEvent(eventCode: string, adminPin: string) {
    const cleanCode = eventCode.trim().toUpperCase();
    const cleanPin = adminPin.trim();
    const events = JSON.parse(localStorage.getItem("duel_weekend_events") || "{}");
    const found = events[cleanCode];

    if (!found || found.adminPin !== cleanPin) return false;

    saveActiveEvent(found);
    if (found.eventDetails) setEventDetails(found.eventDetails);
    if (found.teamNames) setTeamNames(found.teamNames);
    if (found.teamLogos) setTeamLogos(found.teamLogos);
    if (found.players) setPlayers(found.players);
    if (found.days) setDays(found.days);
    if (found.dayConfigs) setDayConfigs(found.dayConfigs);
    if (found.roster) setRoster(found.roster);
    if (found.states) setStates(found.states);
    if (found.scorecards) setScorecards(found.scorecards);
    if (found.savedPlayers) setSavedPlayers(found.savedPlayers);

    setEventStarted(Boolean(found.eventStarted));
    setEventLocked(Boolean(found.eventLocked));
    setScreen(found.eventStarted ? "home" : "setupWizard");
    return true;
  }

  if (mode === "launch") {
    return (
      <Launch
        onWeekend={() => {
          setMode("weekend");
          setScreen("eventGate");
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
    screen !== "quick" &&
    screen !== "score" &&
    screen !== "eventGate" &&
    screen !== "setupWizard";

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
          {mode === "weekend" && screen === "eventGate" && (
            <EventGate
              activeEvent={activeEvent}
              onCreate={createWeekendEvent}
              onJoin={joinWeekendEvent}
              onContinue={() => setScreen("setupWizard")}
              onBack={() => {
                setMode("launch");
                setScreen("home");
              }}
            />
          )}

          {mode === "weekend" && screen === "setupWizard" && (
            <WeekendSetupWizard
              activeEvent={activeEvent}
              saveActiveEvent={saveActiveEvent}
              persistWeekendEvent={persistWeekendEvent}
              eventDetails={eventDetails}
              setEventDetails={setEventDetails}
              teamNames={teamNames}
              setTeamNames={setTeamNames}
              teamLogos={teamLogos}
              setTeamLogos={setTeamLogos}
              players={players}
              setPlayers={setPlayers}
              days={days}
              setDays={setDays}
              roster={roster}
              setRoster={setRoster}
              savedPlayers={savedPlayers}
              setSavedPlayers={setSavedPlayers}
              dayConfigs={dayConfigs}
              setDayConfigs={setDayConfigs}
              setScreen={setScreen}
              setEventLocked={setEventLocked}
              setEventStarted={setEventStarted}
              setActiveTab={setActiveTab}
            />
          )}

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
              setMode={setMode}
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
              setMode={setMode}
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
              setDayConfigs={setDayConfigs}
            />
          )}

          {mode !== "quick" && screen !== "eventGate" && screen !== "setupWizard" && (screen === "admin" || !eventStarted) && (
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
