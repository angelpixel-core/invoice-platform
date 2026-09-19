import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";

import { issueInvoiceSchema } from "./../../../application/contracts/invoices/issue-invoice.schema";
import { searchInvoicesSchema } from "./../../../application/contracts/invoices/search-invoices.schema";
import { IssueInvoiceHandler } from "./../../../application/commands/issue-invoice/issue-invoice.handler";
import { SearchInvoicesHandler } from "./../../../application/queries/search-invoices/search-invoices.handler";

@Controller("invoices")
export class InvoicesController {
  constructor(
    private readonly issueInvoice: IssueInvoiceHandler,
    private readonly searchInvoices: SearchInvoicesHandler,
  ) {}

  @Post() issue(
    @Headers("x-tenant-id") tenantId: string,
    @Headers("idempotency-key") idempotencyKey: string,
    @Body() body: unknown,
  ) {
    const input = issueInvoiceSchema.parse(body);
    return this.issueInvoice.execute({
      ...input,
      tenantId,
      idempotencyKey,
      correlationId: crypto.randomUUID(),
    });
  }

  @Get() search(
    @Headers("x-tenant-id") tenantId: string,
    @Query() query: Record<string, unknown>,
  ) {
    const input = searchInvoicesSchema.parse(query);
    return this.searchInvoices.execute({ ...input, tenantId });
  }
}
