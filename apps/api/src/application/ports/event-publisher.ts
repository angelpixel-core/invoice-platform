import type { InvoiceIssuedV1 } from "../../domain/invoices/events/invoice-issued";

export interface EventPublisher {
  publish(event: InvoiceIssuedV1): Promise<void>;
}
