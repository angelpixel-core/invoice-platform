import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "outbox_events" })
export class OutboxOrmEntity {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ name: "event_type" }) eventType!: string;
  @Column({ name: "event_version", type: "int" }) eventVersion!: number;
  @Column({ name: "tenant_id", type: "uuid" }) tenantId!: string;
  @Column({ name: "aggregate_id", type: "uuid" }) aggregateId!: string;
  @Column({ name: "correlation_id", type: "uuid" }) correlationId!: string;
  @Column({ type: "jsonb" }) payload!: unknown;
  @Column({ name: "occurred_at", type: "timestamptz" }) occurredAt!: Date;
  @Column({ name: "published_at", type: "timestamptz", nullable: true })
  publishedAt!: Date | null;
}
