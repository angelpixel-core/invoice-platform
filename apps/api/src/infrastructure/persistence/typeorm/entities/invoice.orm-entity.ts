import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "invoices" })
export class InvoiceOrmEntity {
  @PrimaryColumn("uuid") id!: string;
  @Column({ name: "tenant_id", type: "uuid" }) tenantId!: string;
  @Column({ name: "invoice_number" }) invoiceNumber!: string;
  @Column({ name: "customer_name" }) customerName!: string;
  @Column({ name: "customer_email" }) customerEmail!: string;
  @Column({ length: 3 }) currency!: string;
  @Column({ name: "issue_date", type: "date" }) issueDate!: string;
  @Column({ name: "due_date", type: "date" }) dueDate!: string;
  @Column() status!: string;
  @Column({ type: "jsonb" }) lines!: unknown;
  @Column({ name: "subtotal_minor", type: "bigint" }) subtotalMinor!: string;
  @Column({ name: "tax_total_minor", type: "bigint" }) taxTotalMinor!: string;
  @Column({ name: "total_minor", type: "bigint" }) totalMinor!: string;
}
