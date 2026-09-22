import { Injectable } from "@nestjs/common";

// import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

import type {
  MessageBus,
  MessageBusPublishParams,
} from "../../../../application/shared/ports/message-bus.port";

@Injectable()
export class SqsMessageBusAdapter implements MessageBus {
  // private readonly client: SQSClient;

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

  async publish<TPayload = Record<string, unknown>>(
    params: MessageBusPublishParams<TPayload>,
  ): Promise<void> {
    /**
     * INFO:
     *   here use SQSClient and SendMessageCommand from @aws-sdk/client-sqs
     *   compatible with AWS SQS or LocalStack.
     */
    const body = JSON.stringify({
      metadata: params.metadata,
      payload: params.payload,
    });

    /**
     * TODO:
     *  inject/call SQSClient
     *  await this.sqsClient.send(new SendMessageCommand({ QueueUrl: ..., MessageBody: body }));
     */
    await Promise.resolve(body);
  }

  // async publish(_topic: string, message: unknown): Promise<void> {
  //   await this.client.send(
  //     new SendMessageCommand({
  //       QueueUrl: this.queueUrl,
  //       MessageBody: JSON.stringify(message),
  //     }),
  //   );
  // }
}
