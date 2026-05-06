import React from "react";

export const cx = (...v: any[]) => v.filter(Boolean).join(" ");

export const gold =
  "bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black font-semibold";

export const dark =
  "border border-[#d1c79f]/25 bg-black/40 text-white/90";

export const panel =
  "rounded-[24px] border border-[#d1c79f]/25 bg-black/40 backdrop-blur-xl";

export const TEAM: any = {
  red: {
    label: "R",
    title: "Team Red",
    grad:
      "from-[#9e2535] via-[#6f1725] to-[#2b080f]",
  },

  blue: {
    label: "B",
    title: "Team Blue",
    grad:
      "from-[#244fb4] via-[#132a70] to-[#07102c]",
  },
};

export const BACKGROUND_IMAGES: any = {
  home:
    "https://i.ibb.co/B5MCPFwV/hf-20260406-212338-4e6f71fe-a63d-4837-9341-31237b0552c3.png",
};

export const playerOptions = [1, 2, 4, 6, 8];
export const dayOptions = [1, 2, 3, 4];

export const formats = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "2-Ball Ambrose",
  "Stableford",
  "Foursomes",
  "Greensomes",
];

export const minPlayers: any = {
  "Singles Match Play": 1,
  Stableford: 1,
  "2-Ball Better Ball": 2,
  "2-Ball Ambrose": 2,
  Foursomes: 2,
  Greensomes: 2,
};

export const tees = [
  "Blue",
  "White",
  "Gold",
  "Red",
];

export const names = [
  ["Gareth Bufton", "4.0"],
  ["Mark McLeod", "7.0"],
  ["Nick Gerard", "10.0"],
  ["Jimmy Neale", "13.0"],
  ["Hayden Abercrombie", "16.0"],
  ["Areef Vohra", "19.0"],
];

export const holeRows = [
  [1,399,1,4],
  [2,317,4,4],
  [3,170,10,3],
  [4,346,8,4],
  [5,203,6,3],
  [6,501,16,5],
  [7,492,14,5],
  [8,398,12,4],
  [9,298,18,4],
  [10,375,7,4],
  [11,373,3,4],
  [12,176,13,3],
  [13,472,15,5],
  [14,340,17,4],
  [15,206,11,3],
  [16,379,5,4],
  [17,498,2,5],
  [18,402,9,4],
];

export const holesByTee: any = Object.fromEntries(
  holeRows.map(([hole, metres, si, par]) => [
    hole,
    Object.fromEntries(
      tees.map((tee) => [
        tee,
        {
          hole,
          metres,
          si,
          par,
        },
      ])
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
  formats.filter(
    (f) => players >= (minPlayers[f] || 1)
  );

export const keyFor = (
  day: number,
  match: number
) => `${day}-${match}`;

export const shots = (
  allowance: number,
  si: number
) =>
  allowance < si
    ? 0
    : 1 + Math.floor((allowance - si) / 18);

export const stableford = (
  gross: number,
  par: number,
  shotCount: number
) =>
  Math.max(
    0,
    2 + (par - (Number(gross) - shotCount))
  );

export function Logo({
  team,
  size = "h-24 w-24",
  small = false,
  src = "",
  letterClass = "",
  bare = false,
}: any) {
  const t = TEAM[team] || TEAM.red;

  const defaultLogo =
    team === "red"
      ? "/red-logo.png"
      : team === "blue"
      ? "/blue-logo.png"
      : "";

  const logoSrc = src || defaultLogo;

  if (logoSrc) {
    if (bare) {
      return (
        <img
          src={logoSrc}
          alt=""
          className={cx(
            "aspect-square shrink-0 rounded-full object-cover",
            size
          )}
        />
      );
    }

    return (
      <div
        className={cx(
          "relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d1c79f]/40 bg-black/40 shadow-xl",
          size
        )}
      >
        <img
          src={logoSrc}
          alt=""
          className="absolute inset-0 h-full w-full rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cx(
        "relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d1c79f]/40 shadow-xl bg-gradient-to-br",
        t.grad,
        size
      )}
    >
      <div className="absolute inset-[6px] rounded-full border border-white/15" />

      <div
        className={cx(
          "font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fff4c8] via-[#d1c79f] to-[#8f8256]",
          letterClass ||
            (small
              ? "text-[18px]"
              : "text-[58px]")
        )}
      >
        {t.label}
      </div>
    </div>
  );
}

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

export function MatchButtons({
  count,
  active = 0,
  setActive,
}: any) {
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${Math.min(
          6,
          count
        )}, minmax(0, 1fr))`,
      }}
    >
      {Array.from(
        { length: count },
        (_, i) => (
          <Button
            key={i}
            active={i === active}
            onClick={() => setActive(i)}
            className="rounded-2xl py-3"
          >
            Match {i + 1}
          </Button>
        )
      )}
    </div>
  );
}

export function rosterMeta(list: any[]) {
  return list.map((p, i) => ({
    ...p,
    slot: `SLOT ${i + 1}`,
  }));
}

export function makeRoster() {
  const makePlayer = ([name, handicap]: any) => ({
    name,
    handicap,
    photo: "",
  });

  return {
    Red: rosterMeta(names.map(makePlayer)),
    Blue: rosterMeta(
      [
        ["Hayden Abercrombie", "4.0"],
        ...names.slice(1),
      ].map(makePlayer)
    ),
  };
}

export function playersForMatch(
  roster: any,
  playersPerTeam: number,
  format: string,
  index: number
) {
  const red = roster.Red
    .slice(0, playersPerTeam)
    .map((p: any, rosterIndex: number) => ({
      ...p,
      rosterIndex,
      team: "red",
    }));

  const blue = roster.Blue
    .slice(0, playersPerTeam)
    .map((p: any, rosterIndex: number) => ({
      ...p,
      rosterIndex,
      team: "blue",
    }));

  if (
    /singles|stableford/i.test(format)
  ) {
    return {
      red: red[index] ? [red[index]] : [],
      blue: blue[index] ? [blue[index]] : [],
    };
  }

  return {
    red: red.slice(index * 2, index * 2 + 2),
    blue: blue.slice(index * 2, index * 2 + 2),
  };
}
