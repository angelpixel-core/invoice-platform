import * as z from "zod";

export const invoiceLineSchema = z.object({
  description: z.string().trim().min(1),
  quantity: z.number().int().positive(),
  unitPriceMinor: z.string().regex(/^\d+$/),
});

export const issueInvoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1),
  customerName: z.string().trim().min(1),
  customerEmail: z.string().email({ message: "Invalid email address format" }),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/),
  issueDate: z.string(),
  dueDate: z.string(),
  lines: z.array(invoiceLineSchema).min(1),
});

export type IssueInvoiceDto = z.infer<typeof issueInvoiceSchema>;
