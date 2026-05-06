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

export const formats = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "4 Player Stableford",
  "Foursomes",
  "2-Ball Ambrose",
];

export const minPlayers: any = {
  "Singles Match Play": 1,
  "2-Ball Better Ball": 2,
  "2-Ball Ambrose": 2,
  Foursomes: 2,
  "4 Player Stableford": 4,
};

export const tees = ["Blue", "White", "Gold", "Red"];

export const holeRows = [
  [1,399,1,4,378,2,4,351,6,4,378,17,5],
  [2,317,4,4,303,4,4,290,8,4,291,1,4],
  [3,170,10,3,166,12,3,130,16,3,133,12,3],
  [4,346,8,4,291,16,4,274,12,4,272,16,4],
  [5,203,6,3,170,10,3,129,18,3,150,9,3],
  [6,501,16,5,433,18,5,425,14,5,425,14,5],
  [7,492,14,5,472,8,5,441,2,5,446,3,5],
  [8,398,12,4,390,6,4,378,4,4,398,18,5],
  [9,298,18,4,287,14,4,263,10,4,275,7,4],
  [10,375,7,4,368,1,4,305,13,4,307,8,4],
  [11,373,3,4,339,5,4,325,5,4,328,2,4],
  [12,176,13,3,155,17,3,135,15,3,137,11,3],
  [13,472,15,5,457,11,5,385,1,4,385,13,5],
  [14,340,17,4,333,15,4,324,7,4,283,10,4],
  [15,206,11,3,200,13,3,171,17,3,179,15,3],
  [16,379,5,4,352,9,4,330,11,4,333,4,4],
  [17,498,2,5,417,7,5,402,3,4,403,5,5],
  [18,402,9,4,375,3,4,321,9,4,324,6,4],
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

export const first = (name = "Player") =>
  String(name).split(" ")[0];

export function rosterMeta(list: any[]) {
  return list.map((p, i) => ({
    ...p,
    slot: `SLOT ${i + 1}`,
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
    Blue: rosterMeta(names.map(makePlayer)),
  };
}

export function homeTotals(
  dayConfigs: any[],
  days: number,
  players: number,
  states: any
) {
  const total = {
    official: { red: 0, blue: 0 },
    live: { red: 0, blue: 0 },
  };

  dayConfigs.slice(0, days).forEach((day, d) => {
    const count =
      /singles/i.test(day.format)
        ? players
        : Math.max(1, Math.ceil(players / 2));

    for (let m = 0; m < count; m++) {
      const holes =
        states[`${d}-${m}`] || blankHoles();

      const done = holes.filter(
        (h: any) => h.status !== "pending"
      );

      const red = done.filter(
        (h: any) => h.status === "red"
      ).length;

      const blue = done.filter(
        (h: any) => h.status === "blue"
      ).length;

      if (done.length === 18) {
        if (red > blue) total.official.red += 1;
        else if (blue > red) total.official.blue += 1;
        else {
          total.official.red += 0.5;
          total.official.blue += 0.5;
        }
      } else {
        if (red > blue) total.live.red += 1;
        else if (blue > red) total.live.blue += 1;
      }
    }
  });

  return total;
}

export function Logo({
  team,
  size = "h-24 w-24",
  src = "",
}: any) {
  const t = TEAM[team];

  if (src) {
    return (
      <img
        src={src}
        className={cx(
          "rounded-full object-cover border border-[#d1c79f]/35 shadow-xl",
          size
        )}
      />
    );
  }

  return (
    <div
      className={cx(
        "flex items-center justify-center rounded-full bg-gradient-to-br text-[52px] font-black text-white border border-[#d1c79f]/35 shadow-xl",
        t.grad,
        size
      )}
    >
      {t.label}
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
