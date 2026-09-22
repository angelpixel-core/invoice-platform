import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { CACHE_TOKEN } from "../../shared/ports/cache.token";
import type { Cache } from "../../shared/ports/cache.port";
import { InvoiceIssuedEvent } from "../../../domain/invoices/events/invoice-issued.event";

@EventsHandler(InvoiceIssuedEvent)
export class InvalidateInvoicesCacheHandler
  implements IEventHandler<InvoiceIssuedEvent>
{
  constructor(
    @Inject(CACHE_TOKEN)
    private readonly cache: Cache,
  ) {}

  async handle(event: InvoiceIssuedEvent): Promise<void> {
    const pattern = `invoices:search:${event.tenantId}:*`;

    // TODO: check about it kind of conditional
    if (this.cache.delByPattern) await this.cache.delByPattern(pattern);
  }
}
