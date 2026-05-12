const RATE_LIMIT_WAIT_MS = 30000;
let rateLimitQueue: Promise<void> = Promise.resolve();
type RateLimitListener = (isLimited: boolean) => void;
const rateLimitListeners = new Set<RateLimitListener>();
let rateLimitPending = 0;

function enqueueRateLimitDelay(): Promise<void> {
  const wait = rateLimitQueue.then(
    () => new Promise<void>(resolve => setTimeout(resolve, RATE_LIMIT_WAIT_MS))
  );
  rateLimitQueue = wait;
  return wait;
}

function updateRateLimitPending(delta: number) {
  rateLimitPending = Math.max(0, rateLimitPending + delta);
  const isLimited = rateLimitPending > 0;
  rateLimitListeners.forEach(listener => listener(isLimited));
}

export function getIsRateLimited(): boolean {
  return rateLimitPending > 0;
}

export function subscribeRateLimit(listener: RateLimitListener): () => void {
  rateLimitListeners.add(listener);
  listener(getIsRateLimited());
  return () => rateLimitListeners.delete(listener);
}

export async function fetchProxy<T>(
  apiUrl: string,
  options?: RequestInit
): Promise<T> {
  const proxyUrl =
    `${import.meta.env.VITE_PROXY_URL}${encodeURIComponent(apiUrl)}`;

  while (true) {
    const response = await fetch(proxyUrl, {
      method: "GET",
      ...options,
      headers: {
        "x-proxy-auth": import.meta.env.VITE_PROXY_KEY || "",
        ...options?.headers,
      },
    });

    const text = await response.text();

    if (response.status === 429) {
      // Queue the retry to avoid hammering the proxy on rate limit.
      updateRateLimitPending(1);
      await enqueueRateLimitDelay();
      updateRateLimitPending(-1);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status}`);
    }

    try {
      const json = JSON.parse(text);
      return json as T;
    } catch {
      throw new Error("Invalid JSON from proxy");
    }
  }
}