import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Invoice } from "../../../../../domain/invoices/entities/invoice.entity";
import type { InvoiceRepository } from "../../../../../domain/invoices/ports/invoice.repository.port";
import { InvoiceOrmEntity } from "../entities/invoice.orm-entity";

@Injectable()
export class InvoiceTypeOrmRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceOrmEntity)
    private readonly repository: Repository<InvoiceOrmEntity>,
  ) {}

  async save(invoice: Invoice): Promise<void> {
    const ormEntity = this.toOrmEntity(invoice);
    await this.repository.save(ormEntity);
  }

  async findById(tenantId: string, id: string): Promise<Invoice | null> {
    const entity = await this.repository.findOne({
      where: { id, tenantId },
    });

    if (!entity) return null;

    return this.toDomain(entity);
  }

  async search(
    tenantId: string,
    query: string,
    page: number,
    limit: number,
  ): Promise<readonly Invoice[]> {
    const normalizedQuery = query.trim().toLowerCase();

    const qb = this.repository
      .createQueryBuilder("invoice")
      .where("invoice.tenantId = :tenantId", { tenantId });

    if (normalizedQuery.length > 0) {
      qb.andWhere(
        "(LOWER(invoice.invoiceNumber) LIKE :query OR LOWER(invoice.customerName) LIKE :query OR LOWER(invoice.customerEmail) LIKE :query)",
        { query: `%${normalizedQuery}%` },
      );
    }

    const entities = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return entities.map((entity) => this.toDomain(entity));
  }

  private toOrmEntity(invoice: Invoice): InvoiceOrmEntity {
    return this.repository.create({
      id: invoice.id,
      tenantId: invoice.tenantId,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      lines: invoice.lines.map((line) => ({
        ...line,
        unitPriceMinor: line.unitPriceMinor.toString(),
      })),
      subtotalMinor: invoice.subtotalMinor.toString(),
      taxTotalMinor: invoice.taxTotalMinor.toString(),
      totalMinor: invoice.totalMinor.toString(),
    });
  }

  private toDomain(entity: InvoiceOrmEntity): Invoice {
    return Invoice.reconstitute({
      id: entity.id,
      tenantId: entity.tenantId,
      invoiceNumber: entity.invoiceNumber,
      customerName: entity.customerName,
      customerEmail: entity.customerEmail,
      currency: entity.currency,
      issueDate: entity.issueDate,
      dueDate: entity.dueDate,
      status: entity.status as any,
      subtotalMinor: BigInt(entity.subtotalMinor),
      taxTotalMinor: BigInt(entity.taxTotalMinor),
      totalMinor: BigInt(entity.totalMinor),
      lines: (
        entity.lines as Array<{
          description: string;
          quantity: number;
          unitPriceMinor: string;
        }>
      ).map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unitPriceMinor: BigInt(l.unitPriceMinor),
      })),
    });
  }
}
