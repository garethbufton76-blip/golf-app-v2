export type CourseTee = {
  id: string;
  label: string;
};

export type CourseHole = {
  hole: number;
  par: number;
  si: number;
};

export type GolfCourse = {
  id: string;
  name: string;
  shortName: string;
  country: string;
  region: string;
  tees: CourseTee[];
  holesByTee: Record<string, CourseHole[]>;
};

const DEFAULT_18: CourseHole[] = [
  { hole: 1, par: 4, si: 10 },
  { hole: 2, par: 4, si: 4 },
  { hole: 3, par: 3, si: 16 },
  { hole: 4, par: 5, si: 2 },
  { hole: 5, par: 4, si: 8 },
  { hole: 6, par: 4, si: 14 },
  { hole: 7, par: 3, si: 18 },
  { hole: 8, par: 4, si: 6 },
  { hole: 9, par: 5, si: 12 },
  { hole: 10, par: 4, si: 9 },
  { hole: 11, par: 4, si: 3 },
  { hole: 12, par: 3, si: 17 },
  { hole: 13, par: 5, si: 1 },
  { hole: 14, par: 4, si: 7 },
  { hole: 15, par: 4, si: 13 },
  { hole: 16, par: 3, si: 15 },
  { hole: 17, par: 4, si: 5 },
  { hole: 18, par: 5, si: 11 },
];

export const COURSES: GolfCourse[] = [
  {
    id: "st-michaels",
    name: "St Michaels Golf Club",
    shortName: "St Michaels",
    country: "Australia",
    region: "NSW",
    tees: [
      { id: "Blue", label: "Blue" },
      { id: "White", label: "White" },
      { id: "Gold", label: "Gold" },
      { id: "Red", label: "Red" },
    ],
    holesByTee: {
      Blue: DEFAULT_18,
      White: DEFAULT_18,
      Gold: DEFAULT_18,
      Red: DEFAULT_18,
    },
  },

  {
    id: "tewkesbury-park",
    name: "Tewkesbury Park Golf Club",
    shortName: "Tewkesbury Park",
    country: "United Kingdom",
    region: "Gloucestershire",
    tees: [
      { id: "White", label: "White" },
      { id: "Yellow", label: "Yellow" },
      { id: "Red", label: "Red" },
    ],
    holesByTee: {
      White: DEFAULT_18,
      Yellow: DEFAULT_18,
      Red: DEFAULT_18,
    },
  },

  {
    id: "barnbougle-dunes",
    name: "Barnbougle Dunes",
    shortName: "Barnbougle Dunes",
    country: "Australia",
    region: "Tasmania",
    tees: [
      { id: "Black", label: "Black" },
      { id: "Blue", label: "Blue" },
      { id: "White", label: "White" },
      { id: "Red", label: "Red" },
    ],
    holesByTee: {
      Black: DEFAULT_18,
      Blue: DEFAULT_18,
      White: DEFAULT_18,
      Red: DEFAULT_18,
    },
  },

  {
    id: "barnbougle-lost-farm",
    name: "Barnbougle Lost Farm",
    shortName: "Lost Farm",
    country: "Australia",
    region: "Tasmania",
    tees: [
      { id: "Black", label: "Black" },
      { id: "Terracotta", label: "Terracotta" },
      { id: "Blue", label: "Blue" },
      { id: "Cream", label: "Cream" },
    ],
    holesByTee: {
      Black: DEFAULT_18,
      Terracotta: DEFAULT_18,
      Blue: DEFAULT_18,
      Cream: DEFAULT_18,
    },
  },
];

export function getCourseById(courseId: string) {
  return COURSES.find((course) => course.id === courseId) || COURSES[0];
}

export function getCourseTees(courseId: string) {
  return getCourseById(courseId).tees;
}

export function getDefaultTee(courseId: string) {
  return getCourseTees(courseId)[0]?.id || "Blue";
}
