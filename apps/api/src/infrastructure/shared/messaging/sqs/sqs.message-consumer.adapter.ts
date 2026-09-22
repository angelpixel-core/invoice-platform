import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

// import {
//   DeleteMessageCommand,
//   ReceiveMessageCommand,
//   SQSClient,
// } from "@aws-sdk/client-sqs";
// import type { MessageConsumer } from "../../../../application/ports/message-bus.port";

@Injectable()
export class SqsMessageConsumerAdapter
  implements OnModuleInit, OnModuleDestroy
{
  // private readonly client: SQSClient;
  private isListening = false;

  async onModuleInit(): Promise<void> {
    this.isListening = true;
    // Start the SQS polling loop (ReceiveMessageCommand)
  }

  async onModuleDestroy(): Promise<void> {
    this.isListening = false;
  }

  // constructor(private readonly queueUrl: string) {
  //   this.client = new SQSClient({
  //     region: process.env.AWS_REGION ?? "us-east-1",
  //     ...(process.env.AWS_SQS_ENDPOINT
  //       ? { endpoint: process.env.AWS_SQS_ENDPOINT }
  //       : {}),
  //     credentials: {
  //       accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
  //       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
  //     },
  //   });
  // }
  //
  // async consume(
  //   _topic: string,
  //   handler: (message: {
  //     body: string;
  //     receiptHandle: string;
  //   }) => Promise<void>,
  // ): Promise<void> {
  //   const response = await this.client.send(
  //     new ReceiveMessageCommand({
  //       QueueUrl: this.queueUrl,
  //       MaxNumberOfMessages: 10,
  //       WaitTimeSeconds: 5,
  //       VisibilityTimeout: 30,
  //     }),
  //   );
  //
  //   for (const message of response.Messages ?? []) {
  //     if (!message.Body || !message.ReceiptHandle) continue;
  //
  //     await handler({
  //       body: message.Body,
  //       receiptHandle: message.ReceiptHandle,
  //     });
  //
  //     await this.client.send(
  //       new DeleteMessageCommand({
  //         QueueUrl: this.queueUrl,
  //         ReceiptHandle: message.ReceiptHandle,
  //       }),
  //     );
  //   }
  // }
}
