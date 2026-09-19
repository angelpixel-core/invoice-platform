import type { IssueInvoiceInput } from "../../contracts/invoices/issue-invoice.schema";

export interface IssueInvoiceCommand extends IssueInvoiceInput {
  tenantId: string;
  idempotencyKey: string;
  correlationId: string;
}
