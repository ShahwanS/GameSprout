import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getSuitFullName, getSuitSymbol } from "~/utils/cardUtils";
import type { CardType } from "../types";
import { SUITS } from "../gameLogic";

interface GuessSuitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAsk: {
    targetPlayerId: string;
    targetPlayerName: string;
    requestedRank: string;
    shownCards: CardType[];
  } | null;
  guessedSuits: string[];
  handleSuitToggle: (suit: string) => void;
  handleGuessSuits: () => void;
}


export default function GuessSuitsDialog({
  open,
  onOpenChange,
  currentAsk,
  guessedSuits,
  handleSuitToggle,
  handleGuessSuits,
}: GuessSuitsDialogProps) {
  const maxSuitsToSelect = currentAsk?.shownCards.length ?? 0;
  const canSelectMore = guessedSuits.length < maxSuitsToSelect;
  const isAtMax = guessedSuits.length === maxSuitsToSelect;

  // quick % for the thin progress bar (purely visual)
  const pct =
    maxSuitsToSelect > 0 ? Math.min(100, Math.round((guessedSuits.length / maxSuitsToSelect) * 100)) : 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300, opacity: { duration: 0.2 } }}
            className={[
              "fixed z-50",
              "inset-x-0 bottom-0 sm:inset-y-4 sm:right-4 sm:left-auto",
              "w-full sm:w-[28rem] md:w-[32rem] max-h-[85vh] sm:max-h-[90vh]",
              "rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]",
              "bg-[radial-gradient(120%_120%_at_10%_-10%,#1f2937_0%,#0b1220_50%,#0a0f1a_100%)]",
              "overflow-hidden",
            ].join(" ")}
          >
            {/* subtle top gradient accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-fuchsia-400 to-cyan-400 opacity-70" />

            {/* Mobile grabber */}
            <div className="sm:hidden flex justify-center pt-3">
              <div className="h-1.5 w-12 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-6 md:px-7 pt-4 sm:pt-6 md:pt-7">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
                    Guess the suits
                  </h2>
                  <p className="mt-1 text-white/70 text-xs sm:text-sm">
                    Pick exactly the number of suits shown.
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close dialog"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* thin progress line */}
              <div className="mt-4 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 md:px-7 pb-5 sm:pb-6 md:pb-7 mt-4 sm:mt-5 max-h-[inherit] overflow-y-auto">
              {currentAsk && currentAsk.shownCards.length > 0 ? (
                <div className="space-y-4 sm:space-y-5">
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    <span className="font-medium">{currentAsk.targetPlayerName}</span> has{" "}
                    <span className="font-medium">{currentAsk.shownCards.length}</span>{" "}
                    <span className="font-medium">{currentAsk.requestedRank}</span>
                    {currentAsk.shownCards.length > 1 ? "s" : ""}. Select the suits you think they are.
                  </p>

                  {/* Selection Counter */}
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-white/80">
                      Selected:{" "}
                      <span className="font-semibold text-white">{guessedSuits.length}</span>/
                      <span className="font-semibold text-white">{maxSuitsToSelect}</span>
                    </span>
                    {isAtMax ? (
                      <span className="inline-flex items-center gap-2 text-emerald-300 font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        Ready to submit
                      </span>
                    ) : (
                      <span className="text-white/60">
                        {Math.max(0, maxSuitsToSelect - guessedSuits.length)} left
                      </span>
                    )}
                  </div>

                  {/* Warning */}
                  <div className="rounded-2xl border border-red-400/20 bg-gradient-to-r from-red-500/15 to-red-400/10 p-3">
                    <p className="text-red-200 text-xs sm:text-sm">
                      ⚠️ Canceling counts as a wrong guess and ends your turn.
                    </p>
                  </div>

                  {/* Suits grid */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {SUITS.map((suit) => {
                      const selected = guessedSuits.includes(suit);
                      const disabled = !selected && !canSelectMore;

                      return (
                        <motion.button
                          key={suit}
                          type="button"
                          onClick={() => !disabled && handleSuitToggle(suit)}
                          disabled={disabled}
                          whileHover={!disabled ? { y: -2, scale: 1.02 } : undefined}
                          whileTap={!disabled ? { scale: 0.98 } : undefined}
                          className={[
                            "relative transform-gpu rounded-2xl px-2 py-3 sm:py-4",
                            "border transition-all duration-200",
                            "flex flex-col items-center justify-center",
                            selected
                              ? [
                                  "bg-gradient-to-b from-blue-600 to-blue-500",
                                  "text-white border-blue-400/70 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]",
                                ].join(" ")
                              : disabled
                              ? "bg-white/5 border-white/10 text-white/35 cursor-not-allowed"
                              : [
                                  "bg-white/5 border-white/10 text-white hover:bg-white/10",
                                  "hover:shadow-[0_10px_30px_-12px_rgba(255,255,255,0.25)]",
                                ].join(" "),
                          ].join(" ")}
                          aria-label={getSuitFullName(suit)}
                        >
                          {/* subtle inner glow on hover/selected */}
                          <span
                            className={[
                              "pointer-events-none absolute inset-0 rounded-2xl",
                              selected
                                ? "ring-1 ring-inset ring-white/20"
                                : "opacity-0 group-hover:opacity-100 transition-opacity",
                            ].join(" ")}
                          />
                          <span className="text-2xl sm:text-3xl md:text-4xl leading-none">
                            {getSuitSymbol(suit)}
                          </span>
                          <span className="mt-1 text-[10px] sm:text-xs opacity-80">
                            {getSuitFullName(suit)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-white/80 text-sm">No suits to guess right now.</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 sm:mt-7 space-y-2 sm:space-y-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full text-sm sm:text-base bg-gradient-to-r from-red-500/15 to-rose-500/15 border-white/10 text-red-200 hover:from-red-500/25 hover:to-rose-500/25"
                >
                  Cancel (Wrong Guess)
                </Button>

                <Button
                  onClick={handleGuessSuits}
                  disabled={guessedSuits.length === 0}
                  className={[
                    "w-full font-semibold text-sm sm:text-base",
                    "transition-all",
                    guessedSuits.length === 0
                      ? "bg-white/10 text-white/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 hover:brightness-110 text-white shadow-[0_12px_40px_-12px_rgba(99,102,241,0.6)]",
                  ].join(" ")}
                >
                  Submit Guess
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
