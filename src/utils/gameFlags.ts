import type { Game } from '../models/Game';

export function isGameFree(game: Partial<Game>): boolean {
  if (game.is_free === true) return true;

  const finalPrice = game.price_overview?.final;
  if (typeof finalPrice === 'number' && finalPrice === 0) return true;

  const hasFreeToPlayCategory = game.categories?.some(
    category => category.description.toLowerCase() === 'free to play'
  );
  if (hasFreeToPlayCategory) return true;

  const hasFreeToPlayGenre = game.genres?.some(
    genre => genre.description.toLowerCase() === 'free to play'
  );
  if (hasFreeToPlayGenre) return true;

  return false;
}
