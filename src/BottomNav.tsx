import { useState } from "react";
import { cx } from "./data";
import { useDuelTheme } from "./useDuelTheme";

type GameTab = "live" | "score" | "team";

export default function BottomNav({
  activeTab,
  setActiveTab,
  onFinishGame,
  onChangeHandicaps,
  onChangeGameType,
  onChangeTee,
  onNewGame,
}: {
  activeTab: GameTab;
  setActiveTab: (tab: GameTab) => void;
  onFinishGame?: () => void;
  onChangeHandicaps?: () => void;
  onChangeGameType?: () => void;
  onChangeTee?: () => void;
  onNewGame?: () => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { themeMode, toggleTheme } = useDuelTheme();

  const isDay = themeMode === "day";

  return (
    <>
      {/* SETTINGS OVERLAY */}
      {settingsOpen && (
        <div className="absolute inset-0 z-[70] flex items-end bg-black/18 backdrop-blur-[2px]">
          <div className="relative w-full overflow-hidden rounded-t-[34px] border border-white/14 shadow-[0_-24px_70px_rgba(0,0,0,0.68)] backdrop-blur-2xl">

            {/* background */}
            <div
              className={cx(
                "absolute inset-0",
                isDay
                  ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(238,238,236,0.82))]"
                  : "bg-[linear-gradient(180deg,rgba(10,10,12,0.94),rgba(15,15,18,0.92))]"
              )}
            />

            {/* duel glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(209,199,159,0.12),transparent_48%)]" />

            {/* content */}
            <div className="relative z-10 px-5 pb-8 pt-5">
              {/* header */}
              <div className="mb-5 text-center">
                <div
                  className={cx(
                    "text-[10px] font-black uppercase tracking-[0.28em]",
                    isDay ? "text-[#b9962f]" : "text-[#d1c79f]"
                  )}
                >
                  Duel Settings
                </div>

                <div
                  className={cx(
                    "mt-1 text-[26px] font-black uppercase",
                    isDay ? "text-[#242424]" : "text-white"
                  )}
                >
                  Control Centre
                </div>

                <div
                  className={cx(
                    "mx-auto mt-3 h-px w-[140px] bg-gradient-to-r from-transparent to-transparent",
                    isDay
                      ? "via-[#b9962f]/40"
                      : "via-[#d1c79f]/40"
                  )}
                />
              </div>

              {/* buttons */}
              <div className="space-y-3">
                <SettingsButton
                  label={isDay ? "Night Mode" : "Day Mode"}
                  sub="Switch DUEL interface theme"
                  onClick={toggleTheme}
                  isDay={isDay}
                />

                <SettingsButton
                  label="Finish Game"
                  sub="Complete current match"
                  onClick={onFinishGame}
                  isDay={isDay}
                />

                <SettingsButton
                  label="Change Handicaps"
                  sub="Edit player handicaps"
                  onClick={onChangeHandicaps}
                  isDay={isDay}
                />

                <SettingsButton
                  label="Change Format"
                  sub="Singles, Better Ball, Ambrose"
                  onClick={onChangeGameType}
                  isDay={isDay}
                />

                <SettingsButton
                  label="Change Tee"
                  sub="Select another tee"
                  onClick={onChangeTee}
                  isDay={isDay}
                />

                <SettingsButton
                  label="New Game"
                  sub="Return to setup"
                  gold
                  onClick={onNewGame}
                  isDay={isDay}
                />
              </div>

              {/* close */}
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className={cx(
                  "mt-5 w-full rounded-full border py-4 text-[11px] font-black uppercase tracking-[0.22em] transition-all",
                  isDay
                    ? "border-black/10 bg-black/[0.03] text-black/55"
                    : "border-white/10 bg-white/[0.04] text-white/60"
                )}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="relative h-[78px] overflow-hidden border-t border-white/10 bg-black/86 shadow-[0_-18px_42px_rgba(0,0,0,0.68)] backdrop-blur-xl">

          {/* glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5b0f18]/62 via-[#111318]/82 to-[#10233e]/68" />

          {/* top light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_42%)]" />

          {/* nav */}
          <div className="relative grid h-full grid-cols-4">
            <NavButton
              label="Live"
              icon="▦"
              active={activeTab === "live"}
              onClick={() => setActiveTab("live")}
            />

            {/* SCORE */}
            <button
              type="button"
              onClick={() => setActiveTab("score")}
              className={cx(
                "relative flex flex-col items-center justify-center gap-1 border-x border-white/10 text-white transition-all active:scale-[0.98]",
                activeTab === "score" && "bg-white/[0.06]"
              )}
            >
              <div
                className={cx(
                  "flex h-[36px] w-[36px] items-center justify-center rounded-full border font-black leading-none shadow-[0_4px_14px_rgba(0,0,0,0.35)]",
                  activeTab === "score"
                    ? "border-[#efe6bf] bg-[#d1c79f] text-black"
                    : "border-white/30 bg-white/10 text-white"
                )}
              >
                <span className="text-[28px] leading-none">+</span>
              </div>

              <div
                className={cx(
                  "text-[10px] font-black uppercase tracking-[0.18em]",
                  activeTab === "score"
                    ? "text-white"
                    : "text-white/70"
                )}
              >
                Score
              </div>
            </button>

            <NavButton
              label="Team"
              icon="○"
              active={activeTab === "team"}
              onClick={() => setActiveTab("team")}
            />

            <NavButton
              label="Settings"
              icon="⚙"
              active={settingsOpen}
              onClick={() => setSettingsOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsButton({
  label,
  sub,
  onClick,
  gold = false,
  isDay = false,
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-[24px] border px-4 py-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all active:scale-[0.99]",
        gold
          ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
          : isDay
          ? "border-black/10 bg-white/60 text-[#202020]"
          : "border-white/10 bg-white/[0.05] text-white"
      )}
    >
      <div className="text-[13px] font-black uppercase tracking-[0.16em]">
        {label}
      </div>

      <div
        className={cx(
          "mt-1 text-[9px] font-black uppercase tracking-[0.14em]",
          gold
            ? "text-black/45"
            : isDay
            ? "text-black/45"
            : "text-white/34"
        )}
      >
        {sub}
      </div>
    </button>
  );
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98]",
        active ? "bg-white/[0.05]" : ""
      )}
    >
      <div
        className={cx(
          "text-[24px] leading-none",
          active ? "text-[#efe6bf]" : "text-white/70"
        )}
      >
        {icon}
      </div>

      <div
        className={cx(
          "text-[9px] font-black uppercase tracking-[0.14em]",
          active ? "text-[#efe6bf]" : "text-white/70"
        )}
      >
        {label}
      </div>
    </button>
  );
}
