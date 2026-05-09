import { useState } from 'react';
import type { Game } from './models/Game';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Check, Minus, X, RefreshCw } from 'lucide-react';
import { useGames, TableScope } from './hooks/useGames';
import { Toaster } from 'react-hot-toast';
import strings from './strings.json';

type CoopFilterState = 'ignore' | 'show' | 'hide';

function App() {
  const { games, loadGamesData } = useGames();
  const [search, setSearch] = useState('');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [coopFilter, setCoopFilter] = useState<CoopFilterState>('ignore');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  const toggleCoopFilter = () => {
    setCoopFilter(current => {
      if (current === 'ignore') return 'show';
      if (current === 'show') return 'hide';
      return 'ignore';
    });
  };

  const handleOpenModal = (game: Game) => {
    setSelectedGameId(game.id);
  };

  const selectedGame = games.find(g => g.id === selectedGameId) || null;

  const filteredGames = games
    .filter(g => (g.name || '').toLowerCase().includes(search.toLowerCase()))
    .filter(g => !onlyDiscounted || (g.price_overview?.discount_percent || 0) > 0)
    .filter(g => {
      if (coopFilter === 'ignore') return true;
      if (coopFilter === 'hide') return !g.isCoop;
      return g.isCoop;
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const ownedGames = filteredGames.filter(g => g.owned);
  const notOwnedGames = filteredGames.filter(g => !g.owned);

  const lastFetchedNum = Math.max(...games.map(g => g.lastFetched || 0));
  const lastFetchedStr = lastFetchedNum > 0 ? new Date(lastFetchedNum).toLocaleString() : '';

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12 w-full">
      <Toaster position="bottom-right" reverseOrder={false} />
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
            {strings.appTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
            <input 
              type="text" 
              placeholder={strings.ui.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:w-64 bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            
            <button 
              onClick={toggleCoopFilter}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              title={strings.ui.filterCoopTitle}
            >
              <div className="w-5 h-5 flex items-center justify-center rounded border border-gray-500 bg-gray-800">
                {coopFilter === 'show' && <Check size={14} className="text-green-400" />}
                {coopFilter === 'hide' && <X size={14} className="text-red-400" />}
                {coopFilter === 'ignore' && <Minus size={14} className="text-gray-400" />}
              </div>
              {strings.ui.coopOnly}
            </button>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium shrink-0 whitespace-nowrap">
              <input 
                type="checkbox" 
                checked={onlyDiscounted} 
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
              />
              {strings.ui.onlyDiscounted}
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-12">
        {ownedGames.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center">
              {strings.ui.ownedGames} {lastFetchedStr && <span className="text-xs font-normal text-gray-400 ml-2">({strings.status.lastFetched} {lastFetchedStr})</span>}
              <button onClick={() => loadGamesData(TableScope.OWNED)} className="ml-2 hover:bg-gray-700 p-1.5 rounded-full transition-colors" title="Force Refresh">
                <RefreshCw size={16} className="text-gray-400 hover:text-white" />
              </button>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {ownedGames.map(game => (
                <Card key={game.id} game={game} onClick={handleOpenModal} />
              ))}
            </div>
          </section>
        )}

        {notOwnedGames.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center">
              {strings.ui.notOwnedGames} {lastFetchedStr && <span className="text-xs font-normal text-gray-400 ml-2">({strings.status.lastFetched} {lastFetchedStr})</span>}
              <button onClick={() => loadGamesData(TableScope.NOT_OWNED)} className="ml-2 hover:bg-gray-700 p-1.5 rounded-full transition-colors" title="Force Refresh">
                <RefreshCw size={16} className="text-gray-400 hover:text-white" />
              </button>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {notOwnedGames.map(game => (
                <Card key={game.id} game={game} onClick={handleOpenModal} />
              ))}
            </div>
          </section>
        )}

        {filteredGames.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {strings.ui.noGamesFound}
          </div>
        )}
      </main>

      {selectedGame && (
        <Modal key={selectedGame.id} game={selectedGame} onClose={() => setSelectedGameId(null)} />
      )}
    </div>
  );
}

export default App;