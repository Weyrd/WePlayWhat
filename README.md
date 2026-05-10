# TODO
- filter on categorie (adventure etc)
- shuffled card, after the result/clicked on the winning card, we can look at the other cards, hovering them will flip them
- sticky header (searchbar/top and tag filter bar) the bar with explanation neutral, inlcude, exclude etrc is hidden when scrolling down, but appears when scrolling up or at the top of the page
- some text still hardcoded in resultpanel

# WePlayWhat (WPW)

A React + TypeScript web app to help you pick co-op games from your Steam list.

It loads games from `public/games.json`, enriches them with Steam metadata through a proxy, and gives you fast filters plus a **Wheel Decide** picker.

## Features

- Search by game name
- Owned / not-owned sections
- Discount-only filter
- Tag filters with 4 states: ignore, include, exclude, only
- Wheel Decide mode (select cards, then random pick)
- Game details modal (screenshots, prices, DLC, links)
- Local cache in `localStorage` for fetched Steam data



## Environment variables

Create a `.env` file at the project root:

```env
VITE_PROXY_URL=https...
VITE_PROXY_KEY=your-super-secret-key
```

`VITE_PROXY_KEY` must match the proxy server secret key.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Scripts

- `npm run dev` — start local dev server
- `npm run lint` — run ESLint
- `npm run build` — type-check + production build
- `npm run preview` — build and run with Wrangler
- `npm run test` — run Vitest (currently exits with “No test files found” until tests are added)

## Data source format

`public/games.json` contains an array like:

```json
[
  { "id": 238460, "name": "BattleBlock Theater", "owned": true },
  { "id": 1123450, "name": "Chicory: A Colorful Tale", "owned": true, "coop": true }
]
```

Fields:

- `id` (number): Steam app id
- `name` (string): game title
- `owned` (boolean): owned status
- `coop` (optional boolean): forces co-op badge

## Notes

- Steam metadata is fetched client-side through your configured proxy.
- Cached entries use keys like `WPW_GAME_<appId>` in browser local storage.
