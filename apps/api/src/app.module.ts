import { Module } from "@nestjs/common";
import { PersistenceModule } from "./infrastructure/shared/persistence/persistence.module";

// import { HealthController } from "./interfaces/http/health/health.controller";

// import { InvoicesModule } from "./interfaces/http/invoices/invoices.module";

// import { messagingProviders } from "./infrastructure/messaging/messaging.module";

@Module({
  imports: [PersistenceModule.register()],
  // imports: [InvoicesModule],
  // controllers: [HealthController],
  // providers: [...messagingProviders],
})
export class AppModule {}
