export const INVOICE_STATUSES = ["ISSUED", "PAID", "VOID", "OVERDUE"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
