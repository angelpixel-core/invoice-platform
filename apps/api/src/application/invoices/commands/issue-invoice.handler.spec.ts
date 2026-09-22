import { Test, TestingModule } from "@nestjs/testing";
import { describe, expect, it, beforeEach, vi, type Mock } from "vitest";

import { IssueInvoiceHandler } from "./issue-invoice.handler";
import { IssueInvoiceCommand } from "./issue-invoice.command";

import { INVOICE_REPOSITORY_TOKEN } from "../../../domain/invoices/ports/invoice.repository.token";
import type { InvoiceRepository } from "../../../domain/invoices/ports/invoice.repository.port";

import { OUTBOX_TOKEN } from "../../shared/ports/outbox.token";
import type { Outbox } from "../../shared/ports/outbox.port";

describe("IssueInvoiceHandler", () => {
  let handler: IssueInvoiceHandler;

  let mockInvoiceRepository: { save: Mock; search: Mock };
  let mockOutbox: { append: Mock };

  beforeEach(async () => {
    mockInvoiceRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      search: vi.fn(),
    };

    mockOutbox = {
      append: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueInvoiceHandler,
        {
          provide: INVOICE_REPOSITORY_TOKEN,
          useValue: mockInvoiceRepository,
        },
        {
          provide: OUTBOX_TOKEN,
          useValue: mockOutbox,
        },
      ],
    }).compile();

    handler = module.get<IssueInvoiceHandler>(IssueInvoiceHandler);
  });

  it("should successfully issue an invoice and append it to the outbox", async () => {
    const command = new IssueInvoiceCommand({
      tenantId: "tenant-123",
      idempotencyKey: "idem-key-abc",
      correlationId: "corr-id-xyz",
      invoiceNumber: "INV-2026-001",
      customerName: "Acme Corp",
      customerEmail: "billing@acme.test",
      currency: "USD",
      issueDate: "2026-09-19",
      dueDate: "2026-10-19",
      lines: [
        {
          description: "Software Consulting",
          quantity: 10,
          unitPriceMinor: "15000", // $150.00
        },
      ],
    });

    const result = await handler.execute(command);

    expect(result).toHaveProperty("id");
    expect(mockInvoiceRepository.save).toHaveBeenCalledTimes(1);

    expect(mockOutbox.append).toHaveBeenCalledTimes(1);
    expect(mockOutbox.append).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          eventType: "invoice.issued",
          tenantId: "tenant-123",
          correlationId: "corr-id-xyz",
        }),
        payload: expect.objectContaining({
          invoiceNumber: "INV-2026-001",
          currency: "USD",
        }),
      }),
    );
  });
});
