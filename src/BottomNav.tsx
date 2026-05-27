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
      {/* SETTINGS OVERLAY - QUICK GAME STYLE */}
      {settingsOpen && (
        <div className="absolute left-0 right-0 top-0 bottom-[78px] z-[70] overflow-y-auto">
          {/* same background language as Quick Game */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/admin-home-bg.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 mx-auto max-w-[430px] px-4 pb-8 pt-4 text-white">
            <div className="mb-4 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.32em] text-[#d1c79f]/60">
                Duel Settings
              </div>

              <div className="mt-1 text-[28px] font-black uppercase leading-none text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)]">
                Control Centre
              </div>
            </div>

            <QuickSettingsSection title="Theme">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={cx(
                    "relative overflow-hidden rounded-[22px] border px-4 py-4 text-center shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all active:scale-[0.99]",
                    !isDay
                      ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
                      : "border-white/10 bg-black/55 text-white"
                  )}
                >
                  <div className="text-[24px] font-black uppercase leading-none tracking-[-0.04em]">
                    Night
                  </div>
                  <div
                    className={cx(
                      "mt-1 text-[7px] font-black uppercase tracking-[0.2em]",
                      !isDay ? "text-black/55" : "text-white/35"
                    )}
                  >
                    Mode
                  </div>
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className={cx(
                    "relative overflow-hidden rounded-[22px] border px-4 py-4 text-center shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all active:scale-[0.99]",
                    isDay
                      ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
                      : "border-white/10 bg-black/55 text-white"
                  )}
                >
                  <div className="text-[24px] font-black uppercase leading-none tracking-[-0.04em]">
                    Day
                  </div>
                  <div
                    className={cx(
                      "mt-1 text-[7px] font-black uppercase tracking-[0.2em]",
                      isDay ? "text-black/55" : "text-white/35"
                    )}
                  >
                    Mode
                  </div>
                </button>
              </div>
            </QuickSettingsSection>

            <QuickSettingsSection title="Match Control">
              <div className="grid gap-3">
                <SettingsButton
                  label="Finish Game"
                  sub="Complete current match"
                  danger
                  onClick={onFinishGame}
                />

                <SettingsButton
                  label="New Game"
                  sub="Return to setup"
                  gold
                  onClick={onNewGame}
                />
              </div>
            </QuickSettingsSection>

            <QuickSettingsSection title="Edit Game">
              <div className="grid gap-3">
                <SettingsButton
                  label="Change Handicaps"
                  sub="Edit player handicaps"
                  onClick={onChangeHandicaps}
                />

                <SettingsButton
                  label="Change Format"
                  sub="Singles, Better Ball, Ambrose"
                  onClick={onChangeGameType}
                />

                <SettingsButton
                  label="Change Tee"
                  sub="Select another tee"
                  onClick={onChangeTee}
                />
              </div>
            </QuickSettingsSection>

            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="mt-4 w-full rounded-[22px] border border-white/10 bg-black/55 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white/76 shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all active:scale-[0.99]"
            >
              Close
            </button>
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
                  activeTab === "score" ? "text-white" : "text-white/70"
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

function QuickSettingsSection({ title, children }: any) {
  return (
    <div className="mt-3 rounded-[26px] border border-white/10 bg-black/46 p-3 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div className="mb-3 text-[9px] font-black uppercase tracking-[0.24em] text-white/45">
        {title}
      </div>

      {children}
    </div>
  );
}

function SettingsButton({
  label,
  sub,
  onClick,
  gold = false,
  danger = false,
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative w-full overflow-hidden rounded-[22px] border px-4 py-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all active:scale-[0.99]",
        gold
          ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
          : danger
          ? "border-[#ff4355]/25 bg-[linear-gradient(135deg,rgba(94,8,18,0.76),rgba(20,0,6,0.86))] text-white"
          : "border-white/10 bg-black/55 text-white"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.08] via-transparent to-black/10" />

      <div className="relative z-10">
        <div className="text-[13px] font-black uppercase tracking-[0.18em]">
          {label}
        </div>

        <div
          className={cx(
            "mt-1 text-[8px] font-black uppercase tracking-[0.16em]",
            gold ? "text-black/48" : "text-white/38"
          )}
        >
          {sub}
        </div>
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

