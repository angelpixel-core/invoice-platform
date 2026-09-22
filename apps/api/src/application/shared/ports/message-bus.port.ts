import type { OutboxMetadata } from "./outbox.port";

export interface MessageBusPublishParams<TPayload = Record<string, unknown>> {
  metadata: OutboxMetadata;
  payload: TPayload;
}

export interface MessageBus {
  /**
   * Publish a event or message in the configured Message Broker (SQS, Kafka, In-Memory).
   *
   * @template TPayload DataType of Event Payload.
   * @param params MEssage structure including metadata and payload.
   */
  publish<TPayload = Record<string, unknown>>(
    params: MessageBusPublishParams<TPayload>,
  ): Promise<void>;
}

export interface MessageConsumer {
  consume(
    topic: string,
    handler: (message: {
      body: string;
      receiptHandle: string;
    }) => Promise<void>,
  ): Promise<void>;
}
