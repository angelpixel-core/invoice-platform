import { DynamicModule, Module } from "@nestjs/common";

import { MESSAGE_BUS_TOKEN } from "../../../application/shared/ports/message-bus.token";

import { InMemoryMessageBusAdapter } from "./in-memory/in-memory.message-bus.adapter";
import { KafkaMessageBusAdapter } from "./kafka/kafka.message-bus.adapter";
import { SqsMessageBusAdapter } from "./sqs/sqs.message-bus.adapter";

// import { SqsMessageConsumer } from "./sqs/sqs.message-consumer.adapter";
//
// const queueUrl =
//   process.env.SQS_QUEUE_URL ??
//   "http://localhost:4566/000000000000/invoice-events";

// export const messagingProviders = [
//   { provide: MESSAGE_BUS_TOKEN, useFactory: () => new SqsMessageBus(queueUrl) },
//   {
//     // provide: MESSAGE_CONSUMER,
//     useFactory: () => new SqsMessageConsumer(queueUrl),
//   },
// ];

@Module({})
export class MessagingModule {
  static register(): DynamicModule {
    const provider = process.env["MESSAGING_PROVIDER"] ?? "in-memory";

    const busProviderClass =
      provider === "sqs"
        ? SqsMessageBusAdapter
        : provider === "kafka"
          ? KafkaMessageBusAdapter
          : InMemoryMessageBusAdapter;

    return {
      module: MessagingModule,
      providers: [
        SqsMessageBusAdapter,
        KafkaMessageBusAdapter,
        InMemoryMessageBusAdapter,
        {
          provide: MESSAGE_BUS_TOKEN,
          useClass: busProviderClass,
        },
      ],
      exports: [MESSAGE_BUS_TOKEN],
    };
  }
}
