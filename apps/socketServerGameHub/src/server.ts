import { config } from 'dotenv';
config(); 
import express from 'express';
import http from 'http';
import { Server, Socket } from "socket.io";
import cors from 'cors';
import { prisma } from '@repo/database'; 
import { Request, Response } from 'express'; 

interface SocketWithPlayerId extends Socket {
  playerId?: string;
}

const app = express();
const server = http.createServer(app);

// --- Configuration ---
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000"; 

// --- CORS Setup ---
const corsOptions = {
  origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(','), 
  methods: ["GET", "POST"]
};
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Socket Server is running');
});

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: corsOptions
});

const gameStates: { [roomId: string]: Record<string, any> } = {};
const roomPlayers: Record<string, Set<string>> = {};

io.on('connection', (socket: SocketWithPlayerId) => { 
  console.log(`User connected: ${socket.id}`);

  // --- Room Joining ---
  socket.on('joinRoom', ({ roomId, playerId, playerName }: { roomId: string; playerId: string; playerName?: string }) => {
    if (!roomId || !playerId) {
      console.error('joinRoom failed: Missing roomId or playerId', { roomId, playerId });
      socket.emit('joinError', 'Room ID and Player ID are required.');
      return;
    }

    console.log(`Player ${playerId} (${playerName || 'No Name'}) attempting to join room ${roomId}`);
    socket.join(roomId);
    socket.playerId = playerId;

    if (!roomPlayers[roomId]) {
      roomPlayers[roomId] = new Set<string>(); 
    }
    roomPlayers[roomId].add(playerId);

    const currentPlayers = Array.from(roomPlayers[roomId]);

    // Send current game state if it exists
    if (gameStates[roomId]) {
      socket.emit('gameState', gameStates[roomId]);
    }

    // Notify everyone about updated player list
    io.to(roomId).emit('playersUpdate', currentPlayers);

  });

  // --- Request Player List  ---
  socket.on('requestPlayerList', (roomId: string) => { 
     if (roomId && roomPlayers[roomId]) {
        const players = Array.from(roomPlayers[roomId]);
        socket.emit('playersUpdate', players);
     } else {
        console.log(`No player list found for room ${roomId} requested by ${socket.id}`);
        socket.emit('playersUpdate', []);
        return;
     }
  });


  // --- Game State Syncing---
  socket.on('pushState', ({ roomId, state }: { roomId: string; state: Record<string, any> }) => { 
    const requestingPlayerId = socket.playerId; 
    if (!roomId || !requestingPlayerId || !roomPlayers[roomId] || !roomPlayers[roomId].has(requestingPlayerId)) {
       console.warn(`pushState rejected: Socket ${socket.id} (Player ${requestingPlayerId}) tried to push to room ${roomId} but isn't joined or identified.`);
       return;
    } 

    // Enhanced logging for game over status
    if (state && typeof state.gameOver === 'boolean') {
      const winnerName = state.winner && state.winner.playerName ? state.winner.playerName : 'N/A';
      console.log(`State received for room ${roomId} from Player ${requestingPlayerId}. Game Over: ${state.gameOver}. Winner: ${winnerName}`);
    } else {
      console.log(`State received for room ${roomId} from Player ${requestingPlayerId}. (gameOver property not found or not a boolean)`);
    }
    
    gameStates[roomId] = state;
    io.to(roomId).emit('gameState', state); 
  });


  // --- Leaving Room / Disconnecting---
  socket.on('leaveRoom', async ({ roomId, playerId }: { roomId: string; playerId: string }) => { 

    console.log(`Handling explicit leaveRoom for Player ${playerId} from room ${roomId}`);

    let playerRemovedFromMemory = false;    

    // Attempt DB delete first
    try {
       await prisma.player.delete({
        where: { id: playerId }
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
         // Record not found, maybe already deleted - often okay
         console.log(`Player ${playerId} not found in DB during leaveRoom (maybe already deleted).`);
      } else {
        console.error(`DB Error deleting player ${playerId} during leaveRoom for room ${roomId}:`, err);
      }
    }

    // Handle in-memory state and broadcast
    try {
      if (roomPlayers[roomId] && roomPlayers[roomId].has(playerId)) {
        roomPlayers[roomId].delete(playerId);
        playerRemovedFromMemory = true;
      } else {
        console.warn(`Player ${playerId} was not found in in-memory room ${roomId} during leaveRoom.`);
      }

      if (playerRemovedFromMemory) {
        const remainingPlayerIds = Array.from(roomPlayers[roomId]);

        if (gameStates[roomId]) {
          const state = gameStates[roomId];
          let stateModified = false;
          if (state.scores && state.scores[playerId]) {
            delete state.scores[playerId];
            stateModified = true;
          }
          if (state.currentPlayerIndex != null && state.currentPlayerIndex >= remainingPlayerIds.length && remainingPlayerIds.length > 0) {
            state.currentPlayerIndex = 0;
            stateModified = true;
          }
          if (stateModified) {
            io.to(roomId).emit('gameState', state);
          }
        }
        // --- End Generic State Update ---

        // Broadcast updated player list
        io.to(roomId).emit('playersUpdate', remainingPlayerIds);

        // Cleanup empty room state
        if (remainingPlayerIds.length === 0) {
            console.log(`Room ${roomId} is now empty, deleting state.`);
            delete roomPlayers[roomId];
            delete gameStates[roomId];
        }
      }
    } catch (memoryErr) {
       console.error(`Error during in-memory cleanup/emit for player ${playerId} in room ${roomId} after leaveRoom:`, memoryErr);
    }

    // Make the socket leave the specific room
    socket.leave(roomId);

  });

  // --- Handle Disconnections ---
  socket.on('disconnecting', async (reason: string) => { 
    const playerId = socket.playerId; // Get playerId stored on socket

    if (!playerId) {
      console.warn(`Disconnecting socket ${socket.id} had no associated playerId. Reason: ${reason}`);
      return;
    }

    console.log(`Handling disconnection for Player ${playerId} (Socket ${socket.id}). Reason: ${reason}`);
    let playerWasInMemory = false;

    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue; 
      
      console.log(`Processing disconnect cleanup for Player ${playerId} in room ${roomId}`);
      playerWasInMemory = false; 

      // Attempt DB delete
      try {
        await prisma.player.delete({ where: { id: playerId } });
      } catch (err: any) {
        if (err.code === 'P2025') {
          console.log(`Player ${playerId} not found in DB on disconnect from room ${roomId} (maybe already deleted).`);
        } else {
          console.error(`DB Error deleting player ${playerId} on disconnect from room ${roomId}:`, err);
        }
      }

      // Handle in-memory state and broadcast
      try {
          if (roomPlayers[roomId] && roomPlayers[roomId].has(playerId)) {
            roomPlayers[roomId].delete(playerId);
            playerWasInMemory = true;
          } else {
            // This might happen if leaveRoom was called just before disconnect
            console.warn(`Player ${playerId} not found in memory for room ${roomId} during disconnect.`);
          }

          if (playerWasInMemory) {
            const remainingPlayerIds = Array.from(roomPlayers[roomId]);

            // --- Generic State Update Logic (from snippet) ---
            if (gameStates[roomId]) {
              const state = gameStates[roomId];
              let stateModified = false;
              if (state.scores && state.scores[playerId]) {
                delete state.scores[playerId];
                stateModified = true;
              }
              // index adjustment
              if (state.currentPlayerIndex != null && state.currentPlayerIndex >= remainingPlayerIds.length && remainingPlayerIds.length > 0) {
                state.currentPlayerIndex = 0;
                stateModified = true;
              }
              if (stateModified) {
                io.to(roomId).emit('gameState', state);
              }
            }
            // --- End Generic State Update ---

            io.to(roomId).emit('playersUpdate', remainingPlayerIds);

            if (remainingPlayerIds.length === 0) {
              console.log(`Room ${roomId} is now empty, deleting state.`);
              delete roomPlayers[roomId];
              delete gameStates[roomId];
            }
          }
      } catch (memoryErr) {
          console.error(`Error during in-memory cleanup/emit for player ${playerId} in room ${roomId} on disconnect:`, memoryErr);
      }
    } 
  }); 

});


server.listen(PORT, () => {
  console.log(`Socket.IO server listening on *:${PORT}`);
  console.log(`Allowed CORS origins: ${Array.isArray(corsOptions.origin) ? corsOptions.origin.join(', ') : corsOptions.origin}`);
});