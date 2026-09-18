import { Invoice } from "../entities/invoice";

export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;
  findById(tenantId: string, id: string): Promise<Invoice | null>;
  search(
    tenantId: string,
    query: string,
    page: number,
    limit: number,
  ): Promise<Invoice[]>;
}
