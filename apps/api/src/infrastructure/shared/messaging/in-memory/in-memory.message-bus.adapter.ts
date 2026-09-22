import { Injectable } from "@nestjs/common";

import type {
  MessageBus,
  MessageBusPublishParams,
} from "../../../../application/shared/ports/message-bus.port";

@Injectable()
export class InMemoryMessageBusAdapter implements MessageBus {
  readonly publishedMessages: MessageBusPublishParams[] = [];

  async publish<TPayload = Record<string, unknown>>(
    params: MessageBusPublishParams<TPayload>,
  ): Promise<void> {
    this.publishedMessages.push(params as MessageBusPublishParams);
  }
}
