"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const database_1 = require("@repo/database");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// --- Configuration ---
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
// --- CORS Setup ---
const corsOptions = {
    origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(','),
    methods: ["GET", "POST"]
};
app.use((0, cors_1.default)(corsOptions));
app.get('/', (req, res) => {
    res.send('Socket Server is running');
});
// --- Socket.IO Setup ---
const io = new socket_io_1.Server(server, {
    cors: corsOptions
});
const gameStates = {};
const roomPlayers = {};
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // --- Room Joining ---
    socket.on('joinRoom', ({ roomId, playerId, playerName }) => {
        if (!roomId || !playerId) {
            console.error('joinRoom failed: Missing roomId or playerId', { roomId, playerId });
            socket.emit('joinError', 'Room ID and Player ID are required.');
            return;
        }
        console.log(`Player ${playerId} (${playerName || 'No Name'}) attempting to join room ${roomId}`);
        socket.join(roomId);
        socket.playerId = playerId;
        if (!roomPlayers[roomId]) {
            roomPlayers[roomId] = new Set();
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
    socket.on('requestPlayerList', (roomId) => {
        if (roomId && roomPlayers[roomId]) {
            const players = Array.from(roomPlayers[roomId]);
            socket.emit('playersUpdate', players);
        }
        else {
            console.log(`No player list found for room ${roomId} requested by ${socket.id}`);
            socket.emit('playersUpdate', []);
            return;
        }
    });
    // --- Game State Syncing---
    socket.on('pushState', ({ roomId, state }) => {
        const requestingPlayerId = socket.playerId;
        if (!roomId || !requestingPlayerId || !roomPlayers[roomId] || !roomPlayers[roomId].has(requestingPlayerId)) {
            console.warn(`pushState rejected: Socket ${socket.id} (Player ${requestingPlayerId}) tried to push to room ${roomId} but isn't joined or identified.`);
            return;
        }
        // Enhanced logging for game over status
        if (state && typeof state.gameOver === 'boolean') {
            const winnerName = state.winner && state.winner.playerName ? state.winner.playerName : 'N/A';
            console.log(`State received for room ${roomId} from Player ${requestingPlayerId}. Game Over: ${state.gameOver}. Winner: ${winnerName}`);
        }
        else {
            console.log(`State received for room ${roomId} from Player ${requestingPlayerId}. (gameOver property not found or not a boolean)`);
        }
        gameStates[roomId] = state;
        io.to(roomId).emit('gameState', state);
    });
    // --- Leaving Room / Disconnecting---
    socket.on('leaveRoom', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, playerId }) {
        console.log(`Handling explicit leaveRoom for Player ${playerId} from room ${roomId}`);
        let playerRemovedFromMemory = false;
        // Attempt DB delete first
        try {
            yield database_1.prisma.player.delete({
                where: { id: playerId }
            });
        }
        catch (err) {
            if (err.code === 'P2025') {
                // Record not found, maybe already deleted - often okay
                console.log(`Player ${playerId} not found in DB during leaveRoom (maybe already deleted).`);
            }
            else {
                console.error(`DB Error deleting player ${playerId} during leaveRoom for room ${roomId}:`, err);
            }
        }
        // Handle in-memory state and broadcast
        try {
            if (roomPlayers[roomId] && roomPlayers[roomId].has(playerId)) {
                roomPlayers[roomId].delete(playerId);
                playerRemovedFromMemory = true;
            }
            else {
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
        }
        catch (memoryErr) {
            console.error(`Error during in-memory cleanup/emit for player ${playerId} in room ${roomId} after leaveRoom:`, memoryErr);
        }
        // Make the socket leave the specific room
        socket.leave(roomId);
    }));
    // --- Handle Disconnections ---
    socket.on('disconnecting', (reason) => __awaiter(void 0, void 0, void 0, function* () {
        const playerId = socket.playerId; // Get playerId stored on socket
        if (!playerId) {
            console.warn(`Disconnecting socket ${socket.id} had no associated playerId. Reason: ${reason}`);
            return;
        }
        console.log(`Handling disconnection for Player ${playerId} (Socket ${socket.id}). Reason: ${reason}`);
        let playerWasInMemory = false;
        for (const roomId of socket.rooms) {
            if (roomId === socket.id)
                continue;
            console.log(`Processing disconnect cleanup for Player ${playerId} in room ${roomId}`);
            playerWasInMemory = false;
            // Attempt DB delete
            try {
                yield database_1.prisma.player.delete({ where: { id: playerId } });
            }
            catch (err) {
                if (err.code === 'P2025') {
                    console.log(`Player ${playerId} not found in DB on disconnect from room ${roomId} (maybe already deleted).`);
                }
                else {
                    console.error(`DB Error deleting player ${playerId} on disconnect from room ${roomId}:`, err);
                }
            }
            // Handle in-memory state and broadcast
            try {
                if (roomPlayers[roomId] && roomPlayers[roomId].has(playerId)) {
                    roomPlayers[roomId].delete(playerId);
                    playerWasInMemory = true;
                }
                else {
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
            }
            catch (memoryErr) {
                console.error(`Error during in-memory cleanup/emit for player ${playerId} in room ${roomId} on disconnect:`, memoryErr);
            }
        }
    }));
});
server.listen(PORT, () => {
    console.log(`Socket.IO server listening on *:${PORT}`);
    console.log(`Allowed CORS origins: ${Array.isArray(corsOptions.origin) ? corsOptions.origin.join(', ') : corsOptions.origin}`);
});
