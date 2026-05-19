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
        "relative overflow-hidden rounded-[26px] border px-3 py-3 shadow-[0_18px_34px_rgba(0,0,0,0.35)]",
        isRed
          ? "border-red-100/45 bg-gradient-to-r from-[#230205] via-[#33070d] to-[#140102]"
          : "border-blue-100/45 bg-gradient-to-r from-[#040816] via-[#0a142b] to-[#02040a]"
      )}
    >
      <div
        className={cx(
          "pointer-events-none absolute inset-0 opacity-70",
          isRed
            ? "bg-[radial-gradient(circle_at_18%_18%,rgba(255,80,80,0.16),transparent_34%),linear-gradient(90deg,rgba(50,6,17,0.9),transparent_65%)]"
            : "bg-[radial-gradient(circle_at_18%_18%,rgba(95,145,255,0.16),transparent_34%),linear-gradient(90deg,rgba(10,20,43,0.9),transparent_65%)]"
        )}
      />

      <div className="relative z-10 grid grid-cols-[64px_minmax(0,1fr)_68px] items-center gap-3">
        <label className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/45 shadow-[0_12px_26px_rgba(0,0,0,0.45)]">
          {player.photo ? (
            <>
              <img
                src={player.photo}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-1 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                <span className="text-[4px] font-black uppercase tracking-[0.12em] text-white">
                  Edit
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-1 text-center">
              <div className="text-[11px] leading-none text-white/80">+</div>
              <div className="mt-0.5 text-[4px] font-black uppercase leading-[1.08] tracking-[0.07em] text-white/45">
                Tap to
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
          <div className="mb-1 text-[4px] font-black uppercase tracking-[0.22em] text-white/32">
            Player {index + 1}
          </div>

          <input
            value={player.name}
            onChange={(event) =>
              updatePlayer(tone, index, "name", event.target.value)
            }
            placeholder={defaultName}
            className={cx(
              "w-full border-0 bg-transparent p-0 text-[14px] font-black leading-none tracking-[-0.04em] text-white outline-none placeholder:text-white/25",
              hasRealName ? "opacity-100" : "opacity-45"
            )}
          />


        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-[18px] border border-white/14 bg-black/36 px-2 text-center">
            <div className="text-[4px] font-black uppercase tracking-[0.16em] text-white/42">
              GWR
            </div>

            <input
              type="text"
              inputMode="decimal"
              value={player.handicap}
              onChange={(event) =>
                updatePlayer(tone, index, "handicap", event.target.value)
              }
              className="mt-1 w-full border-0 bg-transparent p-0 text-center text-[16px] font-black leading-none tracking-[-0.04em] text-white outline-none"
            />
          </div>

          <div className="flex w-[68px] items-center justify-center gap-1 rounded-full bg-white/[0.06] px-2 py-1.5 shadow-[0_10px_22px_rgba(0,0,0,0.42)]">
            <span className="text-[4px] font-black uppercase tracking-[0.12em] text-[#d1c79f]/70">
              Play
            </span>

            <span className="text-[11px] font-black leading-none text-[#d9cfaa]">
              {playHcp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
