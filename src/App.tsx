import { useState, useMemo, useEffect, useRef } from 'react';
import type { Game } from './models/Game';
import { FilterTag } from './models/FilterTag';
import { Header } from './components/Header';
import { GameGrid } from './components/GameGrid';
import { GameDetailModal } from './components/GameDetailModal';
import { TagFilterBar } from './components/TagFilterBar';
import { GenreFilterBar } from './components/GenreFilterBar';
import { WheelModal } from './components/WheelModal';
import { useGames, TableScope } from './hooks/useGames';
import { Toaster } from 'react-hot-toast';
import strings from './strings.json';
import { isGameFree } from './utils/gameFlags';

export type TagState = 'ignore' | 'include' | 'exclude' | 'only';

export interface TagFilter {
  label: string;
  state: TagState;
}

type WheelMode = 'idle' | 'picking' | 'result';

function App() {
  const { games, loadGamesData } = useGames();
  const [search, setSearch] = useState('');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const lastScrollYRef = useRef(0);

  // --- tag filters ---
  const [tagFilters, setTagFilters] = useState<TagFilter[]>([
    { label: FilterTag.OWNED, state: 'ignore' },
    { label: FilterTag.REMOTE_PLAY, state: 'ignore' },
    { label: FilterTag.DUO, state: 'ignore' },
    { label: FilterTag.FREE, state: 'ignore' },
  ]);
  const [genreStates, setGenreStates] = useState<Record<string, TagState>>({});

  const cycleTagState = (label: string) =>
    setTagFilters(prev =>
      prev.map(t => {
        if (t.label !== label) return t;
        const next: Record<TagState, TagState> = {
          ignore: 'include',
          include: 'exclude',
          exclude: 'only',
          only: 'ignore',
        };
        return { ...t, state: next[t.state] };
      })
    );

  const cycleGenreState = (label: string) =>
    setGenreStates(prev => {
      const next: Record<TagState, TagState> = {
        ignore: 'include',
        include: 'exclude',
        exclude: 'only',
        only: 'ignore',
      };
      const current = prev[label] ?? 'ignore';
      return { ...prev, [label]: next[current] };
    });

  // --- wheel ---
  const [wheelMode, setWheelMode] = useState<WheelMode>('idle');
  const [wheelSelected, setWheelSelected] = useState<Set<number>>(new Set());

  const handleWheelBtn = () => {
    if (wheelMode === 'idle') {
      setWheelMode('picking');
      setWheelSelected(new Set());
      return;
    }
    if (wheelMode === 'picking') {
      if (wheelSelected.size === 0) {
        setWheelMode('idle');
        return;
      }
      setWheelMode('result');
    }
  };

  const closeWheel = () => {
    setWheelMode('idle');
    setWheelSelected(new Set());
  };

  const toggleWheelSelect = (game: Game) => {
    if (wheelMode !== 'picking') return;
    setWheelSelected(prev => {
      const next = new Set(prev);
      if (next.has(game.id)) {
        next.delete(game.id);
      } else {
        next.add(game.id);
      }
      return next;
    });
  };

  const wheelBtnLabel = () => {
    if (wheelMode === 'idle') return strings.ui.wheel.idle;
    if (wheelMode === 'picking') {
      return wheelSelected.size === 0
        ? strings.ui.wheel.pickingEmpty
        : strings.ui.wheel.pickingActive.replace('{count}', wheelSelected.size.toString());
    }
    return strings.ui.wheel.idle;
  };

  const wheelBtnClass =
    wheelMode === 'picking'
      ? 'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors border-purple-500/60 text-purple-300 bg-purple-500/10 animate-pulse'
      : 'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600';

  const handleOpenModal = (game: Game) => {
    setSelectedGameId(game.id);
  };

  const selectedGame = games.find(g => g.id === selectedGameId) || null;

  const genreLabels = useMemo(
    () =>
      Array.from(
        new Set(
          games.flatMap(game =>
            (game.genres ?? [])
              .map(genre => genre.description?.trim())
              .filter((genre): genre is string => Boolean(genre))
          )
        )
      ).sort((a, b) => a.localeCompare(b)),
    [games]
  );

  const genreFilters = useMemo<TagFilter[]>(
    () => genreLabels.map(label => ({ label, state: genreStates[label] ?? 'ignore' })),
    [genreLabels, genreStates]
  );

  const filteredGames = useMemo(() => {
    const tagIncludes = tagFilters.filter(t => t.state === 'include');
    const tagExcludes = tagFilters.filter(t => t.state === 'exclude');
    const tagOnlys = tagFilters.filter(t => t.state === 'only');
    const genreIncludes = genreFilters.filter(g => g.state === 'include');
    const genreExcludes = genreFilters.filter(g => g.state === 'exclude');
    const genreOnlys = genreFilters.filter(g => g.state === 'only');

    const hasTag = (game: Game, label: string): boolean => {
      if (label === FilterTag.DUO) return game.isDuo ?? false;
      if (label === FilterTag.REMOTE_PLAY) return game.isRemotePlay ?? false;
      if (label === FilterTag.OWNED) return game.owned ?? false;
      if (label === FilterTag.FREE) return isGameFree(game);

      const l = label.toLowerCase();
      return game.categories?.some(c => c.description.toLowerCase().includes(l)) ?? false;
    };

    const hasGenre = (game: Game, genreLabel: string): boolean => {
      const normalizedLabel = genreLabel.toLowerCase();
      return game.genres?.some(genre => genre.description.toLowerCase() === normalizedLabel) ?? false;
    };

    return games
      .filter(g => (g.name || '').toLowerCase().includes(search.toLowerCase()))
      .filter(g => !onlyDiscounted || (g.price_overview?.discount_percent || 0) > 0)
      .filter(g => {
        if (tagOnlys.length > 0 && !tagOnlys.every(t => hasTag(g, t.label))) return false;
        if (tagIncludes.some(t => !hasTag(g, t.label))) return false;
        if (tagExcludes.some(t => hasTag(g, t.label))) return false;
        if (genreOnlys.length > 0 && !genreOnlys.every(genre => hasGenre(g, genre.label))) return false;
        if (genreIncludes.some(genre => !hasGenre(g, genre.label))) return false;
        if (genreExcludes.some(genre => hasGenre(g, genre.label))) return false;
        return true;
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [games, search, onlyDiscounted, tagFilters, genreFilters]);

  const ownedGames = filteredGames.filter(g => g.owned);
  const notOwnedGames = filteredGames.filter(g => !g.owned);

  const lastFetchedNum = Math.max(...games.map(g => g.lastFetched || 0));
  const lastFetchedStr = lastFetchedNum > 0 ? new Date(lastFetchedNum).toLocaleString() : '';

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      if (currentY <= 8) {
        setShowLegend(true);
      } else if (currentY > lastY) {
        setShowLegend(false);
      } else if (currentY < lastY) {
        setShowLegend(true);
      }

      lastScrollYRef.current = currentY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12 w-full">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="sticky top-0 z-40">
        <Header
          search={search}
          setSearch={setSearch}
          onlyDiscounted={onlyDiscounted}
          setOnlyDiscounted={setOnlyDiscounted}
          handleWheelBtn={handleWheelBtn}
          wheelBtnClass={wheelBtnClass}
          wheelBtnLabel={wheelBtnLabel()}
        />

        <TagFilterBar
          tags={tagFilters}
          onCycle={cycleTagState}
          showLegend={showLegend}
        />
        <GenreFilterBar genres={genreFilters} onCycle={cycleGenreState} />
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-12">
        {ownedGames.length > 0 && (
          <GameGrid
            title={strings.ui.ownedGames}
            scope={TableScope.OWNED}
            lastFetchedStr={lastFetchedStr}
            games={ownedGames}
            onClickCard={handleOpenModal}
            loadGamesData={loadGamesData}
            wheelMode={wheelMode}
            wheelSelected={wheelSelected}
            toggleWheelSelect={toggleWheelSelect}
          />
        )}

        {notOwnedGames.length > 0 && (
          <GameGrid
            title={strings.ui.notOwnedGames}
            scope={TableScope.NOT_OWNED}
            lastFetchedStr={lastFetchedStr}
            games={notOwnedGames}
            onClickCard={handleOpenModal}
            loadGamesData={loadGamesData}
            wheelMode={wheelMode}
            wheelSelected={wheelSelected}
            toggleWheelSelect={toggleWheelSelect}
          />
        )}

        {filteredGames.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {strings.ui.noGamesFound}
          </div>
        )}
      </main>

      {selectedGame && wheelMode === 'idle' && (
        <GameDetailModal
          key={selectedGame.id} 
          game={selectedGame} 
          onClose={() => setSelectedGameId(null)} 
        />
      )}

      {wheelMode === 'result' && (
        <WheelModal
          games={games.filter(g => wheelSelected.has(g.id))}
          onClose={closeWheel}
        />
      )}
    </div>
  );
}

export default App;
