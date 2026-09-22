import { Command } from "@nestjs/cqrs";

export interface IssueInvoiceCommandInput {
  tenantId: string;
  idempotencyKey: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  lines: Array<{
    description: string;
    quantity: number;
    unitPriceMinor: string;
  }>;
  correlationId: string;
}

export class IssueInvoiceCommand extends Command<{ id: string }> {
  public readonly tenantId: string;
  public readonly idempotencyKey: string;
  public readonly invoiceNumber: string;
  public readonly customerName: string;
  public readonly customerEmail: string;
  public readonly currency: string;
  public readonly issueDate: string;
  public readonly dueDate: string;
  public readonly lines: IssueInvoiceCommandInput["lines"];
  public readonly correlationId: string;

  constructor(input: IssueInvoiceCommandInput) {
    super();
    this.tenantId = input.tenantId;
    this.idempotencyKey = input.idempotencyKey;
    this.invoiceNumber = input.invoiceNumber;
    this.customerName = input.customerName;
    this.customerEmail = input.customerEmail;
    this.currency = input.currency;
    this.issueDate = input.issueDate;
    this.dueDate = input.dueDate;
    this.lines = input.lines;
    this.correlationId = input.correlationId;
  }
}
