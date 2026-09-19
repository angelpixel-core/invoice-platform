import { Inject, Injectable } from "@nestjs/common";

import { Invoice } from "../../../domain/invoices/entities/invoice";
import { INVOICE_REPOSITORY } from "../../../domain/invoices/repositories/invoice.repository.token";
import type { InvoiceRepository } from "../../../domain/invoices/repositories/invoice.repository";
import type { IssueInvoiceCommand } from "./issue-invoice.command";

@Injectable()
export class IssueInvoiceHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoices: InvoiceRepository,
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

    return { id: invoice.id };
  }
}
