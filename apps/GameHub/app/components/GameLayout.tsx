import { useNavigate, useLocation } from "@remix-run/react";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

import CreateOrJoinRoom from "~/components/CreateOrJoinRoom";
import { createRoom, joinRoom } from "~/utils/api";
import type { PlayerDTO } from "~/utils/types";
import {
  joinRoom as joinRoomSocket,
  pushState as pushStateSocket,
  onGameState,
  offGameState,
  onPlayersUpdate,
  offPlayersUpdate,
  getSocket,
  leaveRoom as leaveRoomSocket,
} from "~/utils/socketClient";
import { useRoomPersistence } from "~/context/RoomPersistenceContext";

interface RoomContextType {
  roomId: string;
  playerId: string;
  players: PlayerDTO[];
  latestState: any;
  pushState: (state: unknown) => void;
}
const RoomContext = createContext<RoomContextType | undefined>(undefined);
export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within GameLayout");
  return ctx;
}


function Spinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <svg
        className="animate-spin h-8 w-8 text-violet-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}
function renderError(error: string, navigate: (path: string) => void) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-md w-full mx-4 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-base text-center">
          {error}
        </div>

        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}


function renderLoading(
  text = "Loading game…", 
  onLeaveRoom: () => void,
) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Spinner />
      <div className="text-white text-lg mt-4 animate-pulse">{text}</div>
      <div className="flex gap-4 mt-6">
        <button 
          onClick={onLeaveRoom}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}



export interface GameLayoutProps {
  gameId: string;
  children: React.ReactNode;
}


export default function GameLayout({
  gameId,
  children,
}: GameLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, setRoomId, playerId, setPlayerId } = useRoomPersistence();
  const [latestState, setLatestState] = useState<any>(null);
  const [playerDetails, setPlayerDetails] = useState<PlayerDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const playerNameRef = useRef<string | undefined>(undefined);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);




  // Leave room function
  const handleLeaveRoom = () => {
    if (roomId && playerId) {
      // Leave the socket room
      leaveRoomSocket(roomId, playerId);
    }
    // Clear all room data
    setRoomId(null);
    setPlayerId(null);
    setLatestState(null);
    setPlayerDetails([]);
    // Navigate to home
    navigate('/');
  };

  // Keep name in ref so sockets can use it
  useEffect(() => {
    if (playerId) {
      const current = playerDetails.find((p) => p.id === playerId);
      playerNameRef.current = current?.name;
    }
  }, [playerDetails, playerId]);

  // Socket event wiring
  useEffect(() => {
    if (gameId && roomId && playerId) {
      joinRoomSocket(roomId, playerId, playerNameRef.current);

      const handleGameState = (s: any) => setLatestState(s);
      const handlePlayersUpdate = async (ids: string[]) => {
        if (!roomId || ids.length === 0) {
          setPlayerDetails([]);
          return;
        }
        try {
          const res = await fetch(`/api?action=getPlayers&roomId=${roomId}`);
          const data: PlayerDTO[] = res.ok
            ? await res.json()
            : [];
          setPlayerDetails(data);
        } catch {
          setPlayerDetails([]);
        }
      };

      onGameState(handleGameState);
      onPlayersUpdate(handlePlayersUpdate);
      getSocket().emit("requestPlayerList", roomId);

      return () => {
        offGameState(handleGameState);
        offPlayersUpdate(handlePlayersUpdate);
        leaveRoomSocket(roomId, playerId);
      };
    }
  }, [gameId, roomId, playerId]);

  // Once we have state & our own player in it, navigate into the room
  useEffect(() => {
    if (gameId && roomId && playerId && latestState && playerDetails.length) {
      if (playerDetails.some((p) => p.id === playerId)) {
        const expectedPath = `/games/${gameId}/room/${roomId}`;
        // Only navigate if we're not already on the correct route
        if (location.pathname !== expectedPath) {
          navigate(expectedPath);
        }
        setIsJoiningRoom(false);
      }
    } else if (gameId && roomId && !playerId) {
      const expectedPath = `/games/${gameId}`;
      // Only navigate if we're not already on the correct route
      if (location.pathname !== expectedPath) {
        navigate(expectedPath);
      }
    }
  }, [gameId, roomId, playerId, latestState, playerDetails, navigate, location.pathname]);

  useEffect(() => {
    if (location.pathname !== `/games/${gameId}/room/${roomId}`) {
      setRoomId(null);
      setPlayerId(null);
      setLatestState(null);
      setPlayerDetails([]);
    }
  }, [location.pathname]);



  async function handleCreate(name: string) {
    try {
      setError(null);
      setIsJoiningRoom(true);
      const { roomId: newRoomId, roomCode } =
        await createRoom({ gameSlug: gameId!, hostName: name });
      const { playerId: newPlayerId } =
        await joinRoom({ roomCode, playerName: name });

      setRoomId(newRoomId);
      setPlayerId(newPlayerId);
      setIsJoiningRoom(false);

      joinRoomSocket(newRoomId, newPlayerId, name);

      // seed the initial state per‐game
      let initialState: any = {};
      if (gameId === 'kniffel') {
        initialState = {
          dice: [1, 1, 1, 1, 1],
          selectedDice: [],
          rollCount: 0,
          currentPlayerIndex: 0,
          scores: {},
          gameOver: false,
          winner: null,
          gameOverTimestamp: null,
        };
      } else if (gameId === 'nim') {
        initialState = {
          heaps: [1, 3, 5, 7], 
          currentPlayerIndex: 0,
          gameOver: false,
          winner: null,
          gameOverTimestamp: null,
          lastMove: null,
        };
      } else {
        initialState = {};
      }
      pushStateSocket(newRoomId, initialState);
    } catch (err: any) {
      setError(err.message || "Failed to create room");
      setIsJoiningRoom(false);
    }
  }

  async function handleJoin(roomCode: string, name: string) {
    try {
      setIsJoiningRoom(true);

      //roomcode must match the gameId
      const gameSlugRes = await fetch(`/api?action=getGameSlugFromCode&roomCode=${roomCode}`);
      if (!gameSlugRes.ok) throw new Error("Failed to get game name");
      const { gameSlug: gameSlugFromCode } = await gameSlugRes.json();
      if (gameSlugFromCode !== gameId) throw new Error("Room code does not match game");




      const { playerId: newPlayerId } =
        await joinRoom({ roomCode, playerName: name });

      const res = await fetch(`/api?action=getRoomId&roomCode=${roomCode}`);
      if (!res.ok) throw new Error("Failed to get room ID");
      const { roomId: newRoomId } = await res.json();

      setRoomId(newRoomId);
      setPlayerId(newPlayerId);
      setIsJoiningRoom(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to join room");
      setIsJoiningRoom(false);
    }
  }

  // 1) Error
  if (error) return renderError(error, navigate);

  // 2) No IDs yet → show form
  if (!roomId || !playerId) {
    return (
      <CreateOrJoinRoom
        onCreate={handleCreate}
        onJoin={handleJoin}
        slug={gameId!}
        // loading={isJoiningRoom}
      />
    );
  }

  // 3) Waiting for sockets…

  const hasSocketState = playerDetails.length > 0 && latestState;
  const playerConfirmed = hasSocketState && playerDetails.some((p) => p.id === playerId);

  if (!hasSocketState || !playerConfirmed) {
    let txt = "Connecting to room…";
    if (hasSocketState && !playerConfirmed) txt = "Confirming player…";
    else if (!latestState) txt = "Waiting for game state…";
    else if (!playerDetails.length) txt = "Waiting for player list…";
    return renderLoading(txt,handleLeaveRoom);
  }


  // 4) Finally: provide context + render nested routes
  return (
    <RoomContext.Provider
      value={{
        roomId,
        playerId,
        players: playerDetails,
        latestState,
        pushState: (s) => pushStateSocket(roomId, s),
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}