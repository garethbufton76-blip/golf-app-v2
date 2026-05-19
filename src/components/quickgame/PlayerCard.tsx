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
  const gwrDisplay = Number(player.handicap || 0).toFixed(1);

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
        "grid grid-cols-[58px_minmax(0,1fr)_78px] items-center gap-3 rounded-[24px] border px-4 py-3",
        isRed
          ? "border-red-100/72 bg-[#250306]"
          : "border-blue-100/72 bg-[#050b18]"
      )}
    >
      <label className="relative flex h-[58px] w-[58px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/45 shadow-[0_10px_24px_rgba(0,0,0,0.32)]">
        {player.photo ? (
          <img
            src={player.photo}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-1 text-center">
            <div className="text-[18px] leading-none text-white/75">＋</div>
            <div className="mt-0.5 text-[5px] font-black uppercase leading-[1.05] tracking-[0.05em] text-white/45">
              Click to
              <br />
              add photo
            </div>
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
            "w-full border-0 bg-transparent p-0 text-[19px] font-black leading-none text-white outline-none placeholder:text-white/25",
            hasRealName ? "opacity-100" : "opacity-50"
          )}
        />
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-[16px] border border-[#d1c79f]/22 bg-black/30 px-2 text-center">
          <div className="text-[6px] font-black uppercase tracking-[0.14em] text-white/42">
            GWR
          </div>

          <input
            type="number"
            step="0.1"
            value={gwrDisplay}
            onChange={(event) =>
              updatePlayer(tone, index, "handicap", event.target.value)
            }
            className="mt-1 w-full border-0 bg-transparent p-0 text-center text-[18px] font-black leading-none text-white outline-none"
          />
        </div>

        <div className="w-fit rounded-full border border-[#d1c79f]/18 bg-black/80 px-2.5 py-[4px] text-center">
          <span className="mr-1 text-[5px] font-black uppercase tracking-[0.1em] text-[#d1c79f]/72">
            Play
          </span>

          <span className="text-[10px] font-black leading-none text-[#d1c79f]">
            {playHcp}
          </span>
        </div>
      </div>
    </div>
  );
}

