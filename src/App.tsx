import { useState } from "react";
import Home from "./Home";
import Score from "./Score";

export default function App() {
  const [screen, setScreen] = useState<"home" | "score">("home");

  return (
    <div className="min-h-screen bg-black text-white">
      {screen === "home" && <Home setScreen={setScreen} />}
      {screen === "score" && <Score setScreen={setScreen} />}
    </div>
  );
}
