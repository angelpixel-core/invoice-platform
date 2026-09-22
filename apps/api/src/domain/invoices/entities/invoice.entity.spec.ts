import { describe, expect, it } from "vitest";

import { DomainError } from "../../shared/domain-error";
import { Invoice } from "./invoice.entity";

describe("Invoice", () => {
  it("issues an invoice and calculates subtotal", () => {
    const i = Invoice.issue({
      tenantId: "tenant-1",
      invoiceNumber: "INV-001",
      customerName: "Acme",
      customerEmail: "billing@acme.test",
      currency: "usd",
      issueDate: "2026-09-17",
      dueDate: "2026-10-17",
      lines: [
        { description: "Consulting", quantity: 2, unitPriceMinor: 15000n },
      ],
    });

    expect(i.status).toBe("ISSUED");
    expect(i.subtotalMinor).toBe(30000n);
    expect(i.totalMinor).toBe(30000n);
    expect(i.currency).toBe("USD");
  });

  it("rejects an invoice without lines", () => {
    expect(() =>
      Invoice.issue({
        tenantId: "tenant-1",
        invoiceNumber: "INV-001",
        customerName: "Acme",
        customerEmail: "billing@acme.test",
        currency: "USD",
        issueDate: "2026-09-17",
        dueDate: "2026-10-17",
        lines: [],
      }),
    ).toThrow(DomainError);
  });
});
