import {
  Body,
  Controller,
  Headers,
  Post,
  Query,
  Get,
  BadRequestException,
} from "@nestjs/common";
import { issueInvoiceSchema, searchInvoicesSchema } from "./invoice.schemas";

@Controller("invoices")
export class InvoicesController {
  @Post()
  async issue(
    @Headers("x-tenant-id") tenantId: string,
    @Headers("idempotency-key") idempotencyKey: string,
    @Body() body: unknown,
  ) {
    if (!tenantId || !idempotencyKey)
      throw new BadRequestException("Tenant and Idempotency-Key are required");

    return {
      status: "contract-placeholder",
      tenantId,
      idempotencyKey,
      input: issueInvoiceSchema.parse(body),
    };
  }

  @Get()
  async search(
    @Headers("x-tenant-id") tenantId: string,
    @Query() query: Record<string, string>,
  ) {
    return {
      status: "contract-placeholder",
      tenantId,
      query: searchInvoicesSchema.parse(query),
    };
  }
}
