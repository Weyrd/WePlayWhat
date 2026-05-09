import React, { useState } from 'react';
import type { FetchedGame } from '../types';

interface ModalProps {
  game: FetchedGame;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ game, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);

  const images = [game.headerImage, ...game.screenshots];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative group">
          <img src={images[imgIndex]} alt={game.steamName} className="w-full h-64 object-cover" />
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/80"
                onClick={() => setImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              >
                &larr;
              </button>
              <button 
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/80"
                onClick={() => setImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              >
                &rarr;
              </button>
            </div>
          )}
          <button 
            className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black/80 flex items-center justify-center pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            &times;
          </button>
          
          {/* Image indicator dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all shadow-md ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h2 className="text-2xl font-bold">{game.steamName}</h2>
            {game.isUpdating && (
              <span className="shrink-0 text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded text-xs font-medium animate-pulse">
                Updating Cache...
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4 min-h-[1.25rem]">
            {game.fetchStatus === 'loading' && !game.developers?.length ? (
               <div className="h-4 w-32 bg-gray-700 animate-pulse rounded" />
            ) : game.developers && game.developers.length > 0 && (
              <span><span className="font-semibold text-gray-300">Developer:</span> {game.developers.join(', ')}</span>
            )}
            
            {game.fetchStatus === 'loading' && !game.releaseDate ? (
               <div className="h-4 w-24 bg-gray-700 animate-pulse rounded" />
            ) : game.releaseDate && (
              <span><span className="font-semibold text-gray-300">Release:</span> {game.releaseDate}</span>
            )}

            {game.isCoop && (
              <span className="text-blue-400 font-semibold border border-blue-400/30 bg-blue-400/10 px-1.5 rounded">Co-op</span>
            )}
          </div>

          <div className="mb-6 min-h-[4rem]">
            {game.fetchStatus === 'loading' && !game.shortDescription ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-700 animate-pulse rounded w-11/12"></div>
                <div className="h-4 bg-gray-700 animate-pulse rounded w-4/5"></div>
              </div>
            ) : (
              <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: game.shortDescription || 'No description available.' }} />
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <a 
              href={game.steamUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Open in Steam
            </a>
            {!game.owned && (
              <>
                <a 
                  href={game.dlCompareUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Check DLCompare
                </a>
                <a 
                  href={game.instantGamingUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Instant Gaming
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};