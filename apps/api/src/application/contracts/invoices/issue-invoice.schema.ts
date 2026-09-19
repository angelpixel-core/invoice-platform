import * as z from "zod";

const invoiceLineSchema = z.object({
  description: z.string().trim().min(1),
  quantity: z.number().int().positive(),
  unitPriceMinor: z.string().regex(/^\d+$/),
});

export const issueInvoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1),
  customerName: z.string().trim().min(1),
  customerEmail: z.email(),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/),
  issueDate: z.iso.date(),
  dueDate: z.iso.date(),
  lines: z.array(invoiceLineSchema).min(1),
});

export type IssueInvoiceInput = z.infer<typeof issueInvoiceSchema>;
