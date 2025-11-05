import axios from 'axios';

export function createAxiosInstance(baseURL: string, apiKey?: string) {
  const client = axios.create({ 
    baseURL, 
    timeout: 30000 
  });
  
  if (apiKey) {
    // Support both Authorization Bearer and X-API-Key headers
    if (apiKey.startsWith('sk_') || apiKey.startsWith('Bearer ')) {
      client.defaults.headers.common['Authorization'] = `Bearer ${apiKey.replace('Bearer ', '')}`;
    } else {
      // Default to X-API-Key for compatibility
      client.defaults.headers.common['X-API-Key'] = apiKey;
      // Also set Authorization for some endpoints
      client.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
    }
  }
  
  client.interceptors.response.use(
    (r) => {
      // Safely access headers (may be IncomingHttpHeaders or AxiosHeaders)
      const headers = r.headers || {};
      const dep = (headers as any)['deprecation'] || (headers as any)['Deprecation'];
      const sunset = (headers as any)['sunset'] || (headers as any)['Sunset'];
      const link = (headers as any)['link'] || (headers as any)['Link'];
      if (dep === 'true' || sunset) {
        console.warn(`[Shora-SDK] Deprecation warning: sunset=${sunset} link=${link}`);
      }
      return r;
    },
    (e) => Promise.reject(e)
  );
  
  return client;
}

