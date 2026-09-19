import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

import type { Cache } from "../../../application/ports/cache";

@Injectable()
export class RedisCache implements Cache {
  private readonly redis = new Redis(
    process.env.REDIS_URL ?? "redis://localhost:6379",
  );

  async get<T>(key: string): Promise<T | null> {
    const v = await this.redis.get(key);
    return v === null ? null : (JSON.parse(v) as T);
  }
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), "EX", ttl);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
