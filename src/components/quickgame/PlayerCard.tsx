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

  const defaultName = isRed
    ? `Red ${index + 1}`
    : `Blue ${index + 1}`;

  const currentName = String(player.name || "");

  const hasRealName =
    currentName.trim() !== defaultName;

  const playHcp =
    playingHandicap(player.handicap);

  function readPlayerPhoto(file: File | undefined) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updatePlayer(
        tone,
        index,
        "photo",
        String(reader.result || "")
      );
    };

    reader.readAsDataURL(file);
  }

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[24px] border px-4 py-4 shadow-[0_18px_34px_rgba(0,0,0,0.38)]",
        isRed
          ? "border-red-100/20 bg-[#250306]"
          : "border-blue-100/20 bg-[#050b18]"
      )}
    >
      <div
        className={cx(
          "pointer-events-none absolute inset-0 opacity-75",
          isRed
            ? "bg-[linear-gradient(90deg,rgba(90,10,18,0.82),rgba(42,3,8,0.94)_58%,rgba(18,1,3,0.98))]"
            : "bg-[linear-gradient(90deg,rgba(10,20,43,0.86),rgba(5,11,24,0.94)_58%,rgba(2,4,10,0.98))]"
        )}
      />

      <div className="relative z-10 grid grid-cols-[64px_minmax(0,1fr)_92px] items-center gap-4">
        {/* PHOTO */}
        <label className="group relative flex h-[64px] w-[64px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white bg-black/45 shadow-[0_10px_24px_rgba(0,0,0,0.42)]">
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
            <div className="flex items-center justify-center">
              <div className="text-[34px] leading-none text-white">
                ＋
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) =>
              readPlayerPhoto(
                event.target.files?.[0]
              )
            }
          />
        </label>

        {/* NAME */}
        <div className="min-w-0">
          <textarea
            value={player.name}
            onChange={(event) =>
              updatePlayer(
                tone,
                index,
                "name",
                event.target.value
              )
            }
            placeholder={defaultName}
            rows={2}
            className={cx(
              "w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-[15px] font-black leading-[0.95] tracking-[-0.05em] text-white outline-none placeholder:text-white/25",
              hasRealName
                ? "opacity-100"
                : "opacity-45"
            )}
          />
        </div>

        {/* HANDICAP */}
        <div className="relative flex h-[86px] min-w-0 items-center justify-end">
          <div
            className={cx(
              "absolute left-0 top-1/2 h-[70px] w-px -translate-y-1/2 rounded-full opacity-60",
              isRed ? "bg-[#8d1e25]" : "bg-[#2f4e86]"
            )}
          />

          <div className="flex w-[72px] flex-col items-center justify-center">
            <div className="text-[7px] font-black uppercase leading-none tracking-[0.32em] text-[#efe6bf]">
              HCP
            </div>

            <input
              type="text"
              inputMode="decimal"
              value={player.handicap}
              onChange={(event) =>
                updatePlayer(
                  tone,
                  index,
                  "handicap",
                  event.target.value
                )
              }
              placeholder="18.0"
              className="mt-1 w-full border-0 bg-transparent p-0 text-center text-[22px] font-black leading-none tracking-[-0.06em] text-white outline-none"
            />

            <div className="mt-2 flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.055] px-2 py-[4px] shadow-[0_10px_24px_rgba(0,0,0,0.32)]">
              <span className="text-[6px] font-black uppercase tracking-[0.18em] text-[#d1c79f]/72">
                PLAY
              </span>

              <span className="text-[13px] font-black leading-none text-[#efe6bf]">
                {Number(playHcp).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
