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

  return (
    <>
      {settingsOpen && (
        <div className="absolute inset-0 z-[70] flex items-end bg-black/30 backdrop-blur-sm">
          <div className="w-full rounded-t-[32px] border border-white/12 bg-black/88 p-5 text-white shadow-[0_-24px_70px_rgba(0,0,0,0.72)] backdrop-blur-2xl">
            <div className="mb-5 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d1c79f]">
                Game Settings
              </div>

              <div className="mt-1 text-[24px] font-black uppercase">
                Control Centre
              </div>
            </div>

            <div className="grid gap-3">
              <SettingsButton
                label={themeMode === "night" ? "Day Mode" : "Night Mode"}
                sub="Switch the app theme"
                onClick={toggleTheme}
              />

              <SettingsButton
                label="Finish Game"
                sub="Close the current match"
                onClick={onFinishGame}
              />

              <SettingsButton
                label="Change Handicaps"
                sub="Edit player handicaps"
                onClick={onChangeHandicaps}
              />

              <SettingsButton
                label="Change Game Type"
                sub="Singles, better ball, Ambrose"
                onClick={onChangeGameType}
              />

              <SettingsButton
                label="Change Tee"
                sub="Select another tee"
                onClick={onChangeTee}
              />

              <SettingsButton
                label="New Game"
                sub="Return to game setup"
                gold
                onClick={onNewGame}
              />
            </div>

            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="mt-5 w-full rounded-full border border-white/14 bg-white/[0.04] py-4 text-[12px] font-black uppercase tracking-[0.2em] text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="relative h-[78px] overflow-hidden border-t border-white/10 bg-black/86 shadow-[0_-18px_42px_rgba(0,0,0,0.68)] backdrop-blur-xl">
          {/* background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5b0f18]/62 via-[#111318]/82 to-[#10233e]/68" />

          {/* top light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_42%)]" />

          {/* nav items */}
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
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-[20px] border px-4 py-3 text-left transition-all active:scale-[0.99]",
        gold
          ? "border-[#d1c79f]/70 bg-[#d1c79f] text-black"
          : "border-white/10 bg-white/[0.04] text-white"
      )}
    >
      <div className="text-[13px] font-black uppercase tracking-[0.14em]">
        {label}
      </div>

      <div
        className={cx(
          "mt-1 text-[9px] font-black uppercase tracking-[0.14em]",
          gold ? "text-black/50" : "text-white/36"
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
