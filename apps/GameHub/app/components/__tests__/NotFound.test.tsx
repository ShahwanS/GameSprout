import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Remix components
jest.mock('@remix-run/react', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

// Mock window.history.back
const mockHistoryBack = jest.fn();
Object.defineProperty(window, 'history', {
  value: {
    back: mockHistoryBack,
  },
  writable: true,
});

import { NotFound } from '../NotFound';

describe('NotFound Component', () => {
  beforeEach(() => {
    mockHistoryBack.mockClear();
  });

  test('renders default error message when no children provided', () => {
    render(<NotFound />);
    
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });

  test('renders custom error message when children provided', () => {
    render(
      <NotFound>
        <p>Custom error message</p>
      </NotFound>
    );
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('The page you are looking for does not exist.')).not.toBeInTheDocument();
  });

  test('renders Go back button', () => {
    render(<NotFound />);
    
    const goBackButton = screen.getByRole('button', { name: /Go back/i });
    expect(goBackButton).toBeInTheDocument();
    expect(goBackButton).toHaveClass('bg-emerald-500', 'text-white', 'px-2', 'py-1', 'rounded', 'uppercase', 'font-black', 'text-sm');
  });

  test('renders Start Over link', () => {
    render(<NotFound />);
    
    const startOverLink = screen.getByRole('link', { name: /Start Over/i });
    expect(startOverLink).toBeInTheDocument();
    expect(startOverLink).toHaveAttribute('href', '/');
    expect(startOverLink).toHaveClass('bg-cyan-600', 'text-white', 'px-2', 'py-1', 'rounded', 'uppercase', 'font-black', 'text-sm');
  });

  test('calls window.history.back when Go back button is clicked', () => {
    render(<NotFound />);
    
    const goBackButton = screen.getByRole('button', { name: /Go back/i });
    fireEvent.click(goBackButton);
    
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });

  test('has proper layout structure', () => {
    render(<NotFound />);
    
    const container = screen.getByText('The page you are looking for does not exist.').parentElement?.parentElement;
    expect(container).toHaveClass('space-y-2', 'p-2');
  });

  test('has proper text styling', () => {
    render(<NotFound />);
    
    const textContainer = screen.getByText('The page you are looking for does not exist.').parentElement;
    expect(textContainer).toHaveClass('text-gray-600', 'dark:text-gray-400');
  });

  test('button and link are in flex container', () => {
    render(<NotFound />);
    
    const buttonContainer = screen.getByRole('button', { name: /Go back/i }).parentElement;
    expect(buttonContainer).toHaveClass('flex', 'items-center', 'gap-2', 'flex-wrap');
  });
}); 