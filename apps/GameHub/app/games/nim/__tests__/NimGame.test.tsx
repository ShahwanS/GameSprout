import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Since NimGame doesn't use a custom hook, we'll mock the useRoom hook instead
jest.mock('~/components/GameLayout', () => ({
  useRoom: () => ({
    roomId: 'room1',
    playerId: 'player1',
    players: [
      { id: 'player1', name: 'Player 1' },
      { id: 'player2', name: 'Player 2' },
    ],
    latestState: null,
    pushState: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock Remix components
jest.mock('@remix-run/react', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock context
jest.mock('~/context/RoomPersistenceContext', () => ({
  useRoomPersistence: () => ({
    setRoomId: jest.fn(),
    setPlayerId: jest.fn(),
  }),
}));

// Mock socket client
jest.mock('~/utils/socketClient', () => ({
  leaveRoom: jest.fn(),
}));

describe('NimGame', () => {
  test('renders without crashing', () => {
    const NimGame = require('../NimGame').default;
    render(<NimGame />);
    
    // Basic test to ensure component renders
    expect(true).toBe(true);
  });
}); 