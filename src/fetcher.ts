export async function fetchProxy<T>(
  apiUrl: string,
  options?: RequestInit
): Promise<T> {
  const proxyUrl =
    `${import.meta.env.VITE_PROXY_URL}${encodeURIComponent(apiUrl)}`;


  const response = await fetch(proxyUrl, {
    method: "GET",
    ...options,
    headers: {
      "x-proxy-auth": import.meta.env.VITE_PROXY_KEY || "",
      ...options?.headers,
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Proxy error: ${response.status}`);
  }

  try {
    const json = JSON.parse(text);
    return json as T;
  } catch  {
    throw new Error("Invalid JSON from proxy");
  }
}