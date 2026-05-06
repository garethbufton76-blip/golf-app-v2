import { useMemo, useState } from "react";
import {
  BACKGROUND_IMAGES,
  TEAM,
  AdminIcon,
  cx,
  homeTotals,
  makeRoster,
} from "./data";
import Home from "./Home";
import Roster from "./Roster";
import Score from "./Score";
import Admin from "./Admin";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState(2);
  const [days, setDays] = useState(1);
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
  const [teamLogos, setTeamLogos] = useState({ Red: "", Blue: "" });
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
