// src/useDuelTheme.ts

import { useMemo, useState } from "react";
import {
  DuelThemeMode,
  getDuelTheme,
  getStoredTheme,
  setStoredTheme,
} from "./theme";

export function useDuelTheme() {
  const [themeMode, setThemeModeState] = useState<DuelThemeMode>(() =>
    getStoredTheme()
  );

  const theme = useMemo(() => getDuelTheme(themeMode), [themeMode]);

  function setThemeMode(nextMode: DuelThemeMode) {
    setThemeModeState(nextMode);
    setStoredTheme(nextMode);
  }

  function toggleTheme() {
    setThemeMode(themeMode === "night" ? "day" : "night");
  }

  return {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isDay: themeMode === "day",
    isNight: themeMode === "night",
  };
}
