import { Inject, Injectable } from "@nestjs/common";

import { CACHE } from "../../ports/cache.token";
import type { Cache } from "../../ports/cache";

import { INVOICE_REPOSITORY } from "../../../domain/invoices/repositories/invoice.repository.token";
import type { InvoiceRepository } from "../../../domain/invoices/repositories/invoice.repository";
import type { SearchInvoicesQuery } from "./search-invoices.query";

@Injectable()
export class SearchInvoicesHandler {
  constructor(
    @Inject(CACHE) private readonly cache: Cache,
    @Inject(INVOICE_REPOSITORY) private readonly invoices: InvoiceRepository,
  ) {}

  async execute(q: SearchInvoicesQuery) {
    const normalized = q.search.trim().toLowerCase();
    const key = `invoices:search:${q.tenantId}:${normalized}:${q.page}:${q.limit}`;
    const cached = await this.cache.get(key);
    if (cached !== null) return cached;
    const result = await this.invoices.search(
      q.tenantId,
      normalized,
      q.page,
      q.limit,
    );
    await this.cache.set(key, result, 60);
    return result;
  }
}
