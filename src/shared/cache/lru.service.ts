import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class LruCacheService {
  private readonly maxEntries = 2000;
  private readonly map = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    if (this.map.size >= this.maxEntries) {
      const firstKey = this.map.keys().next().value;
      if (firstKey) this.map.delete(firstKey);
    }
    this.map.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  del(key: string): void {
    this.map.delete(key);
  }

  purge(prefix?: string): number {
    let count = 0;
    if (!prefix) {
      count = this.map.size;
      this.map.clear();
      return count;
    }
    for (const k of Array.from(this.map.keys())) {
      if (k.startsWith(prefix)) {
        this.map.delete(k);
        count++;
      }
    }
    return count;
  }

  stats(): { size: number; maxEntries: number } {
    return { size: this.map.size, maxEntries: this.maxEntries };
  }
}


