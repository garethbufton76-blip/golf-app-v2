import { useState } from "react";
import { cx } from "./data";

export default function EventGate({
  activeEvent,
  onCreate,
  onJoin,
  onContinue,
  onBack,
}: any) {
  const [eventCode, setEventCode] = useState(activeEvent?.eventCode || "");
  const [adminPin, setAdminPin] = useState(activeEvent?.adminPin || "");
  const [error, setError] = useState("");

  function handleJoin() {
    const ok = onJoin(eventCode, adminPin);
    if (!ok) setError("Event code or admin PIN not recognised on this device.");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/12 bg-black/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/70"
        >
          Back
        </button>

        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d1c79f]">
          Weekend Mode
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="mx-auto mb-7 flex justify-center">
          <img
            src="/launch-logo.png"
            alt="DUEL"
            className="h-12 w-auto object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.8)]"
          />
        </div>

        <div className="rounded-[32px] border border-[#d1c79f]/20 bg-black/55 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.62)] backdrop-blur-xl">
          <div className="text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#d1c79f]">
              Event Access
            </div>

            <div className="mt-3 text-[30px] font-black uppercase leading-none tracking-[-0.04em] text-white">
              Create or Join
            </div>

            <div className="mx-auto mt-3 max-w-[290px] text-[12px] leading-5 text-white/55">
              Create a new golf weekend, or enter an existing event code and
              admin PIN to continue setup.
            </div>
          </div>

          {activeEvent ? (
            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-center">
              <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/40">
                Active Event
              </div>

              <div className="mt-2 text-[20px] font-black uppercase tracking-[0.04em] text-white">
                {activeEvent.name}
              </div>

              <div className="mt-2 flex justify-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-black">
                  {activeEvent.eventCode}
                </span>

                <span className="rounded-full border border-[#d1c79f]/30 bg-black/35 px-3 py-1 text-[11px] font-black text-[#d1c79f]">
                  PIN {activeEvent.adminPin}
                </span>
              </div>

              <button
                type="button"
                onClick={onContinue}
                className="mt-4 w-full rounded-[18px] bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#a69455] py-4 text-[12px] font-black uppercase tracking-[0.18em] text-black"
              >
                Continue Setup
              </button>
            </div>
          ) : null}

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={onCreate}
              className="rounded-[22px] border border-[#d1c79f]/30 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#a69455] px-4 py-5 text-[13px] font-black uppercase tracking-[0.18em] text-black shadow-[0_18px_38px_rgba(0,0,0,0.45)]"
            >
              Create New Weekend
            </button>

            <div className="rounded-[24px] border border-white/10 bg-black/40 p-4">
              <div className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/42">
                Continue Existing Event
              </div>

              <div className="grid grid-cols-[1fr_92px] gap-2">
                <input
                  value={eventCode}
                  onChange={(e) => {
                    setError("");
                    setEventCode(e.target.value.toUpperCase());
                  }}
                  placeholder="EVENT CODE"
                  className="rounded-full border border-white/10 bg-black/55 px-4 py-3 text-[12px] font-black uppercase tracking-[0.16em] text-white outline-none placeholder:text-white/25"
                />

                <input
                  value={adminPin}
                  onChange={(e) => {
                    setError("");
                    setAdminPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                  }}
                  placeholder="PIN"
                  inputMode="numeric"
                  className="rounded-full border border-white/10 bg-black/55 px-4 py-3 text-center text-[12px] font-black uppercase tracking-[0.18em] text-white outline-none placeholder:text-white/25"
                />
              </div>

              {error ? (
                <div className="mt-3 rounded-full border border-red-400/20 bg-red-950/35 px-3 py-2 text-center text-[10px] font-bold text-red-100">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleJoin}
                className={cx(
                  "mt-3 w-full rounded-full border px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em]",
                  eventCode && adminPin.length === 4
                    ? "border-white/20 bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/35"
                )}
              >
                Enter Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

