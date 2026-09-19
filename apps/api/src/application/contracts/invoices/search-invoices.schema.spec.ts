import { describe, expect, it } from "vitest";
import { searchInvoicesSchema } from "./search-invoices.schema";

describe("searchInvoicesSchema", () => {
  it("applies defaults", () =>
    expect(searchInvoicesSchema.parse({})).toEqual({
      search: "",
      page: 1,
      limit: 20,
    }));

  it("rejects limit above maximum", () =>
    expect(searchInvoicesSchema.safeParse({ limit: 101 }).success).toBe(false));
});
