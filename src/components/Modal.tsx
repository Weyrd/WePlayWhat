import React, { useState } from 'react';
import type { Game } from '../models/Game';
import strings from '../strings.json';

interface ModalProps {
  game: Game;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ game, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);

  const images = [];
  if (game.header_image) images.push(game.header_image);
  if (game.screenshots) {
    images.push(...game.screenshots.map(s => s.path_full));
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative group">
          {images.length > 0 ? (
            <img src={images[imgIndex]} alt={game.name} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gray-800 animate-pulse flex items-center justify-center">
              <span className="text-gray-500 font-medium">{strings.status.loading}</span>
            </div>
          )}
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
            <h2 className="text-2xl font-bold">{game.name}</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4 min-h-5">
            {!game.lastFetched && !game.developers?.length ? (
               <div className="h-4 w-32 bg-gray-700 animate-pulse rounded" />
            ) : game.developers && game.developers.length > 0 && (
              <span><span className="font-semibold text-gray-300">{strings.modal.developer}</span> {game.developers.join(', ')}</span>
            )}
            
            {!game.lastFetched && !game.release_date?.date ? (
               <div className="h-4 w-24 bg-gray-700 animate-pulse rounded" />
            ) : game.release_date?.date && (
              <span><span className="font-semibold text-gray-300">{strings.modal.release}</span> {game.release_date.date}</span>
            )}

            {game.isCoop && (
              <span className="text-blue-400 font-semibold border border-blue-400/30 bg-blue-400/10 px-1.5 rounded">{strings.badges.coop}</span>
            )}
            
            {game.isRemotePlay && (
              <span className="text-purple-400 font-semibold border border-purple-400/30 bg-purple-400/10 px-1.5 rounded">{strings.badges.remotePlay}</span>
            )}
          </div>

          <div className="mb-6 min-h-16">
            {!game.lastFetched && !game.short_description ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-700 animate-pulse rounded w-11/12"></div>
                <div className="h-4 bg-gray-700 animate-pulse rounded w-4/5"></div>
              </div>
            ) : (
              <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: game.short_description || strings.modal.noDescription }} />
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <a 
              href={game.steamUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {strings.modal.links.steam}
            </a>
            {!game.owned && (
              <>
                <a 
                  href={game.dlCompareUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {strings.modal.links.dlCompare}
                </a>
                <a 
                  href={game.instantGamingUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {strings.modal.links.instantGaming}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};