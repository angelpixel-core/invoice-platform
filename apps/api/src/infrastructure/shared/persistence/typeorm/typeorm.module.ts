import { DynamicModule, Module } from "@nestjs/common";

import { OUTBOX_TOKEN } from "../../../../application/shared/ports/outbox.token";
import { OutboxInMemoryRepository } from "../outbox/repositories/outbox.in-memory.repository";

import { CacheModule } from "../../cache/cache.module";

@Module({
  providers: [
    {
      provide: OUTBOX_TOKEN,
      useClass: OutboxInMemoryRepository,
    },
    invoiceRepositoryProvider,
    CacheModule,
  ],
  exports: [OUTBOX_TOKEN, invoiceRepositoryProvider],
})
export class InvoiceInfrastructureModule {}
