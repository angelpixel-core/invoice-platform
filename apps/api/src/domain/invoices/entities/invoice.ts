import { randomUUID } from "node:crypto";
import { DomainError } from "../../shared/domain-error";
import { Money } from "../value-objects/money";
import type { InvoiceStatus } from "../value-objects/invoice-status";

export interface InvoiceLine {
  readonly description: string;
  readonly quantity: number;
  readonly unitPriceMinor: bigint;
}

export interface IssueInvoiceProps {
  readonly id?: string;
  readonly tenantId: string;
  readonly invoiceNumber: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly currency: string;
  readonly issueDate: string;
  readonly dueDate: string;
  readonly lines: readonly InvoiceLine[];
}

export class Invoice {
  private constructor(
    readonly id: string,
    readonly tenantId: string,
    readonly invoiceNumber: string,
    readonly customerName: string,
    readonly customerEmail: string,
    readonly currency: string,
    readonly issueDate: string,
    readonly dueDate: string,
    readonly lines: readonly InvoiceLine[],
    readonly subtotalMinor: bigint,
    readonly taxTotalMinor: bigint,
    readonly totalMinor: bigint,
    private _status: InvoiceStatus,
  ) {}

  get status(): InvoiceStatus {
    return this._status;
  }

  static issue(p: IssueInvoiceProps): Invoice {
    if (!p.tenantId.trim()) throw new DomainError("Tenant id is required");
    if (!p.invoiceNumber.trim())
      throw new DomainError("Invoice number is required");
    if (p.lines.length === 0)
      throw new DomainError("Invoice must contain at least one line");
    for (const line of p.lines) {
      if (!line.description.trim())
        throw new DomainError("Invoice line description is required");
      if (!Number.isInteger(line.quantity) || line.quantity <= 0)
        throw new DomainError(
          "Invoice line quantity must be a positive integer",
        );
      if (line.unitPriceMinor < 0n)
        throw new DomainError("Invoice line price cannot be negative");
    }
    const currency = Money.create(0n, p.currency).currency;
    const subtotal = p.lines.reduce(
      (t, l) => t + BigInt(l.quantity) * l.unitPriceMinor,
      0n,
    );
    return new Invoice(
      p.id ?? randomUUID(),
      p.tenantId,
      p.invoiceNumber,
      p.customerName,
      p.customerEmail,
      currency,
      p.issueDate,
      p.dueDate,
      [...p.lines],
      subtotal,
      0n,
      subtotal,
      "ISSUED",
    );
  }
}
