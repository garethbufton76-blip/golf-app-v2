import { useEffect, useMemo, useState } from "react";
import {
  DuelThemeMode,
  getDuelTheme,
  getStoredTheme,
  setStoredTheme,
} from "./theme";

const THEME_EVENT = "duel_theme_changed";

export function useDuelTheme() {
  const [themeMode, setThemeModeState] = useState<DuelThemeMode>(() =>
    getStoredTheme()
  );

  useEffect(() => {
    function syncTheme() {
      setThemeModeState(getStoredTheme());
    }

    window.addEventListener(THEME_EVENT, syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      window.removeEventListener(THEME_EVENT, syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  const theme = useMemo(() => getDuelTheme(themeMode), [themeMode]);

  function setThemeMode(nextMode: DuelThemeMode) {
    setThemeModeState(nextMode);
    setStoredTheme(nextMode);

    window.dispatchEvent(new Event(THEME_EVENT));
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
