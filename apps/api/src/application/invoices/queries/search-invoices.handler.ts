import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { CACHE_TOKEN } from "../../shared/ports/cache.token";
import type { Cache } from "../../shared/ports/cache.port";

import type { Invoice } from "../../../domain/invoices/entities/invoice.entity";
import type { InvoiceRepository } from "../../../domain/invoices/ports/invoice.repository.port";
import { INVOICE_REPOSITORY_TOKEN } from "../../../domain/invoices/ports/invoice.repository.token";
import { SearchInvoicesQuery } from "./search-invoices.query";

@QueryHandler(SearchInvoicesQuery)
export class SearchInvoicesHandler
  implements IQueryHandler<SearchInvoicesQuery>
{
  constructor(
    @Inject(CACHE_TOKEN) private readonly cache: Cache,
    @Inject(INVOICE_REPOSITORY_TOKEN)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(query: SearchInvoicesQuery): Promise<readonly Invoice[]> {
    const normalized = query.search.trim().toLowerCase();
    const key = `invoices:search:${query.tenantId}:${normalized}:${query.page}:${query.limit}`;
    const cached = await this.cache.get<readonly Invoice[]>(key);

    if (cached !== null) return cached;

    const result = await this.invoiceRepository.search(
      query.tenantId,
      normalized,
      query.page,
      query.limit,
    );

    await this.cache.set(key, result, 60);

    return result;
  }
}
