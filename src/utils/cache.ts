'use client'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class Cache {
  private storage: Map<string, CacheItem<any>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)
    
    this.storage.set(key, {
      data,
      timestamp: now,
      expiresAt
    })

    // Clean up expired items periodically
    this.cleanup()
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key)
    
    if (!item) {
      return null
    }

    if (Date.now() > item.expiresAt) {
      this.storage.delete(key)
      return null
    }

    return item.data as T
  }

  has(key: string): boolean {
    const item = this.storage.get(key)
    
    if (!item) {
      return false
    }

    if (Date.now() > item.expiresAt) {
      this.storage.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    
    for (const [key, item] of this.storage.entries()) {
      if (now > item.expiresAt) {
        this.storage.delete(key)
      }
    }
  }

  // Get cache stats
  getStats() {
    const now = Date.now()
    let expired = 0
    let active = 0

    for (const item of this.storage.values()) {
      if (now > item.expiresAt) {
        expired++
      } else {
        active++
      }
    }

    return { active, expired, total: this.storage.size }
  }
}

export const cache = new Cache()

// Utility functions for common cache patterns
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    const cacheKey = `memoize:${fn.name}:${key}`
    
    let result = cache.get(cacheKey)
    
    if (result === null) {
      result = fn(...args)
      cache.set(cacheKey, result, ttl)
    }
    
    return result
  }) as T
}

// Cache for API responses
export async function cachedFetch<T>(
  url: string, 
  options?: RequestInit,
  ttl?: number
): Promise<T> {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`
  
  let result = cache.get<T>(cacheKey)
  
  if (result === null) {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    result = await response.json()
    cache.set(cacheKey, result, ttl)
  }
  
  return result
}

// React hook for cached data
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
) {
  const getCachedOrFetch = async (): Promise<T> => {
    let data = cache.get<T>(key)
    
    if (data === null) {
      data = await fetcher()
      cache.set(key, data, ttl)
    }
    
    return data
  }

  return getCachedOrFetch
}