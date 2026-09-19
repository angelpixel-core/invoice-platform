import { Injectable } from "@nestjs/common";

import type { InvoiceIssuedV1 } from "./../../../domain/invoices/events/invoice-issued";
import type { Outbox } from "./../../../application/ports/outbox";

@Injectable()
export class InMemoryOutbox implements Outbox {
  readonly events: InvoiceIssuedV1[] = [];
  async append(e: InvoiceIssuedV1) {
    this.events.push(e);
  }
}
