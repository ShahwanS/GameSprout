// General portal types for rooms, players, and RPC I/O

export type GameSlug = 'kniffel' | 'rock-paper-scissors' | 'werewolf' | string;

export interface CreateRoomInput {
  gameSlug: GameSlug;
  hostName: string;
}

export interface CreateRoomOutput {
  roomId: string;
  roomCode: string;
}

export interface JoinRoomInput {
  roomCode: string;
  playerName: string;
}

export interface JoinRoomOutput {
  playerId: string;
}

export interface PlayerDTO {
  id: string;
  name: string;
  joinedAt: string; // ISO timestamp
}
