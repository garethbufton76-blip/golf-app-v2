export type TeamKey = "Red" | "Blue";
export type Side = "red" | "blue";

export const gold = "#d1c79f";

export const TEAM = {
  red: { key: "Red", label: "R", colour: "#8b1f2d" },
  blue: { key: "Blue", label: "B", colour: "#214aa8" },
};

export const formats = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "2-Ball Ambrose",
  "Stableford",
  "Foursomes",
  "Greensomes",
  "Chapman",
  "Par / Bogey",
];

export const tees = ["Blue", "White", "Gold", "Red"];

export const defaultDay = {
  label: "Day 1",
  course: "St Michaels",
  tee: "Blue",
  format: "Singles Match Play",
};

export const stMichaelsRows = [
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
  stMichaelsRows.map(([hole, ...v]) => [
    hole,
    Object.fromEntries(
      tees.map((tee, i) => {
        const [metres, si, par] = v.slice(i * 3, i * 3 + 3);
        return [tee, { hole, metres, si, par }];
      })
    ),
  ])
);

export function makeRoster() {
  const base = [
    ["Gareth Bufton", 4],
    ["Mark McLeod", 7],
    ["Nick Gerard", 10],
    ["Jimmy Neale", 13],
    ["Hayden Abercrombie", 16],
    ["Areef Vohra", 19],
  ];

  return {
    Red: base.map(([name, handicap]) => ({ name, handicap, photo: "" })),
    Blue: base.map(([name, handicap]) => ({ name, handicap, photo: "" })),
  };
}

export const defaultState = {
  players: 2,
  day: defaultDay,
  teamNames: { Red: "LEGENDS", Blue: "FURY" },
  teamLogos: { Red: "", Blue: "" },
  roster: makeRoster(),
  holes: Array.from({ length: 18 }, (_, i) => ({
    hole: i + 1,
    status: "pending",
  })),
};
