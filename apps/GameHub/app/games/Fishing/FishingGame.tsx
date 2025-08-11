import * as React from "react";
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Users, Copy } from "lucide-react";

import { useFishingGame } from "./hooks/useFishingGame";
import Card from "./Card";
import type { FishingGameState } from "./types";
import Stockpile from "./components/Stockpile";
import PlayerBar from "./components/PlayerBar";
import GameActivity from "./components/GameActivity";
import Hand from "./components/Hand";
import GuessSuitsDialog from "./components/GuessSuitsDialog";

export default function FishingGame() {
  const {
    playerId,
    allPlayers,
    isHost,
    gameStarted,
    roomCode,
    selectedRank,
    setSelectedRank,
    selectedPlayer,
    setSelectedPlayer,
    showGuessPopup,
    setShowGuessPopup,
    guessedSuits,
    setGuessedSuits,
    showCardSelection,
    setShowCardSelection,
    currentAsk,
    setCurrentAsk,
    showLastMove,
    setShowLastMove,
    handleStartGame,
    handleNewGame,
    handlePlayerClick,
    handleCardSelect,
    handleAskForCards,
    handleGuessSuits,
    handleSuitToggle,
    handleGuessDialogClose,
    gameState,
    myHand,
    currentPlayerId,
    currentPlayerName,
    isMyTurn,
    availableRanks,
    playerStockpiles,
    displayHand,
  } = useFishingGame();

  // Show last move briefly
  useEffect(() => {
    if (gameState && (gameState as FishingGameState).lastMove) {
      setShowLastMove(true);
      const timer = setTimeout(() => setShowLastMove(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Stable floating “cards” in lobby bg (don’t re-randomize on re-render)
  const floaters = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        key: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: i * 0.5,
        duration: 4 + Math.random() * 2,
      })),
    []
  );

  // LOBBY
  if (!gameStarted) {
    return (
      <div className="flex min-h-screen flex-col bg-[radial-gradient(120%_120%_at_10%_-10%,#1f283a_0%,#0b1220_55%,#0a0f1a_100%)]">
        <PlayerBar
          allPlayers={allPlayers}
          currentPlayerId={currentPlayerId}
          playerId={playerId!}
          roomCode={roomCode}
          isHost={isHost}
          gameStarted={gameStarted}
          handleStartGame={handleStartGame}
          handleNewGame={handleNewGame}
          handlePlayerClick={handlePlayerClick}
        />

        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
          {/* Ambient blobs */}
          <motion.div
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.25, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Card floaters */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {floaters.map((f) => (
              <motion.div
                key={f.key}
                className="absolute h-14 w-10 rounded-lg border border-white/15 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] sm:h-16 sm:w-12 md:h-20 md:w-14"
                style={{ left: f.left, top: f.top }}
                animate={{ y: [0, -22, 0], rotate: [0, 6, -6, 0], opacity: [0.25, 0.65, 0.25] }}
                transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Card with content */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:max-w-2xl sm:p-10"
          >
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 shadow-lg sm:h-24 sm:w-24">
                <Users className="h-10 w-10 text-white sm:h-12 sm:w-12" />
              </div>
            </div>

            <h1 className="bg-gradient-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-center text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Waiting for Players
            </h1>
            <p className="mt-3 text-center text-sm leading-relaxed text-white/80 sm:text-base">
              The host will start the game when everyone is ready.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-white/70">
                {allPlayers.length} player{allPlayers.length !== 1 ? "s" : ""} connected
              </span>
            </div>

            {/* Dots */}
            <div className="mt-4 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-white/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                />
              ))}
            </div>

            {/* Room code */}
            {roomCode && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-3"
              >
                <p className="mb-2 text-center text-xs text-white/60">Room Code</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="rounded-lg bg-white/20 px-3 py-1 font-mono text-lg font-bold tracking-widest text-white">
                    {roomCode}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(roomCode)}
                    className="rounded p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                    title="Copy room code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // GAME
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        backgroundImage: "url(/fishingBackground.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 10% -10%, rgba(31,40,58,0.85) 0%, rgba(11,18,32,0.7) 55%, rgba(10,15,26,0.65) 100%)",
        }}
      />
      <PlayerBar
        allPlayers={allPlayers}
        currentPlayerId={currentPlayerId}
        playerId={playerId!}
        roomCode={roomCode}
        isHost={isHost}
        gameStarted={gameStarted}
        handleStartGame={handleStartGame}
        handleNewGame={handleNewGame}
        handlePlayerClick={handlePlayerClick}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6">

        <div className="mx-auto max-w-6xl">
          {/* Status */}
          <div className="mb-4 text-center sm:mb-6">
            <h2 className="mb-2 text-lg font-bold text-white drop-shadow sm:text-xl md:text-2xl lg:text-3xl">
              Current Player: {currentPlayerName}
            </h2>
      
          </div>

          {/* Deck */}
          <div className="mb-6 text-center sm:mb-8 md:mb-10">
       
            <motion.div className="flex justify-center" whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 280 }}>
              <div className="relative">
                {/* base */}
                <div className="flex h-20 w-14 items-center justify-center rounded-lg border-2 border-white bg-gradient-to-br from-rose-600 to-rose-800 shadow-xl sm:h-24 sm:w-16 md:h-28 md:w-16 lg:h-32 lg:w-20 overflow-hidden">
                  <img src="/cardBackground.png" alt="Card" className="h-full w-full object-cover" />
                </div>
                {/* stack */}
                <div className="absolute -right-1 -top-1 rotate-6 overflow-hidden rounded-lg border-2 border-white shadow-lg">
                  <img
                    src="/cardBackground.png"
                    alt="Card"
                   className="h-20 w-14 object-cover sm:h-24 sm:w-16 md:h-28 md:w-16 lg:h-32 lg:w-20"
                  />
                </div>
                <div className="absolute -right-2 -top-2 rotate-12 overflow-hidden rounded-lg border-2 border-white shadow-md">
                  <img
                    src="/cardBackground.png"
                    alt="Card"
                   className="h-20 w-14 object-cover sm:h-24 sm:w-16 md:h-28 md:w-16 lg:h-32 lg:w-20"
                  />
                </div>
              </div>
            </motion.div>
            <p className="mt-3 text-xs text-white sm:mt-4 sm:text-sm drop-shadow">
              {gameState?.deck?.length || 0} cards remaining
            </p>
          </div>

          {/* Other players */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h3 className="mb-3 text-sm font-semibold text-white sm:mb-4 sm:text-base md:text-lg drop-shadow">
              Other Players
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
              {allPlayers
                .filter((p) => p.id !== playerId)
                .map((player) => {
                  const playerHand = gameState?.playerHands?.[player.id] || [];
                  const count = displayHand(playerHand).length;

                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handlePlayerClick(player.id)}
                      whileHover={isMyTurn ? { scale: 1.02 } : undefined}
                      className={[
                        "rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md transition",
                        isMyTurn ? "cursor-pointer hover:bg-white/[0.12]" : "",
                      ].join(" ")}
                    >
                      <h4 className="mb-3 text-center text-sm font-semibold text-white sm:text-base drop-shadow">
                        {player.name}
                      </h4>

                      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                        {displayHand(playerHand).map((_, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.06 }}
                            className="h-10 w-7 overflow-hidden rounded-lg border-2 border-white bg-gradient-to-br from-slate-600 to-slate-700 shadow-md sm:h-12 sm:w-9 md:h-14 md:w-10 lg:h-16 lg:w-12"
                          >
                            <img src="/cardBackground.png" alt="Card" className="h-full w-full object-cover" />
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-3 flex justify-center">
                        <Stockpile
                          sets={playerStockpiles[player.id] || []}
                          points={(playerStockpiles[player.id] || []).length}
                          isSelf={false}
                        />
                      </div>
                    
                    </motion.div>
                  );
                })}
            </div>
          </div>

          {/* Your hand + stockpile */}
          <div className="mb-8 flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
            <div className="flex-1">
              <h3 className="mb-3 text-sm font-semibold text-white sm:mb-4 sm:text-base md:text-lg drop-shadow">
                Your Hand
              </h3>
              <Hand myHand={displayHand(myHand)} />
            </div>
            <div className="w-full lg:w-auto">
              <Stockpile
                sets={playerStockpiles[playerId!] || []}
                points={(playerStockpiles[playerId!] || []).length}
                isSelf={true}
              />
            </div>
          </div>

          {/* Activity */}
          <GameActivity
            currentAsk={currentAsk}
            showGuessPopup={showGuessPopup}
            playerId={playerId!}
            allPlayers={allPlayers}
            gameState={gameState}
            showLastMove={showLastMove}
            currentPlayerName={currentPlayerName}
            isMyTurn={isMyTurn}
          />
        </div>
      </div>

      {/* Card Selection */}
      <AnimatePresence>
        {showCardSelection && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl rounded-2xl border-2 border-white/15 bg-gradient-to-br from-slate-700 to-slate-600 p-4 shadow-2xl sm:p-6 md:p-8"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <h3 className="px-2 text-center text-base font-bold text-white drop-shadow sm:text-lg md:text-xl lg:text-2xl">
                Choose a card to ask {allPlayers.find((p) => p.id === selectedPlayer)?.name} for:
              </h3>

              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3 md:gap-4">
                {availableRanks.map((rank, idx) => {
                  const cardToShow = myHand.find((c) => c.rank === rank);
                  return (
                    <motion.div
                      key={rank}
                      initial={{ scale: 0.9, y: 16, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.06, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.06, y: -8 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCardSelect(rank)}
                      className="cursor-pointer"
                    >
                      <Card rank={cardToShow?.rank as any} suit={cardToShow?.suit as any} />
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 text-center sm:mt-6">
                <Button
                  onClick={() => setShowCardSelection(false)}
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guess suits */}
      <GuessSuitsDialog
        open={showGuessPopup}
        onOpenChange={handleGuessDialogClose}
        currentAsk={currentAsk}
        guessedSuits={guessedSuits}
        handleSuitToggle={handleSuitToggle}
        handleGuessSuits={handleGuessSuits}
      />

      {/* Game over */}
      {gameState?.gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 md:p-6">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8">
            <h2 className="mb-3 text-2xl font-bold text-slate-800 sm:text-3xl">Game Over!</h2>
            <div className="mb-4 text-sm text-slate-700 sm:text-base md:text-lg">
              {(() => {
                const scores = Object.fromEntries(allPlayers.map((p) => [p.name, gameState.playerScores[p.id] || 0]));
                const max = Math.max(...(Object.values(scores) as number[]));
                const winners = Object.entries(scores)
                  .filter(([_, v]) => v === max)
                  .map(([name]) => name);
                return winners.length === 1 ? (
                  <span>
                    Winner: <span className="font-bold text-green-600">{winners[0]}</span> with {max} points!
                  </span>
                ) : (
                  <span>
                    It&apos;s a tie between{" "}
                    <span className="font-bold text-green-600">{winners.join(", ")}</span> with {max} points!
                  </span>
                );
              })()}
            </div>
            <Button onClick={handleNewGame} className="mt-2 font-bold bg-blue-500 text-white hover:bg-blue-600">
              New Game
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
