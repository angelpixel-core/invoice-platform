import { Injectable, OnModuleDestroy } from "@nestjs/common";

import Redis from "ioredis";

import type { Cache } from "../../../application/shared/ports/cache.port";

@Injectable()
export class RedisCacheAdapter implements Cache, OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    const redisUrl = process.env["REDIS_URL"] ?? "redis://localhost:6379";
    this.client = new Redis(redisUrl);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);

    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, serialized, "EX", ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    // INFO: We use SCAN instead of KEYS to not block the Redis thread in production
    const stream = this.client.scanStream({
      match: pattern,
      count: 100,
    });

    const pipeline = this.client.pipeline();

    for await (const keys of stream) {
      if (Array.isArray(keys) && keys.length > 0) {
        for (const key of keys) {
          pipeline.del(key);
        }
      }
    }

    await pipeline.exec();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
