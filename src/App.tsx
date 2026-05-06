import { useEffect, useMemo, useState } from "react";
import { defaultState } from "./data";
import { loadAppState, saveAppState } from "./storage";
import Home from "./Home";
import Score from "./Score";
import Admin from "./Admin";
import Roster from "./Roster";

type Screen = "home" | "score" | "admin" | "rosterRed" | "rosterBlue";

export default function App() {
  const loaded = useMemo(() => loadAppState(defaultState), []);
  const [screen, setScreen] = useState<Screen>("home");
  const [state, setState] = useState<any>(loaded);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  return (
    <div className="min-h-[100svh] bg-black text-white">
      {screen === "home" && (
        <Home state={state} setScreen={setScreen} />
      )}

      {screen === "score" && (
        <Score state={state} setState={setState} setScreen={setScreen} />
      )}

      {screen === "admin" && (
        <Admin state={state} setState={setState} setScreen={setScreen} />
      )}

      {screen === "rosterRed" && (
        <Roster team="Red" state={state} setScreen={setScreen} />
      )}

      {screen === "rosterBlue" && (
        <Roster team="Blue" state={state} setScreen={setScreen} />
      )}
    </div>
  );
}
