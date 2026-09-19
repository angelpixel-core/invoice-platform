import type { InvoiceIssuedV1 } from "./../../domain/invoices/events/invoice-issued";

export interface Outbox {
  append(event: InvoiceIssuedV1): Promise<void>;
}
