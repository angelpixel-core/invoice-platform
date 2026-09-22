import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { randomUUID } from "node:crypto";

import { IssueInvoiceCommand } from "../../../application/invoices/commands/issue-invoice.command";
import {
  issueInvoiceSchema,
  type IssueInvoiceDto,
} from "./dto/issue-invoice.dto";

import { SearchInvoicesQuery } from "../../../application/invoices/queries/search-invoices.query";
import {
  searchInvoicesSchema,
  type SearchInvoicesDto,
} from "./dto/search-invoices.dto";

@Controller("invoices")
export class InvoicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async issue(
    @Headers("x-tenant-id") tenantId: string,
    @Headers("idempotency-key") idempotencyKey: string,
    @Headers("x-correlation-id") correlationHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<{ id: string }> {
    if (!tenantId || !idempotencyKey)
      throw new BadRequestException("Tenant and Idempotency-Key are required");

    const result = issueInvoiceSchema.safeParse(body);
    if (!result.success)
      throw new BadRequestException({
        message: "Validation failed",
        errors: result.error.issues,
      });

    const input: IssueInvoiceDto = result.data;
    const command = new IssueInvoiceCommand({
      ...input,
      tenantId,
      idempotencyKey,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      correlationId: correlationHeader ?? randomUUID(),
    });

    return await this.commandBus.execute(command);
  }

  @Get()
  async search(
    @Headers("x-tenant-id") tenantId: string,
    @Query() queryParams: unknown,
  ) {
    if (!tenantId) throw new BadRequestException("Tenant is required");

    const result = searchInvoicesSchema.safeParse(queryParams);
    if (!result.success)
      throw new BadRequestException({
        message: "Invalid query parameters",
        errors: result.error.issues,
      });

    const queryInput: SearchInvoicesDto = result.data;

    const query = new SearchInvoicesQuery({
      tenantId,
      search: queryInput.search,
      page: queryInput.page,
      limit: queryInput.limit,
    });

    return await this.queryBus.execute(query);
  }
}
