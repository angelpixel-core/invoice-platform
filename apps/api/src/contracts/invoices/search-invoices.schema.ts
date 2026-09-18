import * as z from "zod";

export const searchInvoicesSchema = z.object({
  search: z.string().trim().default(""),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type SearchInvoicesInput = z.infer<typeof searchInvoicesSchema>;
