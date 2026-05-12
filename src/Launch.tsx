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

        <div className="absolute inset-0 bg-black/8" />

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

          {/* Panels */}
          <div className="mt-[330px] grid grid-cols-2 gap-4">
            <ModeCard
              titleTop="WEEKEND"
              titleBottom="MODE"
              text="Multi-day golf trips, live scoring, pairings, team formats and locked event management."
              tone="red"
              onClick={onWeekend}
            />

            <ModeCard
              titleTop="QUICK"
              titleBottom="GAME"
              text="Fast social golf setup for casual rounds and same-day matches with mates."
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
  text,
  tone,
  onClick,
}: {
  titleTop: string;
  titleBottom: string;
  text: string;
  tone: "red" | "blue";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative h-[246px] overflow-hidden rounded-[34px] border border-[#d7c792]/42 px-5 py-6 text-center shadow-[0_18px_55px_rgba(0,0,0,0.82)] backdrop-blur-[5px] active:scale-[0.985] ${
        tone === "red" ? "bg-[#040001]/96" : "bg-[#00030a]/96"
      }`}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 ${
          tone === "red"
            ? "bg-gradient-to-b from-[#5d0717]/18 via-black/30 to-black/82"
            : "bg-gradient-to-b from-[#07356e]/18 via-black/30 to-black/82"
        }`}
      />

      {/* Gold divider lines */}
      <div className="pointer-events-none absolute inset-x-6 top-[74px] h-[1px] bg-gradient-to-r from-transparent via-[#ead9a7] to-transparent opacity-55" />

      <div className="pointer-events-none absolute inset-x-6 bottom-[76px] h-[1px] bg-gradient-to-r from-transparent via-[#ead9a7] to-transparent opacity-35" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center">
        {/* MATCHED TITLE SYSTEM */}
        <div className="mt-3 flex flex-col items-center">
          <div className="text-[18px] font-black uppercase leading-none tracking-[0.26em] text-[#e7d39d]">
            {titleTop}
          </div>

          <div className="mt-4 text-[18px] font-semibold uppercase leading-none tracking-[0.26em] text-white">
            {titleBottom}
          </div>
        </div>

        {/* Body copy */}
        <div className="mt-12 text-center text-[11px] font-medium leading-[1.75] text-white/72">
          {text}
        </div>

        {/* Arrow */}
        <div className="mt-auto mb-1 text-[34px] font-light leading-none text-[#d8c792]/90">
          ›
        </div>
      </div>
    </button>
  );
}
