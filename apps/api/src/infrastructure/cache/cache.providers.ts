import { CACHE } from "../../application/ports/cache.token";
import { RedisCache } from "./redis/redis-cache";

export const cacheProvider = { provide: CACHE, useClass: RedisCache };
