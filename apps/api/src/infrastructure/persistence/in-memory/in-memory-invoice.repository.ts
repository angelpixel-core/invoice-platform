import { Injectable } from "@nestjs/common";
import type { Invoice } from "./../../../domain/invoices/entities/invoice";
import type { InvoiceRepository } from "./../../../domain/invoices/repositories/invoice.repository";

@Injectable()
export class InMemoryInvoiceRepository implements InvoiceRepository {
  private readonly invoices = new Map<string, Invoice>();

  async save(invoice: Invoice): Promise<void> {
    this.invoices.set(invoice.id, invoice);
  }

  async findById(tenantId: string, id: string): Promise<Invoice | null> {
    const x = this.invoices.get(id);
    return x?.tenantId === tenantId ? x : null;
  }

  async search(
    tenantId: string,
    query: string,
    page: number,
    limit: number,
  ): Promise<readonly Invoice[]> {
    const q = query.trim().toLowerCase();
    const rows = [...this.invoices.values()].filter(
      (x) =>
        x.tenantId === tenantId &&
        (!q ||
          `${x.invoiceNumber} ${x.customerName} ${x.customerEmail}`
            .toLowerCase()
            .includes(q)),
    );

    return rows.slice((page - 1) * limit, (page - 1) * limit + limit);
  }
}
