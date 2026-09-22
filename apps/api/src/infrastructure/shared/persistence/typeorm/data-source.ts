import "reflect-metadata";
import { DataSource } from "typeorm";

import { InvoiceOrmEntity } from "../../../invoices/persistence/typeorm/entities/invoice.orm-entity";

import { CreateOutbox0001 } from "../outbox/migrations/0001-create-outbox";
import { CreateInvoices0002 } from "../../../invoices/persistence/typeorm/migrations/0002-create-invoices";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL as string,
  entities: [InvoiceOrmEntity],
  migrations: [CreateOutbox0001, CreateInvoices0002],
  synchronize: false,
});
