import { useEffect, useMemo, useState } from "react";
import { cx } from "./data";
import { useDuelTheme } from "./useDuelTheme";

type GameTab = "live" | "score" | "team";
type SettingsView = "main" | "handicaps" | "format" | "tee";

type BottomNavPlayer = {
  id?: string | number;
  name?: string;
  firstName?: string;
  fullName?: string;
  displayName?: string;
  playerName?: string;
  team?: string;
  handicap?: number;
  rawHandicap?: number;
  exactHandicap?: number;
};

function getPlayerId(player: BottomNavPlayer, index: number) {
  return String(
    player.id ??
      player.name ??
      player.fullName ??
      player.displayName ??
      player.playerName ??
      `player-${index}`
  );
}

function getPlayerName(player: BottomNavPlayer, index: number) {
  return String(
    player.name ??
      player.fullName ??
      player.displayName ??
      player.playerName ??
      player.firstName ??
      `Player ${index + 1}`
  );
}

function getPlayerHandicap(player: BottomNavPlayer) {
  return Number(
    player.exactHandicap ?? player.rawHandicap ?? player.handicap ?? 0
  );
}

export default function BottomNav({
  activeTab,
  setActiveTab,
  showTeamTab = false,
  players = [],
  onFinishGame,
  onChangeHandicaps,
  onChangeGameType,
  onChangeTee,
  onNewGame,
}: {
  activeTab: GameTab;
  setActiveTab: (tab: GameTab) => void;
  showTeamTab?: boolean;
  players?: BottomNavPlayer[];
  onFinishGame?: () => void;
  onChangeHandicaps?: (handicaps: Record<string, number>) => void;
  onChangeGameType?: () => void;
  onChangeTee?: () => void;
  onNewGame?: () => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsView>("main");
  const [handicaps, setHandicaps] = useState<Record<string, number>>({});

  const { themeMode, toggleTheme } = useDuelTheme();
  const isDay = themeMode === "day";

  const cleanPlayers = useMemo(
    () =>
      (players || [])
        .filter(Boolean)
        .map((player, index) => ({
          ...player,
          __id: getPlayerId(player, index),
          __name: getPlayerName(player, index),
          __handicap: getPlayerHandicap(player),
        })),
    [players]
  );

  const playersKey = useMemo(
    () =>
      cleanPlayers
        .map((player: any) => `${player.__id}:${player.__name}:${player.__handicap}`)
        .join("|"),
    [cleanPlayers]
  );

  useEffect(() => {
    const next: Record<string, number> = {};

    cleanPlayers.forEach((player: any) => {
      next[player.__id] = Number(Number(player.__handicap || 0).toFixed(1));
    });

    setHandicaps(next);
  }, [playersKey, cleanPlayers]);

  const changeHandicap = (playerKey: string, amount: number) => {
    setHandicaps((current) => ({
      ...current,
      [playerKey]: Math.max(
        0,
        Number(((current[playerKey] ?? 0) + amount).toFixed(1))
      ),
    }));
  };

  const closeSettings = () => {
    setSettingsOpen(false);
    setSettingsView("main");
  };

  return (
    <>
      {settingsOpen && (
        <div className="absolute left-0 right-0 top-0 bottom-[78px] z-[70] overflow-y-auto">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/admin-home-bg.jpg')" }}
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

            {settingsView === "main" && (
              <>
                <QuickSettingsSection title="Theme">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (isDay) toggleTheme();
                      }}
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
                      onClick={() => {
                        if (!isDay) toggleTheme();
                      }}
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
                  <SettingsButton
                    label="End Match"
                    sub="Return to landing screen"
                    gold
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to end this match?\n\nCurrent scores will be lost."
                      );

                      if (confirmed) {
                        onFinishGame?.();
                        onNewGame?.();
                        closeSettings();
                      }
                    }}
                  />
                </QuickSettingsSection>

                <QuickSettingsSection title="Edit Game">
                  <div className="grid gap-3">
                    <SettingsButton
                      label="Change Handicaps"
                      sub="Edit exact handicaps"
                      onClick={() => setSettingsView("handicaps")}
                    />

                    <SettingsButton
                      label="Change Format"
                      sub="Singles, Better Ball, Ambrose"
                      onClick={() => setSettingsView("format")}
                    />

                    <SettingsButton
                      label="Change Tee"
                      sub="Select another tee"
                      onClick={() => setSettingsView("tee")}
                    />
                  </div>
                </QuickSettingsSection>
              </>
            )}

            {settingsView === "handicaps" && (
              <SettingsSubScreen
                title="Change Handicaps"
                back={() => setSettingsView("main")}
              >
                {cleanPlayers.length === 0 ? (
                  <div className="rounded-[22px] border border-white/10 bg-black/55 px-4 py-5 text-center text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                    No quick game players loaded
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cleanPlayers.map((player: any) => (
                      <div
                        key={player.__id}
                        className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/55 px-4 py-4 backdrop-blur-xl"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="truncate text-[15px] font-black uppercase tracking-[0.12em]">
                            {player.__name}
                          </div>

                          <div className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                            Handicap Index
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => changeHandicap(player.__id, -0.1)}
                            className="h-9 w-9 rounded-full border border-white/10 bg-black/55 text-xl"
                          >
                            -
                          </button>

                          <div className="w-[52px] text-center text-[22px] font-black">
                            {(handicaps[player.__id] ?? 0).toFixed(1)}
                          </div>

                          <button
                            type="button"
                            onClick={() => changeHandicap(player.__id, 0.1)}
                            className="h-9 w-9 rounded-full border border-white/10 bg-black/55 text-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    <SettingsButton
                      label="Apply Handicaps"
                      sub="Update this quick game"
                      gold
                      onClick={() => {
                        onChangeHandicaps?.(handicaps);
                        closeSettings();
                      }}
                    />
                  </div>
                )}
              </SettingsSubScreen>
            )}

            {settingsView === "format" && (
              <SettingsSubScreen
                title="Change Format"
                back={() => setSettingsView("main")}
              >
                <div className="grid gap-3">
                  {[
                    "Singles Match Play",
                    "2 Ball Better Ball",
                    "2 Ball Ambrose",
                    "Stableford",
                  ].map((format, index) => (
                    <button
                      key={format}
                      type="button"
                      className={cx(
                        "rounded-[22px] border px-4 py-5 text-left shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl",
                        index === 0
                          ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
                          : "border-white/10 bg-black/55 text-white"
                      )}
                    >
                      <div className="text-[14px] font-black uppercase tracking-[0.14em]">
                        {format}
                      </div>
                    </button>
                  ))}

                  <SettingsButton
                    label="Apply Format"
                    sub="Update this quick game"
                    gold
                    onClick={() => {
                      onChangeGameType?.();
                      closeSettings();
                    }}
                  />
                </div>
              </SettingsSubScreen>
            )}

            {settingsView === "tee" && (
              <SettingsSubScreen
                title="Change Tee"
                back={() => setSettingsView("main")}
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Blue", "S138"],
                    ["White", "S133"],
                    ["Gold", "S123"],
                    ["Red", "S131"],
                  ].map(([tee, slope], index) => (
                    <button
                      key={tee}
                      type="button"
                      className={cx(
                        "rounded-[22px] border px-4 py-5 text-center shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl",
                        index === 0
                          ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
                          : "border-white/10 bg-black/55 text-white"
                      )}
                    >
                      <div className="text-[18px] font-black uppercase tracking-[0.12em]">
                        {tee}
                      </div>

                      <div className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] opacity-60">
                        {slope}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <SettingsButton
                    label="Apply Tee"
                    sub="Update this quick game"
                    gold
                    onClick={() => {
                      onChangeTee?.();
                      closeSettings();
                    }}
                  />
                </div>
              </SettingsSubScreen>
            )}

            <button
              type="button"
              onClick={closeSettings}
              className="mt-4 w-full rounded-[22px] border border-white/10 bg-black/55 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white/76 shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all active:scale-[0.99]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="relative h-[78px] overflow-hidden border-t border-white/10 bg-black/86 shadow-[0_-18px_42px_rgba(0,0,0,0.68)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5b0f18]/62 via-[#111318]/82 to-[#10233e]/68" />

          <div
            className={cx(
              "relative grid h-full",
              showTeamTab ? "grid-cols-4" : "grid-cols-3"
            )}
          >
            <NavButton
              label="Live"
              icon="▦"
              active={activeTab === "live"}
              onClick={() => setActiveTab("live")}
            />

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

            {showTeamTab && (
              <NavButton
                label="Team"
                icon="○"
                active={activeTab === "team"}
                onClick={() => setActiveTab("team")}
              />
            )}

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

function SettingsSubScreen({ title, children, back }: any) {
  return (
    <div className="mt-3 rounded-[26px] border border-white/10 bg-black/46 p-3 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <button
        type="button"
        onClick={back}
        className="mb-3 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/70"
      >
        ‹ Settings
      </button>

      <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-white/45">
        {title}
      </div>

      {children}
    </div>
  );
}

function SettingsButton({ label, sub, onClick, gold = false }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative w-full overflow-hidden rounded-[22px] border px-4 py-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all active:scale-[0.99]",
        gold
          ? "border-[#d1c79f]/70 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black"
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
