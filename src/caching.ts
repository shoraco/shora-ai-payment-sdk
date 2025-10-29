/**
 * Caching utilities
 */

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
}

interface CacheItem<T> {
  value: T;
  expires: number;
  created: number;
}

class MemoryCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private readonly ttl: number;
  private readonly maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl || 300000; // 5 minutes default
    this.maxSize = options.maxSize || 1000; // 1000 items default
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }

  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const expires = now + (ttl || this.ttl);
    
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      value,
      expires,
      created: now
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

class CacheManager {
  private caches = new Map<string, MemoryCache>();

  getCache<T>(name: string, options?: CacheOptions): MemoryCache<T> {
    if (!this.caches.has(name)) {
      this.caches.set(name, new MemoryCache<T>(options));
    }
    return this.caches.get(name) as MemoryCache<T>;
  }

  clearCache(name: string): void {
    this.caches.delete(name);
  }

  clearAllCaches(): void {
    this.caches.clear();
  }

  cleanupAllCaches(): void {
    for (const cache of this.caches.values()) {
      cache.cleanup();
    }
  }
}

export const cacheManager = new CacheManager();

export function cached<T = any>(
  ttl: number = 300000,
  cacheName: string = 'default'
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const cache = cacheManager.getCache<T>(cacheName, { ttl });

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
      
      // Execute method and cache result
      const result = await method.apply(this, args);
      cache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

export { MemoryCache, CacheManager };