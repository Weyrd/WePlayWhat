import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSteamData } from './api';

describe('fetchSteamData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('correctly maps steam API payload to FetchedGame including price and description', async () => {
    const mockGame = { id: 12345, name: 'Test Game', owned: true };
    
    globalThis.fetch = vi.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          contents: JSON.stringify({
            "12345": {
              success: true,
              data: {
                name: "Test Game Full",
                short_description: "This is a test description.",
                header_image: "img.jpg",
                release_date: { date: "1 Jan, 2024" },
                developers: ["Dev Studio"],
                price_overview: {
                  final_formatted: "19,99€",
                  discount_percent: 10
                },
                categories: [
                  { id: 9, description: "Co-op" }
                ],
                screenshots: [{ path_full: "scr1.jpg" }]
              }
            }
          })
        })
      })
    ) as any;

    const result = await fetchSteamData(mockGame);

    expect(result.fetchStatus).toBe('success');
    expect(result.steamName).toBe('Test Game Full');
    expect(result.shortDescription).toBe('This is a test description.');
    expect(result.priceFormatted).toBe('19,99€');
    expect(result.discountPercent).toBe(10);
    expect(result.isCoop).toBe(true);
    expect(result.developers).toEqual(['Dev Studio']);
    expect(result.releaseDate).toBe('1 Jan, 2024');
    expect(result.screenshots).toEqual(['scr1.jpg']);
  });
});
