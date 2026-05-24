// src/theme.ts

export type DuelThemeMode = "night" | "day";

export type DuelTheme = {
  mode: DuelThemeMode;
  app: string;
  backgroundImage: string;
  backgroundOverlay: string;
  panel: string;
  panelStrong: string;
  panelSoft: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textGold: string;
  goldButton: string;
  darkButton: string;
  redPanel: string;
  bluePanel: string;
  redAccent: string;
  blueAccent: string;
  holeTile: string;
  holeTileActive: string;
  holeTileText: string;
  holeTileMuted: string;
  footer: string;
  footerActive: string;
  scoreCard: string;
  scoreCardRed: string;
  scoreCardBlue: string;
};

export const NIGHT_THEME: DuelTheme = {
  mode: "night",
  app: "text-white",
  backgroundImage: "/admin-home-bg.jpg",
  backgroundOverlay: "bg-black/18",
  panel: "border border-white/10 bg-black/46 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl",
  panelStrong: "border border-white/12 bg-black/62 shadow-[0_24px_60px_rgba(0,0,0,0.58)] backdrop-blur-2xl",
  panelSoft: "border border-white/10 bg-white/[0.04] shadow-[0_14px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
  textPrimary: "text-white",
  textSecondary: "text-white/72",
  textMuted: "text-white/42",
  textGold: "text-[#d1c79f]",
  goldButton: "border-[#d1c79f] bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#9b8d5c] text-black",
  darkButton: "border-white/12 bg-black/42 text-white",
  redPanel: "border-[#7a2424]/65 bg-[#320611]",
  bluePanel: "border-[#33466c]/70 bg-[#0a142b]",
  redAccent: "text-[#ff4355]",
  blueAccent: "text-[#67a6ff]",
  holeTile: "border border-white/8 bg-black/38 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  holeTileActive: "border-[#d1c79f] bg-black/52 text-white shadow-[0_0_24px_rgba(209,199,159,0.38)]",
  holeTileText: "text-white",
  holeTileMuted: "text-white/42",
  footer: "border-t border-white/10 bg-black/72 text-white/55 backdrop-blur-2xl",
  footerActive: "text-[#d1c79f]",
  scoreCard: "border border-white/10 bg-black/46 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl",
  scoreCardRed: "border-[#ff4355]/45 bg-[#2b050a]",
  scoreCardBlue: "border-[#67a6ff]/45 bg-[#061426]",
};

export const DAY_THEME: DuelTheme = {
  mode: "day",
  app: "text-[#2f3032]",
  backgroundImage: "/admin-home-bg.jpg",
  backgroundOverlay: "bg-white/4",
  panel: "border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.90),rgba(241,241,238,0.80))] shadow-[0_18px_40px_rgba(18,18,18,0.18)] backdrop-blur-2xl",
  panelStrong: "border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,238,236,0.84))] shadow-[0_24px_60px_rgba(18,18,18,0.22)] backdrop-blur-2xl",
  panelSoft: "border border-black/8 bg-white/64 shadow-[0_14px_32px_rgba(18,18,18,0.12)] backdrop-blur-2xl",
  textPrimary: "text-[#2f3032]",
  textSecondary: "text-[#5f6062]",
  textMuted: "text-[#7a7a7a]",
  textGold: "text-[#b99b2f]",
  goldButton: "border-[#d8b33f] bg-gradient-to-b from-[#fff3bd] via-[#e1c76e] to-[#ba982f] text-black",
  darkButton: "border-black/18 bg-white/42 text-[#3b3c3d]",
  redPanel: "border-[#9f1720]/25 bg-white/66",
  bluePanel: "border-[#1f4aa8]/25 bg-white/66",
  redAccent: "text-[#9f1720]",
  blueAccent: "text-[#1f4aa8]",
  holeTile: "border border-black/16 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(224,224,222,0.76))] text-[#2f3032] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_20px_rgba(0,0,0,0.08)]",
  holeTileActive: "border-[#d7a628] bg-[linear-gradient(145deg,rgba(255,242,191,0.92),rgba(225,197,107,0.68))] text-black shadow-[0_0_22px_rgba(215,166,40,0.34)]",
  holeTileText: "text-[#2f3032]",
  holeTileMuted: "text-[#6d6d6d]",
  footer: "border-t border-black/10 bg-white/72 text-[#666] backdrop-blur-2xl",
  footerActive: "text-[#b99b2f]",
  scoreCard: "border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.90),rgba(241,241,238,0.80))] shadow-[0_18px_40px_rgba(18,18,18,0.18)] backdrop-blur-2xl",
  scoreCardRed: "border-[#9f1720]/25 bg-white/66",
  scoreCardBlue: "border-[#1f4aa8]/25 bg-white/66",
};

export const DUEL_THEMES: Record<DuelThemeMode, DuelTheme> = {
  night: NIGHT_THEME,
  day: DAY_THEME,
};

export function getDuelTheme(mode: DuelThemeMode = "night") {
  return DUEL_THEMES[mode] || NIGHT_THEME;
}

export function getStoredTheme(): DuelThemeMode {
  try {
    const stored = localStorage.getItem("duel_theme");
    if (stored === "day" || stored === "night") return stored;
  } catch {}
  return "night";
}

export function setStoredTheme(mode: DuelThemeMode) {
  try {
    localStorage.setItem("duel_theme", mode);
  } catch {}
}

