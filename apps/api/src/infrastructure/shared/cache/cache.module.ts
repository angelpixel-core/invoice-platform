import { Module } from "@nestjs/common";

import { CACHE_TOKEN } from "../../../application/shared/ports/cache.token";
import { RedisCacheAdapter } from "./redis.cache.adapter";

@Module({
  providers: [
    RedisCacheAdapter,
    {
      provide: CACHE_TOKEN,
      useClass: RedisCacheAdapter,
    },
  ],
  exports: [CACHE_TOKEN],
})
export class CacheModule {}
