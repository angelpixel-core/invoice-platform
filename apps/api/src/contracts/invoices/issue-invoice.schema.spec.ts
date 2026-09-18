import { describe, expect, it } from "vitest";
import { issueInvoiceSchema } from "./issue-invoice.schema";

describe("issueInvoiceSchema", () => {
  it("accepts valid input", () => {
    const r = issueInvoiceSchema.safeParse({
      invoiceNumber: "INV-001",
      customerName: "Acme",
      customerEmail: "billing@acme.test",
      currency: "usd",
      issueDate: "2026-09-17",
      dueDate: "2026-10-17",
      lines: [
        { description: "Consulting", quantity: 2, unitPriceMinor: "15000" },
      ],
    });

    expect(r.success).toBe(true);

    if (r.success) expect(r.data.currency).toBe("USD");
  });

  it("rejects malformed input", () => {
    const r = issueInvoiceSchema.safeParse({
      invoiceNumber: "INV-001",
      customerName: "Acme",
      customerEmail: "bad",
      currency: "USD",
      issueDate: "2026-09-17",
      dueDate: "2026-10-17",
      lines: [],
    });

    expect(r.success).toBe(false);
  });
});
