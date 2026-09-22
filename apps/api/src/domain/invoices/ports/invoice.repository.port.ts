import type { Invoice } from "../entities/invoice.entity";

export interface InvoiceRepository {
  /**
   * Persist or update an agreggate Invoice in the storage.
   * The entity may come instantiated and with calculated busines rules.
   */
  save(params: Invoice): Promise<void>;

  /**
   * Search a invoice by ID in the tenant context.
   */
  findById(tenantId: string, id: string): Promise<Invoice | null>;

  /**
   * Make a paginated invoices search applying filters.
   */
  search(
    tenantId: string,
    query: string,
    page: number,
    limit: number,
  ): Promise<readonly Invoice[]>;
}
