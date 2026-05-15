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

type AppMode = "launch" | "weekend" | "quick";

export default function App() {
  const [mode, setMode] = useState<AppMode>("launch");

  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState(2);
  const [days, setDays] = useState(1);

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
  const [selectedMatch, setSelected
