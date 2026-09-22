import { Module } from "@nestjs/common";

import { CqrsModule } from "@nestjs/cqrs";

import { InvoicesController } from "./invoices.controller";
// import { PersistenceModule } from "../../../infrastructure/shared/persistence/persistence.module";
// import { InvoiceInfrastructureModule } from "../../../infrastructure/persistence/typeorm/typeorm.module";

import { IssueInvoiceHandler } from "../../../application/invoices/commands/issue-invoice.handler";
import { SearchInvoicesHandler } from "../../../application/invoices/queries/search-invoices.handler";

export const CommandQueryHandlers = [
  IssueInvoiceHandler,
  SearchInvoicesHandler,
];

@Module({
  imports: [
    CqrsModule,
    // InvoiceInfrastructureModule,
  ],
  controllers: [InvoicesController],
  providers: [...CommandQueryHandlers],
})
export class InvoicesModule {}
