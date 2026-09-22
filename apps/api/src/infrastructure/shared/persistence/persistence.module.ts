import { DynamicModule, Module, Provider } from "@nestjs/common";

// import { TypeOrmModule } from "@nestjs/typeorm";
import { OutboxPersistenceModule } from "./outbox/outbox-persistence.module";

// Domain
// import { INVOICE_REPOSITORY_TOKEN } from "../../../domain/invoices/repositories/invoice.repository.token";

// Infrastructure - TypeORM
// import { InvoiceOrmEntity } from "./typeorm/entities/invoice.orm-entity";
// import { InvoiceTypeOrmRepository } from "./typeorm/repositories/invoice.typeorm.repository";

// Infrastructure - In-Memory
// import { InvoiceInMemoryRepository } from "./in-memory/repositories/invoice.in-memory.repository";

@Module({})
export class PersistenceModule {
  static register(): DynamicModule {
    // const isInMemory = process.env.PESISTENCE_DRIVER === "in-memory";
    //
    // const invoiceRepositoryProvider: Provider = {
    //   provide: INVOICE_REPOSITORY_TOKEN,
    //
    //   useClass: isInMemory
    //     ? InvoiceInMemoryRepository
    //     : InvoiceTypeOrmRepository,
    // };
    //
    // const imports = isInMemory
    //   ? []
    //   : [TypeOrmModule.forFeature([InvoiceOrmEntity])];
    //
    // const providers = isInMemory
    //   ? [InvoiceInMemoryRepository, invoiceRepositoryProvider]
    //   : [InvoiceTypeOrmRepository, invoiceRepositoryProvider];
    //
    // return {
    //   module: PersistenceModule,
    //   imports,
    //   providers,
    //   exports: [INVOICE_REPOSITORY_TOKEN],
    // };

    const driver = process.env["PESISTENCE_DRIVER"] ?? "typeorm";

    // const selectedModule = TypeOrmPersistenceModule;
    const selectedModule = OutboxPersistenceModule;

    return {
      module: PersistenceModule,
      imports: [selectedModule],
      exports: [selectedModule],
    };
  }
}
