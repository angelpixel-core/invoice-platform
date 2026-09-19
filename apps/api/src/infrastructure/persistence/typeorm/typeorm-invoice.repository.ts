import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { Invoice } from "./../../../domain/invoices/entities/invoice";
import type { InvoiceRepository } from "./../../../domain/invoices/repositories/invoice.repository";
import { InvoiceOrmEntity } from "./entities/invoice.orm-entity";

@Injectable()
export class TypeOrmInvoiceRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceOrmEntity)
    private readonly repository: Repository<InvoiceOrmEntity>,
  ) {}

  async save(invoice: Invoice): Promise<void> {
    await this.repository.save(
      this.repository.create({
        id: invoice.id,
        tenantId: invoice.tenantId,
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        currency: invoice.currency,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        lines: invoice.lines.map((x) => ({
          ...x,
          unitPriceMinor: x.unitPriceMinor.toString(),
        })),
        subtotalMinor: invoice.subtotalMinor.toString(),
        taxTotalMinor: invoice.taxTotalMinor.toString(),
        totalMinor: invoice.totalMinor.toString(),
      }),
    );
  }

  async findById(): Promise<Invoice | null> {
    throw new Error("Hydration follows in a later persistence refinement.");
  }

  async search(): Promise<readonly Invoice[]> {
    throw new Error("Search follows in a later persistence refinement.");
  }
}
