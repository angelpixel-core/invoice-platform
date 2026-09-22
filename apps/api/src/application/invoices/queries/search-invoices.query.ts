import { Query } from "@nestjs/cqrs";
import type { Invoice } from "../../../domain/invoices/entities/invoice.entity";
// import type { SearchInvoicesInput } from "../../contracts/invoices/search-invoice.schema";

export interface SearchInvoicesQueryInput {
  tenantId: string;
  search: string;
  page: number;
  limit: number;
}

export class SearchInvoicesQuery extends Query<readonly Invoice[]> {
  public readonly tenantId: string;
  public readonly search: string;
  public readonly page: number;
  public readonly limit: number;

  // constructor(input: Partial<SearchInvoicesQuery>) {
  constructor(input: SearchInvoicesQueryInput) {
    super();
    // Object.assign(this, data);
    this.tenantId = input.tenantId;
    this.search = input.search;
    this.page = input.page;
    this.limit = input.limit;
  }
}
