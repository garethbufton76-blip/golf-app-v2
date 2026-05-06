import { useState } from "react";

const gold = "#d1c79f";

export default function Score({ setScreen }: any) {
  const [holes, setHoles] = useState(
    Array.from({ length: 18 }, (_, i) => ({
      hole: i + 1,
      status: "pending",
    }))
  );

  const nextHole = holes.find(h => h.status === "pending")?.hole || 18;

  function setResult(hole: number) {
    setHoles(holes.map(h =>
      h.hole === hole ? { ...h, status: "red" } : h
    ));
  }

  return (
    <div className="p-4">
      <button onClick={() => setScreen("home")}>Back</button>

      <div className="mt-4 grid grid-cols-6 gap-2">
        {holes.map(h => {
          const isCurrent = h.hole === nextHole;

          return (
            <button
              key={h.hole}
              onClick={() => setResult(h.hole)}
              style={
                isCurrent
                  ? {
                      border: `2px solid ${gold}`,
                      boxShadow: `0 0 12px ${gold}`,
                      transform: "scale(1.05)",
                    }
                  : undefined
              }
              className="h-16 rounded border border-white/20"
            >
              {h.hole}
            </button>
          );
        })}
      </div>
    </div>
  );
}
