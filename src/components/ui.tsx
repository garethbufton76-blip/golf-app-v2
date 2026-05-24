import React from "react";
import { useDuelTheme } from "./useDuelTheme";

export const cx = (...v: any[]) => v.filter(Boolean).join(" ");

export function Button({
  active,
  onClick,
  children,
  className = "",
  gold = false,
}: any) {
  const { theme } = useDuelTheme();

  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-xl py-2 text-sm transition-all duration-300",
        active || gold
          ? `${theme.goldButton} font-semibold`
          : `${theme.darkButton}`,
        className
      )}
    >
      {children}
    </button>
  );
}

export function GlassPanel({
  children,
  className = "",
  strong = false,
  soft = false,
}: any) {
  const { theme } = useDuelTheme();

  return (
    <div
      className={cx(
        "rounded-[32px]",
        strong
          ? theme.panelStrong
          : soft
          ? theme.panelSoft
          : theme.panel,
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
}: any) {
  const { theme } = useDuelTheme();

  return (
    <div
      className={cx(
        "text-[12px] font-black uppercase tracking-[0.38em]",
        theme.textGold,
        className
      )}
    >
      {children}
    </div>
  );
}

export function BodyText({
  children,
  className = "",
}: any) {
  const { theme } = useDuelTheme();

  return (
    <div
      className={cx(
        "text-white",
        theme.textPrimary,
        className
      )}
    >
      {children}
    </div>
  );
}
