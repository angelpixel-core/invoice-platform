import { DomainError } from "./../../shared/domain-error";

export class Money {
  private constructor(
    readonly amountMinor: bigint,
    readonly currency: string,
  ) {}
  static create(amountMinor: bigint, currency: string): Money {
    const code = currency.trim().toUpperCase();
    if (amountMinor < 0n)
      throw new DomainError("Money amount cannot be negative");
    if (!/^[A-Z]{3}$/.test(code))
      throw new DomainError("Currency must be a 3-letter ISO code");
    return new Money(amountMinor, code);
  }
}
