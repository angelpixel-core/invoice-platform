import { Injectable } from "@nestjs/common";

import { Invoice } from "../../../../domain/invoices/entities/invoice.entity";
import type { InvoiceRepository } from "../../../../domain/invoices/ports/invoice.repository.port";
import type { InvoiceStatus } from "../../../../domain/invoices/value-objects/invoice-status.vo";

interface InMemoryInvoiceRecord {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: string;
  lines: Array<{
    description: string;
    quantity: number;
    unitPriceMinor: string;
  }>;
  subtotalMinor: string;
  taxTotalMinor: string;
  totalMinor: string;
}

@Injectable()
export class InvoiceInMemoryRepository implements InvoiceRepository {
  private readonly invoices = new Map<string, InMemoryInvoiceRecord>();

  async save(invoice: Invoice): Promise<void> {
    const record = this.toRecord(invoice);
    this.invoices.set(this.buildKey(invoice.tenantId, invoice.id), record);
  }

  async findById(tenantId: string, id: string): Promise<Invoice | null> {
    const key = this.buildKey(tenantId, id);
    const record = this.invoices.get(key);

    if (!record) return null;

    return this.toDomain(record);
  }

  async search(
    tenantId: string,
    query: string,
    page: number,
    limit: number,
  ): Promise<readonly Invoice[]> {
    const normalizedQuery = query.trim().toLowerCase();

    const matchingRecords = Array.from(this.invoices.values())
      .filter((record) => record.tenantId === tenantId)
      .filter((record) => {
        if (!normalizedQuery) return true;
        return (
          record.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
          record.customerName.toLowerCase().includes(normalizedQuery) ||
          record.customerEmail.toLowerCase().includes(normalizedQuery)
        );
      });

    const start = (page - 1) * limit;
    const paginated = matchingRecords.slice(start, start + limit);

    return paginated.map((record) => this.toDomain(record));
  }

  private buildKey(tenantId: string, id: string): string {
    return `${tenantId}:${id}`;
  }

  private toRecord(invoice: Invoice): InMemoryInvoiceRecord {
    return {
      id: invoice.id,
      tenantId: invoice.tenantId,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      lines: invoice.lines.map((line) => ({
        description: line.description,
        quantity: line.quantity,
        unitPriceMinor: line.unitPriceMinor.toString(),
      })),
      subtotalMinor: invoice.subtotalMinor.toString(),
      taxTotalMinor: invoice.taxTotalMinor.toString(),
      totalMinor: invoice.totalMinor.toString(),
    };
  }

  private toDomain(record: InMemoryInvoiceRecord): Invoice {
    return Invoice.reconstitute({
      id: record.id,
      tenantId: record.tenantId,
      invoiceNumber: record.invoiceNumber,
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      currency: record.currency,
      issueDate: record.issueDate,
      dueDate: record.dueDate,
      status: record.status as InvoiceStatus,
      subtotalMinor: BigInt(record.subtotalMinor),
      taxTotalMinor: BigInt(record.taxTotalMinor),
      totalMinor: BigInt(record.totalMinor),
      lines: record.lines.map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unitPriceMinor: BigInt(l.unitPriceMinor),
      })),
    });
  }
}
