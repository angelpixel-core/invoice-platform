import { Inject, Injectable } from "@nestjs/common";

import { randomUUID } from "node:crypto";

import { Invoice } from "./../../../domain/invoices/entities/invoice";
import { INVOICE_REPOSITORY } from "./../../../domain/invoices/repositories/invoice.repository.token";
import type { InvoiceRepository } from "./../../../domain/invoices/repositories/invoice.repository";
import type { IssueInvoiceCommand } from "./issue-invoice.command";

import { OUTBOX } from "../../ports/outbox.token";
import type { Outbox } from "../../ports/outbox";

@Injectable()
export class IssueInvoiceHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoices: InvoiceRepository,
    @Inject(OUTBOX) private readonly outbox: Outbox,
  ) {}

  async execute(c: IssueInvoiceCommand): Promise<{ id: string }> {
    const invoice = Invoice.issue({
      tenantId: c.tenantId,
      invoiceNumber: c.invoiceNumber,
      customerName: c.customerName,
      customerEmail: c.customerEmail,
      currency: c.currency,
      issueDate: c.issueDate,
      dueDate: c.dueDate,
      lines: c.lines.map((x) => ({
        ...x,
        unitPriceMinor: BigInt(x.unitPriceMinor),
      })),
    });
    await this.invoices.save(invoice);
    await this.outbox.append({
      metadata: {
        eventId: randomUUID(),
        eventType: "invoice.issued",
        eventVersion: 1,
        occurredAt: new Date().toISOString(),
        tenantId: invoice.tenantId,
        aggregateId: invoice.id,
        correlationId: c.correlationId,
      },
      payload: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        totalMinor: invoice.totalMinor.toString(),
        currency: invoice.currency,
      },
    });

    return { id: invoice.id };
  }
}
