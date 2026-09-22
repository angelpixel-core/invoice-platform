export interface OutboxMetadata {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  tenantId: string;
  aggregateId: string;
  correlationId: string;
  causationId?: string;
}

export interface OutboxMessage<TPayload = Record<string, unknown>> {
  metadata: OutboxMetadata;
  payload: TPayload;
}

export interface Outbox {
  /**
   * Store a event message in the table and data origin of Outbox
   * inside the itself database transaction (or Unit of Work).
   *
   * @param message The structured event with metadata and payload.
   */
  append<TPayload = Record<string, unknown>>(
    message: OutboxMessage<TPayload>,
  ): Promise<void>;
}
