import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

@Injectable()
export class KafkaMessageConsumerAdapter
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    //TODO: Connect consumer to Kafka and subscribe to topics
  }

  async onModuleDestroy(): Promise<void> {
    // TODO: Disconnect consumer from Kafka
  }
}
