import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOutbox0001 implements MigrationInterface {
  name = "CreateOutbox0001";

  async up(q: QueryRunner) {
    await q.query(
      `CREATE TABLE outbox_events (
        id uuid PRIMARY KEY,
        event_type varchar(255) NOT NULL,
        event_version integer NOT NULL,
        tenant_id uuid NOT NULL,
        aggregate_id uuid NOT NULL,
        correlation_id uuid NOT NULL,
        payload jsonb NOT NULL,
        occurred_at timestamptz NOT NULL,
        published_at timestamptz NULL
      )`,
    );
    await q.query(
      `CREATE INDEX idx_outbox_unpublished ON outbox_events (occurred_at) WHERE published_at IS NULL`,
    );
  }

  async down(q: QueryRunner) {
    await q.query("DROP TABLE outbox_events");
  }
}
