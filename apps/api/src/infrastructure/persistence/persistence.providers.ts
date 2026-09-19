import { INVOICE_REPOSITORY } from "../../domain/invoices/repositories/invoice.repository.token";
import { InMemoryInvoiceRepository } from "./in-memory/in-memory-invoice.repository";
import { TypeOrmInvoiceRepository } from "./typeorm/typeorm-invoice.repository";

export const invoiceRepositoryProvider = {
  provide: INVOICE_REPOSITORY,
  useClass:
    process.env.NODE_ENV === "production"
      ? TypeOrmInvoiceRepository
      : InMemoryInvoiceRepository,
};
