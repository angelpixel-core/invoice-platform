import "reflect-metadata";
import { DataSource } from "typeorm";
import { InvoiceOrmEntity } from "./entities/invoice.orm-entity";
import { CreateInvoices0001 } from "./migrations/0001-create-invoices";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL as string,
  entities: [InvoiceOrmEntity],
  migrations: [CreateInvoices0001],
  synchronize: false,
});
