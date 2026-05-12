type Props = {
  onWeekend: () => void;
  onQuick: () => void;
};

export default function Launch({ onWeekend, onQuick }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="relative h-[780px] w-[390px] overflow-hidden rounded-3xl bg-black">
        <img
          src="/launch-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/8" />

        <div className="relative z-10 flex h-full flex-col px-6 pt-8 pb-7">
          <div className="flex justify-center">
            <img
              src="https://i.ibb.co/23Rs55J9/DUEL-LOGO.png"
              alt="DUEL"
              className="h-[82px] object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]"
            />
          </div>

          <div className="mt-[410px] grid grid-cols-2 gap-4">
            <ModeCard
              titleTop="WEEKEND"
              titleBottom="MODE"
              tone="red"
              onClick={onWeekend}
            />

            <ModeCard
              titleTop="QUICK"
              titleBottom="GAME"
              tone="blue"
              onClick={onQuick}
            />
          </div>

          <div className="mt-auto text-center text-[10px] uppercase tracking-[0.46em] text-white/32">
            Premium Matchplay Scoring
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  titleTop,
  titleBottom,
  tone,
  onClick,
}: {
  titleTop: string;
  titleBottom: string;
  tone: "red" | "blue";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative h-[188px] overflow-hidden rounded-[30px] border px-4 py-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-[6px] transition active:scale-[0.985] ${
        tone === "red"
          ? "border-[#d7c792]/55 bg-[#120003]/94"
          : "border-[#d7c792]/55 bg-[#000814]/94"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          tone === "red"
            ? "bg-gradient-to-b from-[#5a0715]/35 via-black/50 to-black/92"
            : "bg-gradient-to-b from-[#07346f]/35 via-black/50 to-black/92"
        }`}
      />

      <div className="absolute inset-[3px] rounded-[27px] border border-[#d7c792]/25" />

      <div className="pointer-events-none absolute inset-x-8 top-[42px] h-[1px] bg-gradient-to-r from-transparent via-[#ead9a7] to-transparent opacity-55" />

      <div className="pointer-events-none absolute inset-x-8 bottom-[56px] h-[1px] bg-gradient-to-r from-transparent via-[#ead9a7] to-transparent opacity-45" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className="text-[16px] font-black uppercase leading-none tracking-[0.34em] text-[#ead9a7]">
          {titleTop}
        </div>

        <div className="mt-4 text-[29px] font-light uppercase leading-none tracking-[0.20em] text-white">
          {titleBottom}
        </div>

        <div className="mt-8 text-[34px] font-light leading-none text-[#d8c792]">
          ›
        </div>
      </div>
    </button>
  );
}
