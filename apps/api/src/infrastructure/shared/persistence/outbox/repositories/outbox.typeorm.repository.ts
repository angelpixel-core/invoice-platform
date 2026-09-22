import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type {
  Outbox,
  OutboxMessage,
} from "../../../../../application/shared/ports/outbox.port";
import { OutboxOrmEntity } from "../entities/outbox.orm-entity";

@Injectable()
export class OutboxTypeOrmRepository implements Outbox {
  constructor(
    @InjectRepository(OutboxOrmEntity)
    private readonly repository: Repository<OutboxOrmEntity>,
  ) {}

  async append<TPayload = Record<string, unknown>>(
    message: OutboxMessage<TPayload>,
  ): Promise<void> {
    const entity = this.repository.create({
      id: message.metadata.eventId,
      eventType: message.metadata.eventType,
      eventVersion: message.metadata.eventVersion,
      tenantId: message.metadata.tenantId,
      aggregateId: message.metadata.aggregateId,
      correlationId: message.metadata.correlationId,
      payload: message.payload,
      occurredAt: new Date(message.metadata.occurredAt),
      publishedAt: null,
    });

    await this.repository.save(entity);
  }
}
