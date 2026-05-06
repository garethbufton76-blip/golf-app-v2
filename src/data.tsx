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
    grad: "from-[#9e2535] via-[#6f1725] to-[#2b080f]",
    bg: "from-[#381018] via-[#101010] to-black",
  },
  blue: {
    label: "B",
    title: "Team Blue",
    grad: "from-[#244fb4] via-[#132a70] to-[#07102c]",
    bg: "from-[#10224e] via-[#101010] to-black",
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

export const playerOptions = [1, 2, 4, 6, 8, 10, 12];
export const dayOptions = [1, 2, 3, 4];

export const formats = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "4 Player Stableford",
  "Foursomes",
  "2-Ball Ambrose",
  "Stableford",
  "Par / Bogey",
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
  "4 Player Stableford": 4,
};

export const times = [
  "7:00",
  "7:30",
  "8:00",
  "8:30",
  "9:00",
  "9:30",
  "10:00",
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
  ["Player 9", "25.0"],
  ["Player 10", "27.0"],
  ["Player 11", "29.0"],
  ["Player 12", "31.0"],
];

export const holeRows = [
  [1, 399, 1, 4, 378, 2, 4, 351, 6, 4, 378, 17, 5],
  [2, 317, 4, 4, 303, 4, 4, 290, 8, 4, 291, 1, 4],
  [3, 170, 10, 3, 166, 12, 3, 130, 16, 3, 133, 12, 3],
  [4, 346, 8, 4, 291, 16, 4, 274, 12, 4, 272, 16, 4],
  [5, 203, 6, 3, 170, 10, 3, 129, 18, 3, 150, 9, 3],
  [6, 501, 16, 5, 433, 18, 5, 425, 14, 5, 425, 14, 5],
  [7, 492, 14, 5, 472, 8, 5, 441, 2, 5, 446, 3, 5],
  [8, 398, 12, 4, 390, 6, 4, 378, 4, 4, 398, 18, 5],
  [9, 298, 18, 4, 287, 14, 4, 263, 10, 4, 275, 7, 4],
  [10, 375, 7, 4, 368, 1, 4, 305, 13, 4, 307, 8, 4],
  [11, 373, 3, 4, 339, 5, 4, 325, 5, 4, 328, 2, 4],
  [12, 176, 13, 3, 155, 17, 3, 135, 15, 3, 137, 11, 3],
  [13, 472, 15, 5, 457, 11, 5, 385, 1, 4, 385, 13, 5],
  [14, 340, 17, 4, 333, 15, 4, 324, 7, 4, 283, 10, 4],
  [15, 206, 11, 3, 200, 13, 3, 171, 17, 3, 179, 15, 3],
  [16, 379, 5, 4, 352, 9, 4, 330, 11, 4, 333, 4, 4],
  [17, 498, 2, 5, 417, 7, 5, 402, 3, 4, 403, 5, 5],
  [18, 402, 9, 4, 375, 3, 4, 321, 9, 4, 324, 6, 4],
];

export const holesByTee: any = Object.fromEntries(
  holeRows.map(([hole, ...v]) => [
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
  /singles|stableford|par|bogey/i.test(format) && !/4 Player/i.test(format)
    ? players
    : Math.max(1, Math.ceil(players / 2));

export const keyFor = (day: number, match: number) =>
  `${day}-${match}`;

export function rosterMeta(list: any[]) {
  return list.map((p, i) => ({
    ...p,
    slot: `SLOT ${i + 1}`,
    pair:
      i === 0
        ? "CAPTAIN"
        : (i + 1) % 2 === 0
        ? `PAIR ${Math.floor((i + 1) / 2)}`
        : "",
  }));
}

export function makeRoster() {
  const makePlayer = ([name, handicap]: any[]) => ({
    name,
    handicap,
    photo: "",
  });

  return {
    Red: rosterMeta(names.map(makePlayer)),
    Blue: rosterMeta(
      [["Hayden Abercrombie", "4.0"], ...names.slice(1)].map(makePlayer)
    ),
  };
}

export function playersForMatch(
  roster: any,
  playersPerTeam: number,
  format: string,
  index: number
) {
  const red = roster.Red.slice(0, playersPerTeam).map(
    (p: any, rosterIndex: number) => ({
      ...p,
      rosterIndex,
      team: "red",
    })
  );

  const blue = roster.Blue.slice(0, playersPerTeam).map(
    (p: any, rosterIndex: number) => ({
      ...p,
      rosterIndex,
      team: "blue",
    })
  );

  if (
    /singles|stableford|par|bogey/i.test(format) &&
    !/4 Player/i.test(format)
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

export function shots(allowance: number, si: number) {
  return allowance < si ? 0 : 1 + Math.floor((allowance - si) / 18);
}

export function stableford(gross: number, par: number, shotCount: number) {
  return Math.max(0, 2 + (par - (Number(gross) - shotCount)));
}

export function getResult(holes: any[]) {
  const done = holes.filter((h) => h.status !== "pending");
  const red = done.filter((h) => h.status === "red").length;
  const blue = done.filter((h) => h.status === "blue").length;
  const as = done.filter((h) => h.status === "as").length;
  const diff = red - blue;
  const left = 18 - done.length;

  if (!done.length || diff === 0) {
    return {
      main: "ALL SQUARE",
      sub: `${red}-${blue}-${as} • ${left} TO PLAY`,
      leader: null,
    };
  }

  const leader = diff > 0 ? "red" : "blue";
  const lead = Math.abs(diff);

  if (lead > left) {
    return {
      main: `${leader.toUpperCase()} ${lead}&${left}`,
      sub: "MATCH CLOSED",
      leader,
    };
  }

  if (lead === left && left > 0) {
    return {
      main: `${leader.toUpperCase()} DORMIE`,
      sub: `${lead}UP • ${left} TO PLAY`,
      leader,
    };
  }

  return {
    main: `${leader.toUpperCase()} ${lead}UP`,
    sub: `${red}-${blue}-${as} • ${left} TO PLAY`,
    leader,
  };
}

export function matchSummary(holes: any[]) {
  const done = holes.filter((h) => h.status !== "pending");
  const result = getResult(holes);
  const official = { red: 0, blue: 0 };
  const live = { red: 0, blue: 0 };
  const allDone = done.length === 18;

  if (allDone) {
    const red = done.filter((h) => h.status === "red").length;
    const blue = done.filter((h) => h.status === "blue").length;

    red > blue
      ? (official.red = 1)
      : blue > red
      ? (official.blue = 1)
      : ((official.red = 0.5), (official.blue = 0.5));
  }

  if (!allDone) {
    result.leader
      ? (live[result.leader] = 1)
      : done.length
      ? ((live.red = 0.5), (live.blue = 0.5))
      : null;
  }

  return { official, live };
}

export function homeTotals(
  dayConfigs: any[],
  days: number,
  players: number,
  states: any
) {
  const total: any = {
    official: { red: 0, blue: 0 },
    live: { red: 0, blue: 0 },
  };

  dayConfigs.slice(0, days).forEach((day, d) => {
    for (let m = 0; m < matchCount(players, day.format); m++) {
      const s = matchSummary(states[keyFor(d, m)] || blankHoles());

      ["official", "live"].forEach((type) =>
        ["red", "blue"].forEach((team) => {
          total[type][team] += s[type][team];
        })
      );
    }
  });

  return total;
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

  const circleClass = cx(
    "relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d1c79f]/40 shadow-xl",
    size
  );

  if (src) {
    if (bare) {
      return (
        <img
          src={src}
          alt=""
          className={cx(
            "aspect-square shrink-0 rounded-full object-cover",
            size
          )}
        />
      );
    }

    return (
      <div className={cx(circleClass, "bg-black/40")}>
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cx(circleClass, "bg-gradient-to-br", t.grad)}>
      <div className="absolute inset-[6px] rounded-full border border-white/15" />

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

export function Select({
  value,
  onChange,
  options,
  darkMode = false,
}: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cx(
        "w-full rounded-xl border px-2.5 py-2 text-sm font-semibold outline-none",
        darkMode
          ? "border-[#d1c79f]/25 bg-[#0e241b]/80 text-white"
          : "border-[#d1c79f]/30 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
      )}
    >
      {options.map((o: any) => (
        <option key={o} value={o} className="bg-[#111] text-white">
          {o}
        </option>
      ))}
    </select>
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
      {Array.from({ length: count }, (_, i) => (
        <Button
          key={i}
          active={i === active}
          onClick={() => setActive(i)}
          className="rounded-2xl py-3"
        >
          Match {i + 1}
        </Button>
      ))}
    </div>
  );
}
