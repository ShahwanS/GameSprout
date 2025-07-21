import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getSuitFullName, getSuitSymbol } from "~/utils/cardUtils";
import type { CardType } from "../types";

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
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/5 sm:bg-black/10 z-40"
            onClick={() => onOpenChange(false)}
          />
          
          {/* Compact Sliding Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="fixed right-2 sm:right-4 top-1/4 w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-h-[70vh] sm:max-h-[60vh] bg-gradient-to-br from-slate-800/90 to-slate-700/90 sm:from-slate-800/95 sm:to-slate-700/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
                          <div className="p-3 sm:p-4 md:p-6 max-h-full overflow-y-auto">
                {/* Header */}
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                  <h2 className="text-white text-base sm:text-lg font-bold">Guess the suits!</h2>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="text-white/60 hover:text-white transition-colors p-1"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              
              {/* Content */}
              {currentAsk && currentAsk.shownCards.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                    {currentAsk.targetPlayerName} has {currentAsk.shownCards.length} {currentAsk.requestedRank}(s). Select the suits you think they are:
                  </p>
                  <p className="text-red-300 text-xs bg-red-500/10 p-2 rounded-lg">
                    ⚠️ Warning: Canceling will count as a wrong guess and end your turn!
                  </p>
                  
                  {/* Suit Buttons */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {["S", "H", "D", "C"].map(suit => (
                      <motion.button
                        key={suit}
                        onClick={() => handleSuitToggle(suit)}
                        className={`p-2 sm:p-3 rounded-xl border-2 text-base sm:text-lg font-bold transition-all duration-200 ${
                          guessedSuits.includes(suit)
                            ? 'bg-blue-500 border-blue-400 text-white shadow-lg scale-105'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-xl sm:text-2xl">{getSuitSymbol(suit)}</span>
                          <span className="text-xs opacity-80">{getSuitFullName(suit)}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Footer */}
              <div className="mt-4 sm:mt-6 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30 w-full text-xs sm:text-sm"
                >
                  Cancel (Wrong Guess)
                </Button>
                <Button 
                  onClick={handleGuessSuits}
                  className="bg-blue-500 text-white hover:bg-blue-600 font-bold w-full text-xs sm:text-sm"
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