type Props = {
  onWeekend: () => void;
  onQuick: () => void;
};

export default function Launch({
  onWeekend,
  onQuick,
}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="relative h-[780px] w-[390px] overflow-hidden rounded-3xl bg-black">
        {/* Background */}
        <img
          src="/launch-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Soft darkening only */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Gold divider */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e8d39c] to-transparent opacity-80" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center px-6 pt-10 pb-8">
          {/* Logo */}
          <div className="mb-3 text-[68px] font-black tracking-[0.34em] text-[#e8d39c] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
            DUEL
          </div>

          <div className="mb-[300px] text-center text-[14px] uppercase tracking-[0.42em] text-white/60">
            Golf Event Platform
          </div>

          {/* Mode buttons */}
          <div className="mt-auto flex w-full items-end justify-between gap-4">
            {/* Weekend */}
            <button
              onClick={onWeekend}
              className="relative h-[250px] flex-1 overflow-hidden rounded-[34px] border border-[#d7c792]/45 bg-[#350008]/72 px-5 py-7 text-left shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-[2px] transition-all duration-300 active:scale-[0.985]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#5e0818]/20 via-transparent to-black/30" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="text-[34px] font-black leading-[0.95] tracking-[0.08em] text-[#ecdcae]">
                  WEEKEND
                </div>

                <div className="mb-5 text-[34px] font-black leading-[0.95] tracking-[0.08em] text-white">
                  MODE
                </div>

                <div className="mb-5 h-[1px] w-full bg-gradient-to-r from-transparent via-[#ecdcae] to-transparent opacity-60" />

                <div className="mt-auto text-[13px] leading-[1.65] text-white/72">
                  Multi-day golf trips,
                  live scoring, pairings,
                  team formats and
                  locked event
                  management.
                </div>
              </div>
            </button>

            {/* Quick */}
            <button
              onClick={onQuick}
              className="relative h-[250px] flex-1 overflow-hidden rounded-[34px] border border-[#d7c792]/45 bg-[#00142e]/72 px-5 py-7 text-left shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-[2px] transition-all duration-300 active:scale-[0.985]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a3474]/20 via-transparent to-black/30" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="text-[34px] font-black leading-[0.95] tracking-[0.08em] text-[#ecdcae]">
                  QUICK
                </div>

                <div className="mb-5 text-[34px] font-black leading-[0.95] tracking-[0.08em] text-white">
                  GAME
                </div>

                <div className="mb-5 h-[1px] w-full bg-gradient-to-r from-transparent via-[#ecdcae] to-transparent opacity-60" />

                <div className="mt-auto text-[13px] leading-[1.65] text-white/72">
                  Fast social golf setup
                  for casual rounds and
                  same-day matches
                  with mates.
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-[11px] uppercase tracking-[0.42em] text-white/30">
            Premium Matchplay Scoring
          </div>
        </div>
      </div>
    </div>
  );
}
