import { useEffect, useState } from 'react';
import type { LocalGame, FetchedGame } from './types';
import { fetchSteamData } from './api';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Check, Minus, X } from 'lucide-react';

type CoopFilterState = 'ignore' | 'show' | 'hide';

function App() {
  const [games, setGames] = useState<FetchedGame[]>([]);
  const [search, setSearch] = useState('');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [coopFilter, setCoopFilter] = useState<CoopFilterState>('ignore');
  const [selectedGame, setSelectedGame] = useState<FetchedGame | null>(null);

  const toggleCoopFilter = () => {
    setCoopFilter(current => {
      if (current === 'ignore') return 'show';
      if (current === 'show') return 'hide';
      return 'ignore';
    });
  };

  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then((localGames: LocalGame[]) => {
        const initialGames: FetchedGame[] = localGames.map(game => {
          const base: FetchedGame = {
            ...game,
            steamName: game.name,
            headerImage: `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/header.jpg`,
            screenshots: [],
            priceFormatted: null,
            discountPercent: 0,
            shortDescription: '',
            steamUrl: `https://store.steampowered.com/app/${game.id}`,
            dlCompareUrl: `https://www.dlcompare.fr/search?q=${encodeURIComponent(game.name)}`,
            instantGamingUrl: `https://www.instant-gaming.com/en/search/?query=${encodeURIComponent(game.name)}`,
            fetchStatus: 'loading',
            isCoop: game.coop || false
          };

          const cached = localStorage.getItem(`WPW_GAME_${game.id}`);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              const isStale = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
              return { ...base, ...parsed.data, fetchStatus: 'success', isStale, isUpdating: isStale };
            } catch (e) {
               // ignore parse error 
            }
          }
          return base;
        });
        
        setGames(initialGames);

        // Fetch missing or stale data sequentially in background
        const toFetch = initialGames.filter(g => g.fetchStatus === 'loading' || g.isStale);
        
        const fetchSequentially = async () => {
          for (const game of toFetch) {
            const fetched = await fetchSteamData(game);
            setGames(prev => prev.map(g => {
               if (g.id === game.id) {
                 // Check if it's the currently selected game in Modal, if so, update standard state too
                 if (selectedGame && selectedGame.id === game.id) {
                   setSelectedGame(fetched);
                 }
                 return fetched;
               }
               return g;
            }));
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        };
        fetchSequentially();

      })
      .catch(err => console.error("Error loading games.json:", err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Open instantly with what we have
  const handleOpenModal = async (game: FetchedGame) => {
    setSelectedGame(game);
  };

  const filteredGames = games
    .filter(g => g.steamName.toLowerCase().includes(search.toLowerCase()))
    .filter(g => !onlyDiscounted || g.discountPercent > 0)
    .filter(g => {
      if (coopFilter === 'ignore') return true;
      if (coopFilter === 'hide') return !g.isCoop;
      return g.isCoop;
    })
    .sort((a, b) => a.steamName.localeCompare(b.steamName));

  const ownedGames = filteredGames.filter(g => g.owned);
  const notOwnedGames = filteredGames.filter(g => !g.owned);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12 w-full">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            WePlayWhat?
          </h1>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
            <input 
              type="text" 
              placeholder="Search games..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:w-64 bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            
            <button 
              onClick={toggleCoopFilter}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              title="Filter Co-op games"
            >
              <div className="w-5 h-5 flex items-center justify-center rounded border border-gray-500 bg-gray-800">
                {coopFilter === 'show' && <Check size={14} className="text-green-400" />}
                {coopFilter === 'hide' && <X size={14} className="text-red-400" />}
                {coopFilter === 'ignore' && <Minus size={14} className="text-gray-400" />}
              </div>
              Co-op Only
            </button>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium shrink-0 whitespace-nowrap">
              <input 
                type="checkbox" 
                checked={onlyDiscounted} 
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
              />
              Only Discounted
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-12">
        {ownedGames.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Owned Games</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {ownedGames.map(game => (
                <Card key={game.id} game={game} onClick={handleOpenModal} />
              ))}
            </div>
          </section>
        )}

        {notOwnedGames.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Not Owned Games</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {notOwnedGames.map(game => (
                <Card key={game.id} game={game} onClick={handleOpenModal} />
              ))}
            </div>
          </section>
        )}

        {filteredGames.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No games found matching your filters.
          </div>
        )}
      </main>

      {selectedGame && (
        <Modal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
}

export default App;