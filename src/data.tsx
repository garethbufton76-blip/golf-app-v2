import React from "react";

export const cx = (...v: any[]) => v.filter(Boolean).join(" ");

export const gold =
  "bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black font-semibold";

export const dark =
  "border border-[#d1c79f]/25 bg-black/40 text-white/90";

export const panel =
  "rounded-[24px] border border-[#d1c79f]/25 bg-black/40 backdrop-blur-xl";

export const inputClass =
  "w-full rounded-xl border border-[#d1c79f]/25 bg-black/45 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d1c79f]/55";

export const TEAM: any = {
  red: {
    label: "R",
    title: "Team Red",
    grad: "from-[#9e2535] via-[#6f1725] to-[#2b080f]",
    bg: "from-[#381018] via-[#101010] to-black",
    dot: "bg-[#ff6d6d]",
  },
  blue: {
    label: "B",
    title: "Team Blue",
    grad: "from-[#244fb4] via-[#132a70] to-[#07102c]",
    bg: "from-[#10224e] via-[#101010] to-black",
    dot: "bg-[#67a6ff]",
  },
};

export const BACKGROUND_IMAGES: any = {
  home:
    "https://i.ibb.co/B5MCPFwV/hf-20260406-212338-4e6f71fe-a63d-4837-9341-31237b0552c3.png",
  rosterP: "",
  rosterB: "",
  score: "",
  admin: "",
};

export const playerOptions = [1, 2, 4, 6, 8];
export const dayOptions = [1, 2, 3, 4];

export const formats = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "2-Ball Ambrose",
  "Stableford",
  "Par / Bogey",
  "Foursomes",
  "Chapman (Pinehurst)",
  "Greensomes",
];

export const minPlayers: any = {
  "Singles Match Play": 1,
  Stableford: 1,
  "Par / Bogey": 1,
  "2-Ball Better Ball": 2,
  "2-Ball Ambrose": 2,
  Foursomes: 2,
  "Chapman (Pinehurst)": 2,
  Greensomes: 2,
};

export const times = [
  "7:00",
  "7:30",
  "8:00",
  "8:30",
  "9:00",
  "9:30",
];

export const tees = ["Blue", "White", "Gold", "Red"];

export const names = [
  ["Gareth Bufton", "4.0"],
  ["Mark McLeod", "7.0"],
  ["Nick Gerard", "10.0"],
  ["Jimmy Neale", "13.0"],
  ["Hayden Abercrombie", "16.0"],
  ["Areef Vohra", "19.0"],
  ["Player 7", "21.0"],
  ["Player 8", "23.0"],
];

export const holeRows = [
  [1, 399, 1, 4, 378, 2, 4, 351, 6, 4, 378, 17, 5],
  [2, 317, 4, 4, 303, 4, 4, 290, 8, 4, 291, 1, 4],
  [3, 170, 10, 3, 166, 12, 3, 130, 16, 3, 133, 12, 3],
];

export const holesByTee: any = Object.fromEntries(
  holeRows.map(([hole, ...v]: any) => [
    hole,
    Object.fromEntries(
      tees.map((tee, i) => {
        const [metres, si, par] = v.slice(i * 3, i * 3 + 3);
        return [tee, { hole, metres, si, par }];
      })
    ),
  ])
);

export const blankHoles = () =>
  Array.from({ length: 18 }, (_, i) => ({
    hole: i + 1,
    status: "pending",
  }));

export const first = (name = "Player") =>
  String(name).split(" ")[0];

export const validFormats = (players: number) =>
  formats.filter((f) => players >= (minPlayers[f] || 1));

export const matchCount = (players: number, format: string) =>
  /singles|stableford|par|bogey/i.test(format)
    ? players
    : Math.max(1, Math.ceil(players / 2));

export const keyFor = (day: number, match: number) =>
  `${day}-${match}`;

export function Button({
  active,
  onClick,
  children,
  className = "",
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-xl py-2 text-sm",
        active ? gold : dark,
        className
      )}
    >
      {children}
    </button>
  );
}

export function Logo({
  team,
  size = "h-24 w-24",
  small = false,
  src = "",
  letterClass = "",
  bare = false,
}: any) {
  const t = TEAM[team] || TEAM.red;

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cx(
          "object-contain",
          size,
          bare
            ? ""
            : "drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] scale-110"
        )}
      />
    );
  }

  return (
    <div
      className={cx(
        "relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden",
        size
      )}
    >
      <div
        className={cx(
          "absolute inset-0 rounded-full bg-gradient-to-br",
          t.grad
        )}
      />

      <div
        className={cx(
          "font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fff4c8] via-[#d1c79f] to-[#8f8256]",
          letterClass || (small ? "text-[18px]" : "text-[58px]")
        )}
      >
        {t.label}
      </div>
    </div>
  );
}

export function AdminIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d1c79f]/50 bg-gradient-to-br from-[#efe6bf] via-[#d1c79f] to-[#8f8256] text-sm font-black text-black">
      ⚙
    </div>
  );
}
