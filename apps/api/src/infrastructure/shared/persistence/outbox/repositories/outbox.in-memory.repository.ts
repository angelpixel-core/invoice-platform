import { Injectable } from "@nestjs/common";

import type {
  Outbox,
  OutboxMessage,
} from "../../../../../application/shared/ports/outbox.port";

@Injectable()
export class OutboxInMemoryRepository implements Outbox {
  readonly events: OutboxMessage[] = [];

  async append<TPayload = Record<string, unknown>>(
    message: OutboxMessage<TPayload>,
  ): Promise<void> {
    this.events.push(message as OutboxMessage);
  }
}
