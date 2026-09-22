import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { INVOICE_REPOSITORY_TOKEN } from "../../domain/invoices/ports/invoice.repository.token";
import { IssueInvoiceHandler } from "../../application/invoices/commands/issue-invoice.handler";
import { SearchInvoicesHandler } from "../../application/invoices/queries/search-invoices.handler";
import { InvalidateInvoicesCacheHandler } from "../../application/invoices/event-handlers/invalidate-invoices-cache.handler";

import { CacheModule } from "../shared/cache/cache.module";
import { OutboxPersistenceModule } from "../shared/persistence/outbox/outbox-persistence.module";
import { InvoiceOrmEntity } from "./persistence/typeorm/entities/invoice.orm-entity";

import { InvoiceTypeOrmRepository } from "./persistence/typeorm/repositories/invoice.typeorm.repository";
import { InvoiceInMemoryRepository } from "./persistence/in-memory/invoice.in-memory.repository";

const CommandHandlers = [IssueInvoiceHandler];
const QueryHandlers = [SearchInvoicesHandler];
const EventHandlers = [InvalidateInvoicesCacheHandler];

@Module({
  imports: [
    CqrsModule,
    CacheModule,
    OutboxPersistenceModule,
    TypeOrmModule.forFeature([InvoiceOrmEntity]),
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,

    InvoiceTypeOrmRepository,
    InvoiceInMemoryRepository,

    {
      provide: INVOICE_REPOSITORY_TOKEN,
      useFactory: (
        typeOrmRepository: InvoiceTypeOrmRepository,
        inMemoryRepository: InvoiceInMemoryRepository,
      ) => {
        const driver = process.env["PERSISTENCE_DRIVER"] ?? "typeorm";
        return driver === "in-memory" ? inMemoryRepository : typeOrmRepository;
      },
      inject: [InvoiceTypeOrmRepository, InvoiceInMemoryRepository],
    },
  ],
  exports: [INVOICE_REPOSITORY_TOKEN],
})
export class InvoicesModule {}
