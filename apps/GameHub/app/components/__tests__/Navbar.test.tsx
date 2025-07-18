import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Remix components
jest.mock('@remix-run/react', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
  NavLink: ({ children, to, className, ...props }: any) => (
    <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className} {...props}>{children}</a>
  ),
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaGamepad: () => <div data-testid="fa-gamepad">Gamepad</div>,
  FaBars: () => <div data-testid="fa-bars">Bars</div>,
  FaTimes: () => <div data-testid="fa-times">Times</div>,
  FaHome: () => <div data-testid="fa-home">Home</div>,
  FaHandRock: () => <div data-testid="fa-hand-rock">HandRock</div>,
  FaBolt: () => <div data-testid="fa-bolt">Bolt</div>,
  FaDice: () => <div data-testid="fa-dice">Dice</div>,
  FaCoins: () => <div data-testid="fa-coins">Coins</div>,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Fish: () => <div data-testid="fish-icon">Fish</div>,
  Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
}));

import { Navbar } from '../Navbar';

describe('Navbar Component', () => {
  test('renders GameSprout logo and brand', () => {
    render(<Navbar />);
    
    expect(screen.getByRole('link', { name: /GameSprout/i })).toBeInTheDocument();
    expect(screen.getByText('GameSprout')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getAllByRole('link', { name: /Home/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /RPSLS/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /Reaction Test/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /Fishing/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /Kniffel/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /Nim/i })).toHaveLength(3);
  });

  test('has correct href attributes for navigation links', () => {
    render(<Navbar />);
    
    const homeLinks = screen.getAllByRole('link', { name: /Home/i });
    homeLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/');
    });
    
    const rpslsLinks = screen.getAllByRole('link', { name: /RPSLS/i });
    rpslsLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/rock-paper-scissors-lizard-spock');
    });
  });

  test('shows mobile menu button', () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /Toggle menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test('toggles mobile menu when button is clicked', () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /Toggle menu/i });
    
    fireEvent.click(mobileMenuButton);
    
    expect(screen.getAllByRole('link', { name: /Home/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /RPSLS/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /Reaction Test/i })).toHaveLength(3);
    
    fireEvent.click(mobileMenuButton);
    
    expect(screen.getAllByRole('link', { name: /Home/i })).toHaveLength(3);
  });

  test('shows online badge for online games in mobile menu', () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /Toggle menu/i });
    fireEvent.click(mobileMenuButton);
    
    expect(screen.getAllByText('Online')).toHaveLength(3);
  });

  test('has proper accessibility attributes', () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /Toggle menu/i });
    expect(mobileMenuButton).toHaveAttribute('aria-label', 'Toggle menu');
    
    const logoLink = screen.getByRole('link', { name: /GameSprout/i });
    expect(logoLink).toBeInTheDocument();
  });

  test('renders with correct styling classes', () => {
    render(<Navbar />);
    
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('fixed', 'top-0', 'w-full', 'bg-black/80');
  });
}); 