'use client';

import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

const globalCache = new Map<string, CacheEntry<unknown>>();

export function clearCacheByPrefix(prefix: string) {
    for (const key of globalCache.keys()) {
        if (key.startsWith(prefix)) {
            globalCache.delete(key);
        }
    }
}

export function clearCache(key: string) {
    globalCache.delete(key);
}

interface UseStaleDataOptions {
    ttl?: number;
    enabled?: boolean;
}

interface UseStaleDataResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    revalidate: () => Promise<void>;
}

export function useStaleData<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: UseStaleDataOptions = {}
): UseStaleDataResult<T> {
    const { ttl = 60000, enabled = true } = options;

    const cached = globalCache.get(key);
    const [data, setData] = useState<T | null>(
        cached && Date.now() - cached.timestamp < cached.ttl ? (cached.data as T) : null
    );
    const [loading, setLoading] = useState<boolean>(!data && enabled);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            globalCache.set(key, { data: result, timestamp: Date.now(), ttl });
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [key, fetcher, ttl, enabled]);

    useEffect(() => {
        const cached = globalCache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            setData(cached.data as T);
            setLoading(false);
            return;
        }
        fetchData();
    }, [key, fetchData]);

    return { data, loading, error, revalidate: fetchData };
}
