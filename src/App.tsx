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

type AppMode = "launch" | "weekend" | "quick";

export default function App() {
  const [mode, setMode] = useState<AppMode>("launch");

  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState(2);
  const [days, setDays] = useState(1);

  const [eventLocked, setEventLocked] = useState(false);
  const [pairingLocks, setPairingLocks] = useState({});

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

  const bgImage = BACKGROUND_IMAGES[screen] || BACKGROUND_IMAGES.home;

  const openMatch = (i: number) => {
    setSelectedMatch(i);
    setScreen("score");
  };

  if (mode === "launch") {
    return (
      <Launch
        onWeekend={() => setMode("weekend")}
        onQuick={() => setMode("quick")}
      />
    );
  }

  if (mode === "quick") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex h-[780px] w-[390px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 text-center">
          <div className="mb-4 text-[42px] font-black tracking-[0.25em] text-[#e7dbb2]">
            QUICK
          </div>

          <div className="mb-8 text-sm uppercase tracking-[0.35em] text-white/50">
            Fast Social Golf
          </div>

          <div className="mb-10 max-w-[260px] text-white/70">
            Quick Game setup is the next build phase.
          </div>

          <button
            onClick={() => setMode("launch")}
            className="rounded-full border border-[#d8c792]/30 bg-[#d8c792] px-8 py-4 text-lg font-bold text-black"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

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
          {screen === "home" && (
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
            />
          )}

          {screen === "rosterP" && (
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

          {screen === "rosterB" && (
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

          {screen === "score" && (
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

          {screen === "admin" && (
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
              pairingLocks={pairingLocks}
              setPairingLocks={setPairingLocks}
            />
          )}

          {screen === "home" && (
            <button
              onClick={() => setScreen("admin")}
              className="absolute left-4 top-4"
            >
              <AdminIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
