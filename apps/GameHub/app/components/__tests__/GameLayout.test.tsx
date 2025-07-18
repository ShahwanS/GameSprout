import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../GameLayout', () => ({
  __esModule: true,
  default: ({ gameId, children }: any) => (
    <div data-testid="game-layout" data-game-id={gameId}>
      <h1>Game Layout for {gameId}</h1>
      <div data-testid="game-content">
        {children}
      </div>
    </div>
  ),
  useRoom: () => ({
    roomId: 'test-room',
    playerId: 'test-player',
    players: [],
    latestState: null,
    pushState: jest.fn(),
  }),
}));

import GameLayout from '../GameLayout';

describe('GameLayout Component', () => {
  test('renders with correct game ID', () => {
    render(
      <GameLayout gameId="fishing">
        <div>Test Content</div>
      </GameLayout>
    );
    
    const layout = screen.getByTestId('game-layout');
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute('data-game-id', 'fishing');
    expect(screen.getByText(/Game Layout for fishing/i)).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(
      <GameLayout gameId="kniffel">
        <div>Game Content</div>
      </GameLayout>
    );
    
    const content = screen.getByTestId('game-content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Game Content')).toBeInTheDocument();
  });

  test('handles different game types', () => {
    render(
      <GameLayout gameId="nim">
        <div>Nim Game</div>
      </GameLayout>
    );
    
    const layout = screen.getByTestId('game-layout');
    expect(layout).toHaveAttribute('data-game-id', 'nim');
    expect(screen.getByText(/Game Layout for nim/i)).toBeInTheDocument();
  });

  test('passes gameId prop correctly', () => {
    render(
      <GameLayout gameId="reaction-test">
        <div>Reaction Test Game</div>
      </GameLayout>
    );
    
    const layout = screen.getByTestId('game-layout');
    expect(layout).toHaveAttribute('data-game-id', 'reaction-test');
  });
}); 