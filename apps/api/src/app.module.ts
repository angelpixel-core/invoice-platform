import { Module } from "@nestjs/common";

import { HealthController } from "./interfaces/http/health/health-controller";

import { InvoicesController } from "./interfaces/http/invoices/invoices.controller";
import { IssueInvoiceHandler } from "./application/commands/issue-invoice/issue-invoice.handler";
import { SearchInvoicesHandler } from "./application/queries/search-invoices/search-invoices.handler";
import { invoiceRepositoryProvider } from "./infrastructure/persistence/persistence.providers";

import { cacheProvider } from "./infrastructure/cache/cache.providers";

@Module({
  controllers: [HealthController, InvoicesController],
  providers: [
    invoiceRepositoryProvider,
    IssueInvoiceHandler,
    SearchInvoicesHandler,
    cacheProvider,
  ],
})
export class AppModule {}
