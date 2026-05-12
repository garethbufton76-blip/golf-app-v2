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

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex h-full flex-col px-6 pt-8 pb-7">
          <div className="flex justify-center">
            <img
              src="https://i.ibb.co/23Rs55J9/DUEL-LOGO.png"
              alt="DUEL"
              className="h-[82px] object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]"
            />
          </div>

          <div className="mt-[390px] grid grid-cols-2 gap-4">
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

          <div className="mt-auto text-center text-[11px] uppercase tracking-[0.42em] text-white/28">
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
      className={`relative h-[238px] overflow-hidden rounded-[32px] border border-[#d7c792]/45 px-5 py-6 text-center shadow-[0_14px_50px_rgba(0,0,0,0.62)] backdrop-blur-[3px] active:scale-[0.985] ${
        tone === "red" ? "bg-[#120005]/82" : "bg-[#000915]/82"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          tone === "red"
            ? "bg-gradient-to-b from-[#5e0818]/20 via-black/20 to-black/70"
            : "bg-gradient-to-b from-[#0a3474]/20 via-black/20 to-black/70"
        }`}
      />

      <div className="relative z-10 flex h-full flex-col items-center">
        <div className="mb-4 h-[1px] w-[62px] bg-gradient-to-r from-transparent via-[#ecdcae] to-transparent opacity-75" />

        <div className="text-[22px] font-black leading-none tracking-[0.16em] text-[#ecdcae]">
          {titleTop}
        </div>

        <div className="mt-3 text-[21px] font-black leading-none tracking-[0.16em] text-white">
          {titleBottom}
        </div>

        <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-transparent via-[#ecdcae] to-transparent opacity-55" />

        <div className="mt-5 text-[12px] font-medium leading-[1.55] text-white/72">
          {text}
        </div>

        <div className="mt-auto text-[28px] leading-none text-[#d8c792]">
          ›
        </div>
      </div>
    </button>
  );
}
