import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvoices0001 implements MigrationInterface {
  name = "CreateInvoices0001";

  async up(q: QueryRunner) {
    await q.query(
      `CREATE TABLE invoices (
        id uuid PRIMARY KEY,
        tenant_id uuid NOT NULL,
        invoice_number varchar(255) NOT NULL,
        customer_name varchar(255) NOT NULL,
        customer_email varchar(255) NOT NULL,
        currency varchar(3) NOT NULL,
        issue_date date NOT NULL,
        due_date date NOT NULL,
        status varchar(32) NOT NULL,
        lines jsonb NOT NULL,
        subtotal_minor bigint NOT NULL,
        tax_total_minor bigint NOT NULL,
        total_minor bigint NOT NULL
      )`,
    );
    await q.query(
      `CREATE INDEX idx_invoices_tenant_issue_date ON invoices (
        tenant_id,
        issue_date DESC
      )`,
    );
  }

  async down(q: QueryRunner) {
    await q.query("DROP TABLE invoices");
  }
}
