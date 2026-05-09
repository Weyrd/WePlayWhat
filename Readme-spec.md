Technical Specification: "GameNight Chooser" (SPA)
1. Project Overview

Build a Single Page Application (SPA) hosted on GitHub pages. The app helps a group of friends decide what to play by displaying a list of games (sourced from a local JSON file) split into "Owned" and "Not Owned".

The app will fetch live data (prices in Euro, images, discounts) from Steam.
Stack

    Framework: React + TypeScript + Vite
    Styling: CSS Modules, Tailwind, or plain CSS (Developer's choice)
    Hosting: Static (GitHub Pages)
    Backend: None.

2. Data Source & Models
2.1 Input Data (public/games.json)

The application relies on a static JSON file.

json

[
  { "id": 730, "name": "Counter-Strike 2", "owned": true },
  { "id": 1172470, "name": "Apex Legends", "owned": false }
]

2.2 TypeScript Interfaces

typescript

interface LocalGame {
  id: number;
  name: string; // Used as fallback
  owned: boolean;
}

interface FetchedGame extends LocalGame {
  steamName: string;
  headerImage: string; // url
  screenshots: string[]; // urls for the modal
  priceFormatted: string | null; // e.g., "19,99€"
  discountPercent: number; // 0 if no discount
  shortDescription: string;
  steamUrl: string;
  dlCompareUrl: string;
  instantGamingUrl: string;
  fetchStatus: 'loading' | 'success' | 'error';
}

3. External APIs & CORS Strategy
3.1 Steam API (Requires CORS Proxy)

To fetch game data in Euros (€), the app must use the Steam AppDetails endpoint wrapped in a CORS proxy.

    Endpoint: https://store.steampowered.com/api/appdetails?appids={APP_ID}&cc=fr&filters=basic,price_overview,screenshots
    CORS Proxy Example: https://api.allorigins.win/get?url= + encodeURIComponent(SteamURL)
    Note: The developer must extract the relevant nested data from the Steam response.

3.2 External Images

Images can be loaded directly from Steam's CDN without CORS issues:

    Header: https://cdn.akamai.steamstatic.com/steam/apps/{APP_ID}/header.jpg

3.3 Key Shops (DLCompare / Instant Gaming)

Since live scraping is impossible client-side, generate search links dynamically using the game's name:

    DLCompare: https://www.dlcompare.fr/recherche?q={GAME_NAME}
    Instant Gaming: https://www.instant-gaming.com/en/search/?query={GAME_NAME}

4. UI / UX Requirements
4.1 Layout

    Header: Title + Filter Bar.
    Main Content:
        Section 1: "Owned Games"
        Section 2: "Not Owned Games"
        If a section has no games (due to filters), hide it or show an empty state.

4.2 Filtering & Sorting

    Default Sort: Alphabetical A-Z (using the Steam name if fetched, otherwise the JSON name).
    Search Filter: A text input that filters games by name in real-time.
    Discounted Filter: A toggle/checkbox. If checked, only show games where discountPercent > 0. (This applies mostly to the "Not Owned" section, but keep logic simple: hide any game without a discount if toggled).

4.3 Medium Cards (List View)

Games are displayed as medium-sized rectangular cards in a responsive CSS Grid.

    Image: Steam header miniature at the top.
    Title: Game name.
    Footer (Owned = true): "Owned" badge. No price shown.
    Footer (Owned = false):
        Current Steam price (in €).
        Discount badge (e.g., "-50%") if applicable.
    Action: Clicking anywhere on the card opens the Game Modal.

4.4 Game Modal

When a user clicks a card, a modal overlay appears.

    Visuals: Larger image (or a carousel of the fetched Steam screenshots).
    Text: Game title, short description (if fetched).
    Actions / Buttons:
        "Open in Steam": Opens the Steam store page (https://store.steampowered.com/app/{APP_ID}).
        (Only if owned === false): "Check DLCompare" (Opens DLCompare search URL).
        (Only if owned === false): "Check Instant Gaming" (Opens Instant Gaming search URL).

5. Technical Constraints & Error Handling

    Progressive Loading: Because the app has to fetch data for every ID in the JSON, it should not block the UI. Render skeleton cards or the local JSON data immediately, and update the cards asynchronously as Steam data resolves.
    Rate Limiting Handling: If the Steam API rate-limits the CORS proxy (or if the request fails), the card should gracefully fall back to displaying the local JSON name and a generic "Price Unavailable" string. The Steam CDN image usually still works even if the API fails.
    No Backend: The implementing developer must not include any Node.js/Express server code. The output must be statically buildable via npm run build.
