import React from "react";

export default function Launch({ onWeekend, onQuick }: any) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="relative h-[780px] w-[390px] overflow-hidden rounded-3xl border border-white/10 bg-black">
        {/* BACKGROUND */}
        <img
          src="/launch-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/30" />

        {/* CONTENT */}
        <div className="relative z-10 flex h-full flex-col px-6 pb-10 pt-8">
          {/* LOGO */}
          <div className="flex justify-center">
            <img
              src="/launch-logo.png"
              alt="Launch Logo"
              className="h-[105px] w-auto object-contain"
            />
          </div>

          {/* SPACER */}
          <div className="flex-1" />

          {/* BUTTON AREA */}
          <div className="grid grid-cols-2 gap-4 pb-8">
            {/* WEEKEND */}
            <button
              onClick={onWeekend}
              className="group relative overflow-hidden rounded-[34px] border border-[#d1c79f]/30 bg-black/55 px-5 py-8 backdrop-blur-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center">
                <div className="mb-4 h-px w-10 bg-[#d1c79f]/70" />

                <div className="text-center text-[17px] font-black uppercase tracking-[0.22em] text-[#f3e7bc]">
                  Weekend
                  <br />
                  Mode
                </div>

                <div className="mt-4 h-px w-10 bg-[#d1c79f]/70" />
              </div>
            </button>

            {/* QUICK */}
            <button
              onClick={onQuick}
              className="group relative overflow-hidden rounded-[34px] border border-[#d1c79f]/30 bg-black/55 px-5 py-8 backdrop-blur-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center">
                <div className="mb-4 h-px w-10 bg-[#d1c79f]/70" />

                <div className="text-center text-[17px] font-black uppercase tracking-[0.22em] text-[#f3e7bc]">
                  Quick
                  <br />
                  Game
                </div>

                <div className="mt-4 h-px w-10 bg-[#d1c79f]/70" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
