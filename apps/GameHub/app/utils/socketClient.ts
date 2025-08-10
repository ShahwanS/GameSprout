import { io, Socket } from "socket.io-client";

// Get socket URL from environment variable exposed via window.ENV
// const SOCKET_URL = typeof window !== 'undefined' && window.ENV?.SOCKET_URL 
//   ? window.ENV.SOCKET_URL 
//   : "https://socket.stormyfocus.cloud";

const SOCKET_URL = "http://localhost:4000";


let socket: Socket | null = null;
let lastRoomId: string | null = null;
let lastPlayerId: string | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });
  }
  return socket as Socket;
}

export function joinRoom(
  roomId: string,
  playerId: string,
  playerName?: string
): void {
  // Store details for potential re-join
  lastRoomId = roomId;
  lastPlayerId = playerId;
  console.log(
    `SocketClient: Joining room ${roomId} as player ${playerId}`
  );
  getSocket().emit("joinRoom", { roomId, playerId, playerName });
}

export function pushState(roomId: string, state: any): void {
  getSocket().emit("pushState", { roomId, state });
}

export function onGameState(callback: (state: any) => void): void {
  getSocket().on("gameState", callback);
}

export function offGameState(callback: (state: any) => void): void {
  getSocket().off("gameState", callback);
}

export function onPlayersUpdate(callback: (players: string[]) => void): void {
  getSocket().on("playersUpdate", callback);
}

export function offPlayersUpdate(callback: (players: string[]) => void): void {
  getSocket().off("playersUpdate", callback);
}

export function leaveRoom(roomId: string, playerId: string): void {
  console.log(
    `SocketClient: Leaving room ${roomId} as player ${playerId}`
  );
  getSocket().emit("leaveRoom", { roomId, playerId });
  if (roomId === lastRoomId && playerId === lastPlayerId) {
    lastRoomId = null;
    lastPlayerId = null;
  }
}

/**
 * Call this function to explicitly disconnect the socket, for example,
 * when a user logs out or leaves the game application entirely.
 */
export function disconnectSocket(): void {
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    console.log("SocketClient: Manually disconnecting socket.");
    currentSocket.disconnect();
  }
  socket = null;
  lastRoomId = null;
  lastPlayerId = null;
}
