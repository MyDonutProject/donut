import { PublicKey } from "@solana/web3.js";

type CacheEntry<T> = {
  value: T;
  timestamp: number;
};

type CacheMap<T> = Map<string, CacheEntry<T>>;

export class CacheService {
  private static instance: CacheService;
  private caches: Map<string, CacheMap<any>> = new Map();

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private getCache<T>(namespace: string): CacheMap<T> {
    let cache = this.caches.get(namespace);
    if (!cache) {
      cache = new Map();
      this.caches.set(namespace, cache);
    }
    return cache as CacheMap<T>;
  }

  public set<T>(
    namespace: string,
    key: string,
    value: T,
    ttlSeconds: number = 60
  ): void {
    const cache = this.getCache<T>(namespace);
    cache.set(key, {
      value,
      timestamp: Date.now() + ttlSeconds * 1000,
    });
  }

  public get<T>(namespace: string, key: string): T | null {
    const cache = this.getCache<T>(namespace);
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.timestamp) {
      cache.delete(key);
      return null;
    }

    return entry.value;
  }

  public clear(namespace?: string): void {
    if (namespace) {
      this.caches.delete(namespace);
    } else {
      this.caches.clear();
    }
  }
}

// Type for PDA response
export type DerivedPDAResponse = {
  tokenMintAuthority: PublicKey;
  vaultAuthority: PublicKey;
  programSolVault: PublicKey;
  programTokenVault: PublicKey;
  referrerTokenAccount: PublicKey;
  userWsolAccount: PublicKey;
  userAccount: PublicKey;
  referrerAccount: PublicKey;
};
