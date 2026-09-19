import { Inject, Injectable } from "@nestjs/common";

import { INVOICE_REPOSITORY } from "../../../domain/invoices/repositories/invoice.repository.token";
import type { InvoiceRepository } from "../../../domain/invoices/repositories/invoice.repository";
import type { SearchInvoicesQuery } from "./search-invoices.query";

@Injectable()
export class SearchInvoicesHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoices: InvoiceRepository,
  ) {}

  execute(q: SearchInvoicesQuery) {
    return this.invoices.search(q.tenantId, q.search, q.page, q.limit);
  }
}
