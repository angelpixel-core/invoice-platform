import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "node:crypto";

import type { InvoiceRepository } from "../../../domain/invoices/ports/invoice.repository.port";
import { INVOICE_REPOSITORY_TOKEN } from "../../../domain/invoices/ports/invoice.repository.token";
import { InvoiceIssuedEvent } from "../../../domain/invoices/events/invoice-issued.event";
import { IssueInvoiceCommand } from "./issue-invoice.command";

import { OUTBOX_TOKEN } from "../../shared/ports/outbox.token";
import type { Outbox } from "../../shared/ports/outbox.port";

@CommandHandler(IssueInvoiceCommand)
export class IssueInvoiceHandler
  implements ICommandHandler<IssueInvoiceCommand>
{
  constructor(
    @Inject(OUTBOX_TOKEN) private readonly outbox: Outbox,
    @Inject(INVOICE_REPOSITORY_TOKEN)
    private readonly invoiceRepository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: IssueInvoiceCommand): Promise<{ id: string }> {
    const invoice = await this.invoiceRepository.save({
      tenantId: command.tenantId,
      invoiceNumber: command.invoiceNumber,
      customerName: command.customerName,
      customerEmail: command.customerEmail,
      currency: command.currency,
      issueDate: command.issueDate,
      dueDate: command.dueDate,
      lines: command.lines.map((line) => ({
        ...line,
        unitPriceMinor: BigInt(line.unitPriceMinor),
      })),
    });

    await this.outbox.append({
      metadata: {
        eventId: randomUUID(),
        eventType: "invoice.issued",
        eventVersion: 1,
        occurredAt: new Date().toISOString(),
        tenantId: invoice.tenantId,
        aggregateId: invoice.id,
        correlationId: command.correlationId,
      },
      payload: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        totalMinor: invoice.totalMinor.toString(),
        currency: invoice.currency,
      },
    });

    await this.eventBus.publish(
      new InvoiceIssuedEvent(
        invoice.id,
        invoice.tenantId,
        invoice.invoiceNumber,
        invoice.totalMinor.toString(),
        invoice.currency,
        command.correlationId,
      ),
    );

    return { id: invoice.id };
  }
}
