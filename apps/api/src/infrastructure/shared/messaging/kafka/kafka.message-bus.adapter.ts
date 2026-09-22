import { Injectable } from "@nestjs/common";

import type {
  MessageBus,
  MessageBusPublishParams,
} from "../../../../application/shared/ports/message-bus.port";

@Injectable()
export class KafkaMessageBusAdapter implements MessageBus {
  async publish<TPayload = Record<string, unknown>>(
    params: MessageBusPublishParams<TPayload>,
  ): Promise<void> {
    // Implemented using Kafkajs / Kafka Producer
    const message = {
      key: params.metadata.aggregateId,
      value: JSON.stringify({
        metadata: params.metadata,
        payload: params.payload,
      }),
    };

    // TODO: producer.send({ topic: params.metadata.eventType, messages: [message] })
    await Promise.resolve(message);
  }
}
