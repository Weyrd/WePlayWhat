import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from './App';

// Mock fetch
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id: 730, name: "Counter-Strike 2", owned: true },
      { id: 1172470, name: "Apex Legends", owned: false }
    ])
  })
) as any;

describe('App Component', () => {
  it('renders title and search bar', async () => {
    render(<App />);
    expect(screen.getByText('WePlayWhat?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search games...')).toBeInTheDocument();
  });

  it('renders initial local games', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
      expect(screen.getByText('Apex Legends')).toBeInTheDocument();
    });
    
    // Counter-Strike is owned
    expect(screen.getByText('Owned Games')).toBeInTheDocument();
    expect(screen.getByText('Not Owned Games')).toBeInTheDocument();
  });
});