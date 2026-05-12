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
      className={`relative h-[188px] overflow-hidden rounded-[30px] border px-4 py-5 text-center shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-[7px] transition active:scale-[0.985] ${
        tone === "red"
          ? "border-[#d7c792]/65 bg-[#100002]/95"
          : "border-[#d7c792]/65 bg-[#000714]/95"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          tone === "red"
            ? "bg-gradient-to-b from-[#4d0613]/40 via-black/50 to-black/95"
            : "bg-gradient-to-b from-[#062f66]/40 via-black/50 to-black/95"
        }`}
      />

      <div className="absolute inset-[3px] rounded-[27px] border border-[#d7c792]/25" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className="text-[15px] font-black uppercase leading-none tracking-[0.34em] text-[#ead9a7]">
          {titleTop}
        </div>

        <div className="mt-5 h-[1px] w-[78%] bg-gradient-to-r from-transparent via-[#ead9a7] to-transparent opacity-65" />

        <div className="relative -mt-[5px] h-[9px] w-[34px] bg-[radial-gradient(circle,rgba(255,235,170,0.95)_0%,rgba(255,215,120,0.55)_35%,transparent_70%)]" />

        <div className="mt-6 text-[34px] font-light uppercase leading-none tracking-[0.24em] text-white">
          {titleBottom}
        </div>

        <div className="mt-6 h-[1px] w-[78%] bg-gradient-to-r from-transparent via-[#ead9a7] to-transparent opacity-55" />

        <div className="relative -mt-[5px] h-[9px] w-[34px] bg-[radial-gradient(circle,rgba(255,235,170,0.9)_0%,rgba(255,215,120,0.45)_35%,transparent_70%)]" />

        <div className="mt-auto flex h-8 w-8 items-center justify-center text-[38px] font-light leading-none text-[#d8c792]">
          ›
        </div>
      </div>
    </button>
  );
}
