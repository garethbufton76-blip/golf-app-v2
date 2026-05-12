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
      <div className="relative h-[780px] w-[390px] overflow-hidden rounded-3xl border border-white/10 bg-black">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/launch-bg.jpg"
            alt=""
            className="h-full w-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80" />
        </div>

        {/* Gold centre line */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e7d39d] to-transparent opacity-70" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center px-8 pt-16 pb-10">
          {/* Logo */}
          <div className="mb-3 text-[64px] font-black tracking-[0.35em] text-[#e7d39d]">
            DUEL
          </div>

          <div className="mb-14 text-center text-sm uppercase tracking-[0.45em] text-white/45">
            Golf Event Platform
          </div>

          {/* Weekend Mode */}
          <button
            onClick={onWeekend}
            className="group relative mb-6 w-full overflow-hidden rounded-[34px] border border-[#d8c792]/20 bg-black/45 p-8 text-left transition-all duration-300 hover:scale-[1.015]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#45030f]/60 via-[#24160a]/20 to-[#001a36]/60 opacity-90" />

            <div className="relative z-10">
              <div className="mb-3 text-[34px] font-black leading-none tracking-[0.12em] text-[#f0e2b3]">
                WEEKEND
              </div>

              <div className="mb-5 text-[34px] font-black leading-none tracking-[0.12em] text-white">
                MODE
              </div>

              <div className="max-w-[240px] text-sm leading-relaxed text-white/65">
                Multi-day golf trips, live scoring, pairings,
                team formats and locked event management.
              </div>
            </div>
          </button>

          {/* Quick Game */}
          <button
            onClick={onQuick}
            className="group relative w-full overflow-hidden rounded-[34px] border border-white/10 bg-black/45 p-8 text-left transition-all duration-300 hover:scale-[1.015]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-[#1f1f1f]/40 to-black/60" />

            <div className="relative z-10">
              <div className="mb-3 text-[34px] font-black leading-none tracking-[0.12em] text-[#f0e2b3]">
                QUICK
              </div>

              <div className="mb-5 text-[34px] font-black leading-none tracking-[0.12em] text-white">
                GAME
              </div>

              <div className="max-w-[240px] text-sm leading-relaxed text-white/65">
                Fast social golf setup for casual rounds
                and same-day matches with mates.
              </div>
            </div>
          </button>

          {/* Footer */}
          <div className="mt-auto text-center text-[11px] uppercase tracking-[0.45em] text-white/25">
            Premium Matchplay Scoring
          </div>
        </div>
      </div>
    </div>
  );
}
