type Props = {
  onWeekend: () => void;
  onQuick: () => void;
};

export default function Launch({ onWeekend, onQuick }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="relative h-[780px] w-[390px] overflow-hidden rounded-3xl bg-black">
        {/* Background */}
        <img
          src="/launch-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col px-6 pt-8 pb-7">
          {/* DUEL Logo */}
          <div className="flex justify-center">
            <img
              src="https://i.ibb.co/23Rs55J9/DUEL-LOGO.png"
              alt="DUEL"
              className="h-[82px] object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]"
            />
          </div>

          {/* Mode Panels */}
          <div className="mt-[445px] grid grid-cols-2 gap-4">
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

          {/* Footer */}
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
      className={`relative h-[160px] w-full overflow-hidden rounded-[26px] border px-3 py-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-[7px] transition active:scale-[0.985] ${
        tone === "red"
          ? "border-[#d7c792]/65 bg-[#100002]/95"
          : "border-[#d7c792]/65 bg-[#000714]/95"
      }`}
    >
      {/* Gradient */}
      <div
        className={`absolute inset-0 ${
          tone === "red"
            ? "bg-gradient-to-b from-[#4d0613]/40 via-black/50 to-black/95"
            : "bg-gradient-to-b from-[#062f66]/40 via-black/50 to-black/95"
        }`}
      />

      {/* Inner Border */}
      <div className="absolute inset-[3px] rounded-[23px] border border-[#d7c792]/25" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {/* Top Title */}
        <div className="text-[13px] font-black uppercase leading-none tracking-[0.30em] text-[#ead9a7]">
          {titleTop}
        </div>

        {/* Divider */}
        <div className="mt-4 h-[1px] w-[74%] bg-gradient-to-r from-transparent via-[#ead9a7] to-transparent opacity-60" />

        {/* Main Title */}
        <div className="mt-4 text-[28px] font-light uppercase leading-none tracking-[0.20em] text-white">
          {titleBottom}
        </div>

        {/* Arrow */}
        <div className="mt-auto flex h-6 w-6 items-center justify-center text-[30px] font-light leading-none text-[#d8c792]">
          ›
        </div>
      </div>
    </button>
  );
}
