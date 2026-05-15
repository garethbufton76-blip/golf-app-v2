// src/courses.ts

export type CourseTee = {
  id: string;
  label: string;
  colour?: string;
  par: number;
  metres: number;
  courseRating: number;
  slopeRating: number;
};

export type CourseHole = {
  hole: number;
  par: number;
  si: number;
  metres?: number;
  yards?: number;
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

const ST_MICHAELS_BLUE: CourseHole[] = [
  { hole: 1, par: 4, si: 1, metres: 399 },
  { hole: 2, par: 4, si: 4 },
  { hole: 3, par: 3, si: 10 },
  { hole: 4, par: 4, si: 8 },
  { hole: 5, par: 3, si: 6 },
  { hole: 6, par: 5, si: 16 },
  { hole: 7, par: 5, si: 14 },
  { hole: 8, par: 4, si: 12 },
  { hole: 9, par: 4, si: 18 },
  { hole: 10, par: 4, si: 9 },
  { hole: 11, par: 5, si: 3 },
  { hole: 12, par: 3, si: 17 },
  { hole: 13, par: 5, si: 5 },
  { hole: 14, par: 4, si: 7 },
  { hole: 15, par: 3, si: 15 },
  { hole: 16, par: 4, si: 13 },
  { hole: 17, par: 4, si: 11 },
  { hole: 18, par: 4, si: 2 },
];

const ST_MICHAELS_WHITE: CourseHole[] = [
  { hole: 1, par: 4, si: 2, metres: 378 },
  { hole: 2, par: 4, si: 4 },
  { hole: 3, par: 3, si: 10 },
  { hole: 4, par: 4, si: 8 },
  { hole: 5, par: 3, si: 6 },
  { hole: 6, par: 5, si: 16 },
  { hole: 7, par: 5, si: 14 },
  { hole: 8, par: 4, si: 12 },
  { hole: 9, par: 4, si: 18 },
  { hole: 10, par: 4, si: 9 },
  { hole: 11, par: 5, si: 3 },
  { hole: 12, par: 3, si: 17 },
  { hole: 13, par: 5, si: 5 },
  { hole: 14, par: 4, si: 7 },
  { hole: 15, par: 3, si: 15 },
  { hole: 16, par: 4, si: 13 },
  { hole: 17, par: 4, si: 11 },
  { hole: 18, par: 4, si: 2 },
];

const ST_MICHAELS_GOLD: CourseHole[] = [
  { hole: 1, par: 4, si: 6, metres: 351 },
  { hole: 2, par: 4, si: 4 },
  { hole: 3, par: 3, si: 10 },
  { hole: 4, par: 4, si: 8 },
  { hole: 5, par: 3, si: 6 },
  { hole: 6, par: 5, si: 16 },
  { hole: 7, par: 5, si: 14 },
  { hole: 8, par: 4, si: 12 },
  { hole: 9, par: 4, si: 18 },
  { hole: 10, par: 4, si: 9 },
  { hole: 11, par: 5, si: 3 },
  { hole: 12, par: 3, si: 17 },
  { hole: 13, par: 5, si: 5 },
  { hole: 14, par: 4, si: 7 },
  { hole: 15, par: 3, si: 15 },
  { hole: 16, par: 4, si: 13 },
  { hole: 17, par: 4, si: 11 },
  { hole: 18, par: 4, si: 2 },
];

const ST_MICHAELS_RED: CourseHole[] = [
  { hole: 1, par: 5, si: 17, metres: 378 },
  { hole: 2, par: 4, si: 4 },
  { hole: 3, par: 3, si: 10 },
  { hole: 4, par: 4, si: 8 },
  { hole: 5, par: 3, si: 6 },
  { hole: 6, par: 5, si: 16 },
  { hole: 7, par: 5, si: 14 },
  { hole: 8, par: 4, si: 12 },
  { hole: 9, par: 4, si: 18 },
  { hole: 10, par: 4, si: 9 },
  { hole: 11, par: 5, si: 3 },
  { hole: 12, par: 3, si: 17 },
  { hole: 13, par: 5, si: 5 },
  { hole: 14, par: 4, si: 7 },
  { hole: 15, par: 3, si: 15 },
  { hole: 16, par: 4, si: 13 },
  { hole: 17, par: 4, si: 11 },
  { hole: 18, par: 4, si: 2 },
];

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
      {
        id: "Blue",
        label: "Blue",
        colour: "#2a2e46",
        par: 72,
        metres: 6345,
        courseRating: 74.6,
        slopeRating: 138,
      },
      {
        id: "White",
        label: "White",
        colour: "#f5f0df",
        par: 72,
        metres: 5886,
        courseRating: 72.1,
        slopeRating: 133,
      },
      {
        id: "Gold",
        label: "Gold",
        colour: "#d1a354",
        par: 70,
        metres: 5379,
        courseRating: 67,
        slopeRating: 123,
      },
      {
        id: "Red",
        label: "Red",
        colour: "#661716",
        par: 74,
        metres: 5447,
        courseRating: 75.7,
        slopeRating: 131,
      },
    ],
    holesByTee: {
      Blue: ST_MICHAELS_BLUE,
      White: ST_MICHAELS_WHITE,
      Gold: ST_MICHAELS_GOLD,
      Red: ST_MICHAELS_RED,
    },
  },
  {
    id: "tewkesbury-park",
    name: "Tewkesbury Park Golf Club",
    shortName: "Tewkesbury Park",
    country: "United Kingdom",
    region: "Gloucestershire",
    tees: [
      { id: "White", label: "White", par: 72, metres: 0, courseRating: 72, slopeRating: 113 },
      { id: "Yellow", label: "Yellow", par: 72, metres: 0, courseRating: 72, slopeRating: 113 },
      { id: "Red", label: "Red", par: 72, metres: 0, courseRating: 72, slopeRating: 113 },
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
      { id: "Black", label: "Black", par: 71, metres: 0, courseRating: 71, slopeRating: 113 },
      { id: "Blue", label: "Blue", par: 71, metres: 0, courseRating: 71, slopeRating: 113 },
      { id: "White", label: "White", par: 71, metres: 0, courseRating: 71, slopeRating: 113 },
      { id: "Red", label: "Red", par: 71, metres: 0, courseRating: 71, slopeRating: 113 },
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
      { id: "Black", label: "Black", par: 78, metres: 0, courseRating: 78, slopeRating: 113 },
      { id: "Terracotta", label: "Terracotta", par: 78, metres: 0, courseRating: 78, slopeRating: 113 },
      { id: "Blue", label: "Blue", par: 78, metres: 0, courseRating: 78, slopeRating: 113 },
      { id: "Cream", label: "Cream", par: 78, metres: 0, courseRating: 78, slopeRating: 113 },
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

export function getCourseTee(courseId: string, teeId: string) {
  const course = getCourseById(courseId);
  return course.tees.find((tee) => tee.id === teeId) || course.tees[0];
}

export function getDefaultTee(courseId: string) {
  return getCourseTees(courseId)[0]?.id || "Blue";
}

export function getCourseHoles(courseId: string, teeId: string) {
  const course = getCourseById(courseId);
  return course.holesByTee[teeId] || course.holesByTee[course.tees[0]?.id] || DEFAULT_18;
}

export function getDailyHandicap(
  handicapIndex: number,
  courseId: string,
  teeId: string
) {
  const tee = getCourseTee(courseId, teeId);

  return Math.round(
    Number(handicapIndex || 0) * (tee.slopeRating / 113) +
      (tee.courseRating - tee.par)
  );
}

export function getPlayingHandicap(
  handicapIndex: number,
  courseId: string,
  teeId: string,
  allowance = 1
) {
  return Math.round(getDailyHandicap(handicapIndex, courseId, teeId) * allowance);
}
