import { randomUUID } from "node:crypto";

import { DomainError } from "../../shared/domain-error";
import { Money } from "../value-objects/money.vo";
import type { InvoiceStatus } from "../value-objects/invoice-status.vo";

export type InvoiceLine = Readonly<{
  description: string;
  quantity: number;
  unitPriceMinor: bigint;
}>;

export type InvoiceProps = Readonly<{
  id: string;
  tenantId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  lines: ReadonlyArray<InvoiceLine>;
  subtotalMinor: bigint;
  taxTotalMinor: bigint;
  totalMinor: bigint;
  status: InvoiceStatus;
}>;

export type ReconstituteInvoiceProps = InvoiceProps;

export type IssueInvoiceProps = Readonly<
  Omit<
    InvoiceProps,
    "subtotalMinor" | "taxTotalMinor" | "totalMinor" | "status" | "id"
  > & {
    id?: string;
  }
>;

export class Invoice {
  readonly id: string;
  readonly tenantId: string;
  readonly invoiceNumber: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly currency: string;
  readonly issueDate: string;
  readonly dueDate: string;
  readonly lines: ReadonlyArray<InvoiceLine>;
  readonly subtotalMinor: bigint;
  readonly taxTotalMinor: bigint;
  readonly totalMinor: bigint;
  private _status: InvoiceStatus;

  private constructor(props: InvoiceProps) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.invoiceNumber = props.invoiceNumber;
    this.customerName = props.customerName;
    this.customerEmail = props.customerEmail;
    this.currency = props.currency;
    this.issueDate = props.issueDate;
    this.dueDate = props.dueDate;
    this.lines = Object.freeze([...props.lines]);
    this.subtotalMinor = props.subtotalMinor;
    this.taxTotalMinor = props.taxTotalMinor;
    this.totalMinor = props.totalMinor;
    this._status = props.status;
  }

  get status(): InvoiceStatus {
    return this._status;
  }

  static issue(p: IssueInvoiceProps): Invoice {
    Invoice.validateIssueProps(p);

    const currency = Money.create(0n, p.currency).currency;
    const subtotal = p.lines.reduce(
      (t, l) => t + BigInt(l.quantity) * l.unitPriceMinor,
      0n,
    );

    return new Invoice({
      id: p.id ?? randomUUID(),
      tenantId: p.tenantId,
      invoiceNumber: p.invoiceNumber,
      customerName: p.customerName,
      customerEmail: p.customerEmail,
      currency,
      issueDate: p.issueDate,
      dueDate: p.dueDate,
      lines: [...p.lines],
      subtotalMinor: subtotal,
      taxTotalMinor: 0n,
      totalMinor: subtotal,
      status: "ISSUED",
    });
  }

  static reconstitute(p: ReconstituteInvoiceProps): Invoice {
    return new Invoice(p);
  }

  private static validateIssueProps(p: IssueInvoiceProps): void {
    if (!p.tenantId.trim()) throw new DomainError("Tenant id is required");
    if (!p.invoiceNumber.trim())
      throw new DomainError("Invoice number is required");
    if (p.lines.length === 0)
      throw new DomainError("Invoice must contain at least one line");

    for (const line of p.lines) Invoice.validateLine(line);
  }

  private static validateLine(line: InvoiceLine): void {
    if (!line.description.trim())
      throw new DomainError("Invoice line description is required");
    if (!Number.isInteger(line.quantity) || line.quantity <= 0)
      throw new DomainError("Invoice line quantity must be a positive integer");
    if (line.unitPriceMinor < 0n)
      throw new DomainError("Invoice line price cannot be negative");
  }
}
