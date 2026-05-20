// src/components/quickgame/PlayerCard.tsx

import { cx } from "../../data";

type TeamTone = "red" | "blue";

type QuickGamePlayer = {
  name: string;
  handicap: number | string;
  photo?: string;
};

type PlayerCardProps = {
  tone: TeamTone;
  player: QuickGamePlayer;
  index: number;
  playingHandicap: (rawHandicap: any) => number;
  updatePlayer: (
    team: TeamTone,
    index: number,
    key: string,
    value: any
  ) => void;
};

export default function PlayerCard({
  tone,
  player,
  index,
  playingHandicap,
  updatePlayer,
}: PlayerCardProps) {
  const isRed = tone === "red";
  const defaultName = isRed ? `Red ${index + 1}` : `Blue ${index + 1}`;
  const currentName = String(player.name || "");
  const hasRealName = currentName.trim() !== defaultName;
  const playHcp = playingHandicap(player.handicap);

  function readPlayerPhoto(file: File | undefined) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updatePlayer(tone, index, "photo", String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  }

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[24px] border px-3.5 py-3 shadow-[0_16px_30px_rgba(0,0,0,0.38)]",
        isRed
          ? "border-red-100/22 bg-[#250306]"
          : "border-blue-100/22 bg-[#050b18]"
      )}
    >
      <div
        className={cx(
          "pointer-events-none absolute inset-0 opacity-70",
          isRed
            ? "bg-[linear-gradient(90deg,rgba(80,10,18,0.78),rgba(36,3,7,0.92)_58%,rgba(18,1,3,0.98))]"
            : "bg-[linear-gradient(90deg,rgba(10,20,43,0.82),rgba(5,11,24,0.94)_58%,rgba(2,4,10,0.98))]"
        )}
      />

      <div className="relative z-10 grid grid-cols-[58px_minmax(0,1fr)_86px] items-center gap-3">
        <label className="group relative flex h-[58px] w-[58px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/14 bg-black/44 shadow-[0_10px_24px_rgba(0,0,0,0.42)]">
          {player.photo ? (
            <>
              <img
                src={player.photo}
                alt=""
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-1 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                <span className="text-[6px] font-black uppercase tracking-[0.12em] text-white">
                  Edit
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-1 text-center">
              <div className="text-[24px] leading-none text-white/78">＋</div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => readPlayerPhoto(event.target.files?.[0])}
          />
        </label>

        <div className="min-w-0">
          <input
            value={player.name}
            onChange={(event) =>
              updatePlayer(tone, index, "name", event.target.value)
            }
            placeholder={defaultName}
            className={cx(
              "w-full border-0 bg-transparent p-0 text-[15px] font-black leading-none tracking-[-0.04em] text-white outline-none placeholder:text-white/25",
              hasRealName ? "opacity-100" : "opacity-50"
            )}
          />
        </div>

        <div className="flex h-full min-w-0 flex-col items-end justify-center gap-1">
          <div className="flex items-center justify-end gap-1">
            <span className="text-[7px] font-black uppercase tracking-[0.12em] text-white/42">
              HCP
            </span>

            <input
              type="text"
              inputMode="decimal"
              value={player.handicap}
              onChange={(event) =>
                updatePlayer(tone, index, "handicap", event.target.value)
              }
              placeholder="18.0"
              className="w-[52px] border-0 bg-transparent p-0 text-right text-[18px] font-black leading-none tracking-[-0.04em] text-white outline-none"
            />
          </div>

          <div className="mt-1 flex items-center justify-end gap-1 rounded-full bg-white/[0.055] px-2 py-[3px] shadow-[0_8px_18px_rgba(0,0,0,0.28)]">
            <span className="text-[6px] font-black uppercase tracking-[0.1em] text-[#d1c79f]/68">
              Play
            </span>

            <span className="text-[11px] font-black leading-none text-[#d9cfaa]">
              {Number(playHcp).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

