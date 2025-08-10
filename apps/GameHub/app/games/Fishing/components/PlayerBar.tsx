import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/ui/button";

interface Player {
  id: string;
  name: string;
  isCurrentPlayer: boolean;
  joinedAt?: string;
}

interface PlayerBarProps {
  allPlayers: Player[];
  currentPlayerId: string;
  playerId: string;
  roomCode: string | null;
  isHost: boolean;
  gameStarted: boolean;
  handleStartGame: () => void;
  handleNewGame: () => void;
  handlePlayerClick: (id: string, name: string) => void;
}

export default function PlayerBar({
  allPlayers,
  currentPlayerId,
  playerId,
  roomCode,
  isHost,
  gameStarted,
  handleStartGame,
  handleNewGame,
  handlePlayerClick,
}: PlayerBarProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between py-2 sm:py-3 px-2 sm:px-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b border-slate-500 shadow-lg gap-2 sm:gap-3">
      {/* Header Section */}
      <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-center lg:justify-start">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">🎣 Fishing Game</h1>
        {roomCode && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20">
            <span className="text-white/80 text-xs">Code:</span>
            <span className="ml-1 sm:ml-2 text-white font-mono font-semibold text-xs sm:text-sm tracking-wider">
              {roomCode}
            </span>
          </div>
        )}
      </div>
      
      {/* Players and Controls Section */}
      <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
        {/* Players Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-none lg:flex gap-1 sm:gap-2 lg:gap-3 justify-center lg:justify-end w-full lg:w-auto">
          <AnimatePresence>
            {allPlayers.map((p, i) => (
              <motion.div
                key={p.id}
                className={`flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 cursor-pointer min-w-[50px] sm:min-w-[60px] lg:min-w-[70px]
                  ${p.id === currentPlayerId ? "bg-blue-500 border-blue-400 border-2 scale-105 shadow-lg" : "bg-white/10 border border-white/20 hover:bg-white/20"}
                  ${p.id === playerId ? "ring-2 ring-blue-300" : ""}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.05 }}
                onClick={() => handlePlayerClick(p.id, p.name)}
              >
                <span className="font-semibold text-white text-xs sm:text-sm lg:text-sm drop-shadow-sm text-center leading-tight">
                  {p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name}
                  {p.id === playerId && " (You)"}
                </span>
                <span className="text-xs text-white/80 text-center leading-tight">
                  {allPlayers[0].id === p.id ? "Host" : p.id === currentPlayerId ? "Current" : ""}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Game Controls */}
        <div className="flex justify-center lg:justify-end mt-1 lg:mt-0">
          {isHost && !gameStarted && (
            <motion.button
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-bold shadow-lg hover:bg-blue-600 transition-all duration-200"
              onClick={handleStartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              Start Game
            </motion.button>
          )}
          {isHost && gameStarted && (
            <Button
              onClick={handleNewGame}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              New Game
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 