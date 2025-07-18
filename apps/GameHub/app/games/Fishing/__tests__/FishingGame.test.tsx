import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the custom hook
const mockUseFishingGame: any = {
  playerId: 'player1',
  allPlayers: [
    { id: 'player1', name: 'Player 1' },
    { id: 'player2', name: 'Player 2' },
    { id: 'player3', name: 'Player 3' },
  ],
  isHost: true,
  gameStarted: false,
  roomCode: 'ABC123',
  selectedRank: null,
  setSelectedRank: jest.fn(),
  selectedPlayer: null,
  setSelectedPlayer: jest.fn(),
  showGuessPopup: false,
  setShowGuessPopup: jest.fn(),
  guessedSuits: [],
  setGuessedSuits: jest.fn(),
  showCardSelection: false,
  setShowCardSelection: jest.fn(),
  currentAsk: null,
  setCurrentAsk: jest.fn(),
  showLastMove: false,
  setShowLastMove: jest.fn(),
  handleStartGame: jest.fn(),
  handleNewGame: jest.fn(),
  handlePlayerClick: jest.fn(),
  handleCardSelect: jest.fn(),
  handleAskForCards: jest.fn(),
  handleGuessSuits: jest.fn(),
  handleSuitToggle: jest.fn(),
  handleGuessDialogClose: jest.fn(),
  gameState: null,
  myHand: [],
  currentPlayerId: 'player1',
  currentPlayerName: 'Player 1',
  isMyTurn: false,
  availableRanks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  playerStockpiles: {},
  displayHand: jest.fn((hand) => hand),
};

jest.mock('../hooks/useFishingGame', () => ({
  useFishingGame: () => mockUseFishingGame,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock UI components
jest.mock('~/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('FishingGame', () => {
  test('renders without crashing', () => {
    const FishingGame = require('../FishingGame').default;
    render(<FishingGame />);
    
    // Basic test to ensure component renders
    expect(true).toBe(true);
  });
}); 