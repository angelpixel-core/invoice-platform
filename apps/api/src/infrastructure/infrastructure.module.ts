import { Module } from "@nestjs/common";

import { CacheModule } from "./shared/cache/cache.module";
// import { messagingProviders } from "./shared/messaging/messaging.module";
import { MessagingModule } from "./shared/messaging/messaging.module";
import { PersistenceModule } from "./shared/persistence/persistence.module";
import { OutboxPersistenceModule } from "./shared/persistence/outbox/outbox-persistence.module";
import { InvoicesModule } from "./invoices/invoices.module";

// import { OUTBOX_TOKEN } from "../application/ports/outbox.token";

// import { InMemoryOutbox } from "./persistence/in-memory.outbox";
// import { OutboxInMemoryRepository } from "./shared/persistence/outbox/repositories/outbox.in-memory.repository";
// import { cacheProvider } from "./cache/cache.providers";

// import { invoiceRepositoryProvider } from "./shared/persistence/providers";

@Module({
  providers: [
    // Transversal capabilities (shared)
    CacheModule,
    MessagingModule.register(),
    PersistenceModule.register(),
    OutboxPersistenceModule,

    // Bounded Contexts / Slices
    InvoicesModule,
    // { provide: OUTBOX_TOKEN, useClass: OutboxInMemoryRepository },
    // cacheProvider,
    // ...messagingProviders,
    // invoiceRepositoryProvider,
  ],
  exports: [
    CacheModule,
    MessagingModule,
    PersistenceModule,
    OutboxPersistenceModule,
    InvoicesModule,
    // OUTBOX_TOKEN,
    // cacheModule,
    // ...messagingProviders,
    // invoiceRepositoryProvider,
  ],
})
// export class AppModule {}
export class InfrastructureModule {}
