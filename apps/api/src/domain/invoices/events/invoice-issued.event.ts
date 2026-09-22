export const invoiceIssuedV1SchemaVersion = 1 as const;
export const INVOICE_ISSUED = "invoice.issued" as const;

export interface EventMetadata {
  eventId: string;
  eventType: string;
  eventVersion: typeof invoiceIssuedV1SchemaVersion;
  occurredAt: string;
  tenantId: string;
  aggregateId: string;
  correlationId: string;
  causationId?: string;
}

export interface InvoiceIssuedV1 {
  metadata: EventMetadata & {
    eventType: typeof INVOICE_ISSUED;
  };
  payload: {
    invoiceId: string;
    invoiceNumber: string;
    totalMinor: string;
    currency: string;
  };
}

export class InvoiceIssuedEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly tenantId: string,
    public readonly invoiceNumber: string,
    public readonly totalMinor: string,
    public readonly currency: string,
    public readonly correlationId: string,
  ) {}
}
