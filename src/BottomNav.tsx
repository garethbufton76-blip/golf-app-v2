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
          {/* APP BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.38]"
            style={{
              backgroundImage: "url('/admin-home-bg.jpg')",
            }}
          />

          {/* DARK ATMOSPHERE */}
          <div className="absolute inset-0 bg-black/42 backdrop-blur-[5px]" />

          {/* RED / BLUE AMBIENT */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5b0f18]/30 via-black/20 to-[#10233e]/30" />

          {/* GLASS TEXTURE */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background: `
                linear-gradient(
                  112deg,
                  transparent 0%,
                  rgba(255,255,255,0.26) 12%,
                  transparent 24%,
                  transparent 34%,
                  rgba(255,255,255,0.14) 46%,
                  transparent 58%,
                  transparent 66%,
                  rgba(255,255,255,0.10) 78%,
                  transparent 90%
                )
              `,
              backgroundSize: "420px 420px",
            }}
          />

          {/* content */}
          <div className="relative z-10 px-4 pt-5 pb-10">
            {/* heading */}
            <div className="mb-4 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.32em] text-[#d1c79f]/55">
                Duel Settings
              </div>

              <div className="mt-1 text-[28px] font-black uppercase leading-none text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)]">
                Control Centre
              </div>
            </div>

            <div className="space-y-4">

                  <SettingsButton
                    label={isDay ? "Night Mode" : "Day Mode"}
                    sub="Switch DUEL interface theme"
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

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="mt-5 w-full rounded-[24px] border border-white/14 bg-white/[0.07] py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white/72 shadow-[0_10px_30px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition-all active:scale-[0.99]"
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
        "relative w-full overflow-hidden rounded-[24px] border px-5 py-5 text-left shadow-[0_18px_40px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all active:scale-[0.99]",
        gold
          ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
          : danger
          ? "border-[#ff4355]/35 bg-[linear-gradient(135deg,rgba(116,25,35,0.46),rgba(38,4,10,0.30))] text-white"
          : "border-white/18 bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)]"
      )}
    >
      {/* red / blue glass tint */}
      {!gold && !danger && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#5b0f18]/26 via-white/[0.025] to-[#10233e]/26" />
      )}

      {/* glass texture */}
      <div
        className={cx(
          "pointer-events-none absolute inset-0",
          gold ? "opacity-[0.18]" : "opacity-[0.22]"
        )}
        style={{
          background: `
            linear-gradient(
              112deg,
              transparent 0%,
              rgba(255,255,255,0.30) 12%,
              transparent 24%,
              transparent 34%,
              rgba(255,255,255,0.18) 46%,
              transparent 58%,
              transparent 66%,
              rgba(255,255,255,0.12) 78%,
              transparent 90%
            )
          `,
          backgroundSize: "420px 420px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/10" />

      <div className="relative z-10">
        <div className="text-[14px] font-black uppercase tracking-[0.18em]">
          {label}
        </div>

        <div
          className={cx(
            "mt-1 text-[9px] font-black uppercase tracking-[0.16em]",
            gold
              ? "text-black/45"
              : "text-white/38"
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
