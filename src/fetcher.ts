export async function fetchProxy<T>(apiUrl: string, options?: RequestInit): Promise<T> {
  const proxyUrl = `${import.meta.env.VITE_PROXY_URL}${encodeURIComponent(apiUrl)}`;
  
  const defaultHeaders = {
    'x-proxy-auth': import.meta.env.VITE_PROXY_KEY || ''
  };

  const response = await fetch(proxyUrl, {
    method: 'GET',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from proxy: ${response.statusText}`);
  }
  
  return response.json();
}