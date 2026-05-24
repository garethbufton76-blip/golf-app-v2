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
        <div className="absolute left-0 right-0 top-0 bottom-[78px] z-[70] overflow-y-auto">
          {/* same DUEL score-page background, without match/hole panels */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/admin-home-bg.jpg')",
            }}
          />

          {/* subtle depth only — no separate modal wrapper */}
          <div className="absolute inset-0 bg-black/10" />

          {/* content */}
          <div className="relative z-10 mx-auto flex min-h-full max-w-[430px] flex-col px-4 pb-8 pt-5">
            <div className="mb-5 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.32em] text-[#d1c79f]/70">
                Duel Settings
              </div>

              <div className="mt-1 text-[30px] font-black uppercase leading-none text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)]">
                Control Centre
              </div>
            </div>

            <div className="space-y-4">
              <SettingsButton
                label={isDay ? "Night Mode" : "Day Mode"}
                sub="Switch score screen panels"
                onClick={toggleTheme}
              />

              <SettingsButton
                label="Finish Game"
                sub="Complete current match"
                danger
                onClick={onFinishGame}
              />

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

              <SettingsButton
                label="New Game"
                sub="Return to setup"
                gold
                onClick={onNewGame}
              />
            </div>

            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="mt-5 w-full rounded-[24px] border border-white/14 bg-black/38 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white/72 shadow-[0_10px_30px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all active:scale-[0.99]"
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
  danger = false,
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative w-full overflow-hidden rounded-[26px] border px-5 py-5 text-left shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all active:scale-[0.99]",
        gold
          ? "border-[#d1c79f]/75 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
          : danger
          ? "border-[#9f1720]/42 bg-[linear-gradient(135deg,rgba(255,244,245,0.92),rgba(255,214,220,0.86),rgba(255,232,236,0.82))] text-[#681019]"
          : "border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(241,241,238,0.78))] text-[#2f3032]"
      )}
    >
      {/* same cut-glass bands as score panels */}
      <div
        className={cx(
          "pointer-events-none absolute inset-0 rounded-[26px]",
          gold ? "opacity-[0.18]" : "opacity-[0.34]"
        )}
        style={{
          background: `
            linear-gradient(
              112deg,
              transparent 0%,
              rgba(255,255,255,0.74) 12%,
              transparent 24%,
              transparent 34%,
              rgba(255,255,255,0.44) 46%,
              transparent 58%,
              transparent 66%,
              rgba(255,255,255,0.30) 78%,
              transparent 90%
            )
          `,
          backgroundSize: "420px 420px",
        }}
      />

      <div
        className={cx(
          "pointer-events-none absolute inset-0 rounded-[26px]",
          gold ? "opacity-[0.08]" : "opacity-[0.18]"
        )}
        style={{
          background: `
            linear-gradient(
              112deg,
              transparent 0%,
              transparent 18%,
              rgba(0,0,0,0.07) 24%,
              transparent 32%,
              transparent 52%,
              rgba(0,0,0,0.05) 58%,
              transparent 66%,
              transparent 82%,
              rgba(0,0,0,0.04) 86%,
              transparent 100%
            )
          `,
          backgroundSize: "420px 420px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-b from-white/18 via-transparent to-black/5" />

      <div className="relative z-10">
        <div className="text-[14px] font-black uppercase tracking-[0.18em]">
          {label}
        </div>

        <div
          className={cx(
            "mt-1 text-[9px] font-black uppercase tracking-[0.16em]",
            gold
              ? "text-black/45"
              : danger
              ? "text-[#681019]/55"
              : "text-black/45"
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
