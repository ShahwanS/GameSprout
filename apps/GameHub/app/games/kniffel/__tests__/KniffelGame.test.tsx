import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ roomCode: 'test-room' }),
  })
) as jest.Mock;

// Since KniffelGame doesn't use a custom hook, we'll mock the useRoom hook instead
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

// Mock UI components
jest.mock('~/components/ui/table', () => ({
  Table: ({ children, ...props }: any) => <table {...props}>{children}</table>,
  TableBody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
  TableHead: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
  TableHeader: ({ children, ...props }: any) => <th {...props}>{children}</th>,
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
}));

describe('KniffelGame', () => {
  test('renders without crashing', () => {
    const KniffelGame = require('../KniffelGame').default;
    render(<KniffelGame />);
    
    // Basic test to ensure component renders
    expect(true).toBe(true);
  });
}); 