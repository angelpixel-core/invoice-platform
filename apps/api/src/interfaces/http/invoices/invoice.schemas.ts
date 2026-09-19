import { z } from "zod";

export const issueInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.email(),
  currency: z.string().length(3).toUpperCase(),
  issueDate: z.iso.date(),
  dueDate: z.iso.date(),
  lines: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPriceMinor: z.string().regex(/^\d+$/),
      }),
    )
    .min(1),
});

export const searchInvoicesSchema = z.object({
  search: z.string().default(""),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
