# Invoice Platform — Engineering & Delivery Guide

> **Target Audience:** Engineering Management (EM), Delivery Leadership (DL), and Backend Engineers.  
> **Repository Context:** Multi-Tenant Invoice Integration SaaS Backend (NestJS + TypeScript Hexagonal / DDD Architecture).  
> **Status:** Stage ~7–8 of 19 (Proof-of-Concept / Active Evolution).

---

## 1. Executive Summary

### 1.1 Project Objective
The **Invoice Platform** is a multi-tenant integration backend designed to issue, search, synchronize, and persist financial invoices with third-party accounting providers. It is architected for strict tenant isolation, at-least-once asynchronous event delivery, high-throughput search caching, and resilience against external API failures.

### 1.2 Architectural Philosophy & Standards
In compliance with repository engineering standards defined in [AGENTS.md](file:///Users/angel.szymczak/Vaults/Harvis/300-MEMORIA_DIGITAL/475-Sites/AngelSolutions/Company/apps/sites/web3/invoice-platform/AGENTS.md):
- **Hexagonal Architecture (Ports & Adapters):** Core domain logic has zero dependencies on NestJS, TypeORM, Redis, or AWS SDKs.
- **Strict Multi-Tenancy:** Every write, read, event, and cache key requires an explicit `tenantId`.
- **CQRS Vertical Slices:** Command workflows (`IssueInvoice`) and query workflows (`SearchInvoices`) are isolated.
- **Idempotency & Outbox Pattern:** Writes generate outbox events transactionally to guarantee event delivery without distributed transactions.
- **Pluggable Persistence Drivers:** The architecture supports both production stores (PostgreSQL + TypeORM, Redis, AWS SQS) and fast, test-friendly in-memory adapters without mocking.

---

## 2. Current State vs. Maturity Assessment

### 2.1 Progress in the 19-Commit Roadmap
The repository is progressing along the evolutionary roadmap documented in [TARGET_DIRECTORY.md](file:///Users/angel.szymczak/Vaults/Harvis/300-MEMORIA_DIGITAL/475-Sites/AngelSolutions/Company/apps/sites/web3/invoice-platform/TARGET_DIRECTORY.md) and [commit-plan.md](file:///Users/angel.szymczak/Vaults/Harvis/300-MEMORIA_DIGITAL/475-Sites/AngelSolutions/Company/apps/sites/web3/invoice-platform/commit-plan.md):

| Commit Range | Status | Key Deliverables |
|---|---|---|
| **C1 – C5** | **Implemented** | Monorepo bootstrap, Invoice Aggregate (`Invoice.issue`), Zod HTTP boundary validation, CQRS handlers, HTTP endpoints. |
| **C6 – C7** | **Implemented** | Redis cache-aside search, Versioned domain events (`invoice.issued`), Transactional Outbox port & adapter. |
| **C8** (Current WIP) | **In Progress** | Messaging module abstraction (SQS, Kafka, InMemory), LocalStack integration. |
| **C9 – C12** | **Pending** | Accounting provider simulator, OAuth token lifecycle, worker synchronization, resilience (retries, rate limiting, DLQ). |
| **C13 – C19** | **Pending** | Vue 3 frontend UI, Playwright E2E tests, k6 load testing (1M target), Terraform AWS infra, ADRs & final docs. |

### 2.2 Maturity Grade: *Pre-Alpha / Proof of Concept (PoC)*
The architectural bones are solid (DDD, CQRS, Hexagonal layers), but the project currently has WIP elements that require stabilization before being declared feature-complete or production-grade.

---

## 3. Complete API Specification & Usage Guide

Since a live Swagger UI is not yet configured, this section documents all exposed interfaces, required headers, payloads, and execution examples.

### 3.1 Base Configuration & Global Headers

All API endpoints are hosted at `http://localhost:3000` (configurable via `PORT`).

| Header | Type | Required | Description |
|---|---|---|---|
| `x-tenant-id` | `string` | **Yes** (All endpoints) | Identifies the isolated tenant. Cannot be blank. |
| `idempotency-key` | `string` | **Yes** (POST `/invoices`) | Unique key to ensure exactly-once command processing. |
| `x-correlation-id` | `string` | *Optional* | Distributed tracing ID. Defaults to a server-generated UUID if omitted. |
| `Content-Type` | `string` | **Yes** (`application/json`) | Payload format. |

---

### 3.2 Endpoint Catalog

#### Endpoint 1: Health Check
- **Method:** `GET`
- **Route:** `/health`
- **Description:** Liveness probe for orchestrators (Kubernetes, AWS ECS) and monitoring agents.
- **Headers:** None required.
- **Response `200 OK`:**
```json
{
  "status": "ok",
  "timestamp": "2026-10-12T17:30:00.000Z",
  "uptime": 124.5
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/health
```

---

#### Endpoint 2: Issue Invoice
- **Method:** `POST`
- **Route:** `/invoices`
- **Description:** Validates input contracts, executes domain rules, calculates totals (subtotal and totals in minor units/cents), persists the aggregate, appends an event to the transactional Outbox, and triggers cache invalidation.
- **Required Headers:** `x-tenant-id`, `idempotency-key`
- **Optional Headers:** `x-correlation-id`

##### Request Schema (Zod Validated):
| Field | Type | Rules | Description |
|---|---|---|---|
| `invoiceNumber` | `string` | Min 1 char, trimmed | Unique invoice reference number |
| `customerName` | `string` | Min 1 char, trimmed | Customer or company legal name |
| `customerEmail` | `string` | Valid email format | Customer billing email |
| `currency` | `string` | Exactly 3 uppercase letters | ISO 4217 code (e.g. `USD`, `EUR`) |
| `issueDate` | `string` | Non-empty string (ISO 8601 date) | Date the invoice was generated |
| `dueDate` | `string` | Non-empty string (ISO 8601 date) | Date payment is due |
| `lines` | `array` | Min 1 item | Line items included in the invoice |
| `lines[].description` | `string` | Min 1 char | Item or service description |
| `lines[].quantity` | `integer` | Positive integer `>= 1` | Billed units |
| `lines[].unitPriceMinor` | `string` | Digits regex `/^\d+$/` | Price per unit in smallest currency unit (cents) |

##### Request Body Example:
```json
{
  "invoiceNumber": "INV-2026-0042",
  "customerName": "Acme Global Industries",
  "customerEmail": "billing@acmeglobal.com",
  "currency": "USD",
  "issueDate": "2026-10-12",
  "dueDate": "2026-11-12",
  "lines": [
    {
      "description": "Enterprise Platform Architecture Consulting",
      "quantity": 10,
      "unitPriceMinor": "15000"
    },
    {
      "description": "Cloud Migration Implementation Support",
      "quantity": 1,
      "unitPriceMinor": "50000"
    }
  ]
}
```
*(Note: `15000` = $150.00; `50000` = $500.00; Total calculated: $2,000.00 / 200,000 cents).*

##### Successful Response (`201 Created`):
```json
{
  "id": "e9329fc6-948f-4ee0-8430-b38914b140bb"
}
```

##### Validation Error Response (`400 Bad Request`):
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_string",
      "path": ["customerEmail"],
      "message": "Invalid email address format"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: tenant_company_alpha" \
  -H "idempotency-key: 8c37d4e1-2fb0-4e4b-9721-a47cf20e4088" \
  -H "x-correlation-id: trace-req-1001" \
  -d '{
    "invoiceNumber": "INV-2026-0042",
    "customerName": "Acme Global Industries",
    "customerEmail": "billing@acmeglobal.com",
    "currency": "USD",
    "issueDate": "2026-10-12",
    "dueDate": "2026-11-12",
    "lines": [
      {
        "description": "Enterprise Platform Architecture Consulting",
        "quantity": 10,
        "unitPriceMinor": "15000"
      }
    ]
  }'
```

---

#### Endpoint 3: Search Invoices
- **Method:** `GET`
- **Route:** `/invoices`
- **Description:** Search invoices within a tenant's domain. Implements Cache-Aside via Redis (TTL: 60s) with fallback to repository storage.
- **Required Headers:** `x-tenant-id`

##### Query Parameters:
| Parameter | Type | Default | Constraints | Description |
|---|---|---|---|---|
| `search` | `string` | `""` | Optional | Matches `invoiceNumber`, `customerName`, or `customerEmail` (case-insensitive). |
| `page` | `integer` | `1` | Min 1 | Pagination page number. |
| `limit` | `integer` | `20` | Min 1, Max 100 | Page size. |

##### Successful Response (`200 OK`):
```json
[
  {
    "id": "e9329fc6-948f-4ee0-8430-b38914b140bb",
    "tenantId": "tenant_company_alpha",
    "invoiceNumber": "INV-2026-0042",
    "customerName": "Acme Global Industries",
    "customerEmail": "billing@acmeglobal.com",
    "currency": "USD",
    "issueDate": "2026-10-12",
    "dueDate": "2026-11-12",
    "status": "ISSUED",
    "subtotalMinor": "150000",
    "taxTotalMinor": "0",
    "totalMinor": "150000",
    "lines": [
      {
        "description": "Enterprise Platform Architecture Consulting",
        "quantity": 10,
        "unitPriceMinor": "15000"
      }
    ]
  }
]
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/invoices?search=Acme&page=1&limit=10" \
  -H "x-tenant-id: tenant_company_alpha"
```

---

## 4. Local Execution & Verification Guide

Developers and reviewers can run and test the application in two modes:

### Mode A: Standalone In-Memory (Zero External Dependencies)
Ideal for quick code reviews, CI test runs, and initial demos without installing Docker, PostgreSQL, or Redis.

1. **Set Environment Variables:**
   ```bash
   export PORT=3000
   export PERSISTENCE_DRIVER=in-memory
   export MESSAGING_PROVIDER=in-memory
   ```
2. **Install & Verify:**
   ```bash
   pnpm install
   pnpm test
   ```
3. **Start the API Server:**
   ```bash
   pnpm --filter @invoice/api dev
   ```

### Mode B: Full Infrastructure (PostgreSQL, Redis, LocalStack)
Used for integration testing, load testing, and production simulation.

1. **Spin Up Containers:**
   ```bash
   docker compose -f infrastructure/docker-compose.yml up -d
   ```
2. **Configure `.env` (`apps/api/.env`):**
   ```env
   PORT=3000
   PERSISTENCE_DRIVER=typeorm
   DATABASE_URL=postgres://invoice:invoice@localhost:5432/invoice_platform_dev
   REDIS_URL=redis://localhost:6379
   MESSAGING_PROVIDER=sqs
   AWS_REGION=us-east-1
   AWS_ENDPOINT=http://localhost:4566
   ```
3. **Run Database Migrations:**
   ```bash
   pnpm --filter @invoice/api migration:run
   ```
4. **Start Dev Server:**
   ```bash
   pnpm --filter @invoice/api dev
   ```

---

## 5. Technical Debt & Stabilization Backlog ("Emprolijar")

*For the Engineering Manager:* The following findings were identified during code inspection and must be addressed to bring the codebase to production readiness.

### 5.1 Critical Codebase Issues to Fix Immediately
1. **`IssueInvoiceHandler` Aggregate Invocation:**
   - *Problem:* In [issue-invoice.handler.ts](file:///Users/angel.szymczak/Vaults/Harvis/300-MEMORIA_DIGITAL/475-Sites/AngelSolutions/Company/apps/sites/web3/invoice-platform/apps/api/src/application/invoices/commands/issue-invoice.handler.ts#L25), `this.invoiceRepository.save(...)` is invoked directly with an object literal instead of calling `Invoice.issue(...)`. Since `save()` returns `Promise<void>`, downstream code fails with `TypeError: Cannot read properties of undefined (reading 'tenantId')`.
   - *Fix:* Instantiate domain aggregate via `const invoice = Invoice.issue(props)` and then pass the entity to `this.invoiceRepository.save(invoice)`.
2. **NestJS Module Nesting in `infrastructure.module.ts`:**
   - *Problem:* `MessagingModule.register()` and `PersistenceModule.register()` were placed under `providers` instead of `imports`, triggering TypeScript error `TS2322: Type 'DynamicModule' is not assignable to type 'Provider'`.
   - *Fix:* Move dynamic modules into the `imports` array.
3. **Missing Test Suite in `search-invoices.dto.spec.ts`:**
   - *Problem:* The file is currently 0 bytes, causing Vitest to fail with `Error: No test suite found`.
   - *Fix:* Add unit test coverage for default query parameters and boundary validation.
4. **In-Memory Cache Adapter (`in-memory.cache.adapter.ts`):**
   - *Problem:* File is currently 0 bytes. When running without Redis, queries attempt to connect to Redis and fail.
   - *Fix:* Provide an in-memory `Map<string, { value: unknown; expiresAt: number }>` implementation of `CachePort`.
5. **BigInt JSON Serialization:**
   - *Problem:* Fastify / JSON.stringify throws `TypeError: Do not know how to serialize a BigInt` when returning domain entities containing `bigint` (e.g. `unitPriceMinor`, `totalMinor`).
   - *Fix:* Map domain entities to response DTOs or stringify BigInt values at the HTTP adapter boundary.

### 5.2 Architectural & Tooling Hardening
- **Add Swagger / OpenAPI Documentation:**
  Integrate `@nestjs/swagger` with `@nestjs/platform-fastify`. Annotate DTOs with `@ApiProperty()` or use an OpenAPI generation plugin to expose `/docs` or `/api-docs` automatically.
- **Transactional Outbox Worker:**
  Currently, events are appended to the Outbox table/array. A polling worker or change-data-capture (CDC) relay must be implemented to publish outbox events to SQS/Kafka and mark them as dispatched.
- **Unified Error Handling Filter:**
  Implement a NestJS `ExceptionFilter` to map `DomainError` into consistent HTTP 422/400 responses with standardized RFC 7807 Problem Details.

---

## 6. Delivery Roadmap & Work Breakdown Structure (DL View)

*For the Delivery Lead:* Structured milestones to transition the platform from PoC to production-ready MVP.

```mermaid
gantt
    title Invoice Platform Delivery Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Stabilization
    Fix Type Errors & Test Suite (C8 WIP)  :done, p1_1, 2026-10-13, 2d
    In-Memory Cache & Wire AppModule       :active, p1_2, after p1_1, 2d
    OpenAPI / Swagger Integration          :p1_3, after p1_2, 2d
    section Phase 2: Asynchronous Core
    SQS Messaging Adapter & LocalStack     :p2_1, after p1_3, 3d
    Accounting Provider Simulator          :p2_2, after p2_1, 4d
    OAuth Token Lifecycle & Vault          :p2_3, after p2_2, 3d
    section Phase 3: Resilience & Sync
    Sync Worker & Idempotent Webhooks      :p3_1, after p2_3, 4d
    Retries, Rate Limiting & DLQ           :p3_2, after p3_1, 3d
    section Phase 4: Frontend & Delivery
    Vue 3 Portal UI (Create & Search)      :p4_1, after p3_2, 5d
    Playwright E2E & k6 Load Tests         :p4_2, after p4_1, 4d
    Terraform AWS Infrastructure & CI/CD   :p4_3, after p4_2, 4d
```

### 6.1 Milestone Breakdown

#### Milestone 1: Core Engine Stabilization (Days 1–5)
- **Scope:** Clean compilation across monorepo, 100% passing Vitest suite, functional standalone in-memory mode, Swagger UI at `/docs`.
- **Definition of Done (DoD):** `pnpm lint`, `pnpm test`, and `pnpm build` pass with exit code 0. API starts and serves sample cURLs out of the box.

#### Milestone 2: Asynchronous Integration & External Mocking (Days 6–15)
- **Scope:** LocalStack SQS adapter (`apps/api/src/infrastructure/shared/messaging/sqs`), external accounting simulator (`apps/accounting-provider-simulator`), and OAuth 2.0 token manager with auto-refresh.
- **Definition of Done:** Outbox worker publishes to SQS; simulator validates external request contracts.

#### Milestone 3: Resilience & Fault Tolerance (Days 16–22)
- **Scope:** Idempotent webhook receivers, exponential backoff with jitter, rate limiter for external provider quotas, Dead Letter Queue (DLQ) redrive.
- **Definition of Done:** Integration tests proving duplicate webhook deliveries cause zero side effects and transient 500s are retried.

#### Milestone 4: Presentation & Production Readiness (Days 23–35)
- **Scope:** Vue 3 + Vite client integration, k6 performance scenario (validating cache hit latency < 50ms), Terraform ECS/RDS/SQS definitions, ADR sign-off.
- **Definition of Done:** End-to-end verification passing in CI with automated deploy to staging environment.

---

## 7. Risk Matrix & Mitigations

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| **BigInt data loss or serialization errors** | High | High | Enforce string representation at all external boundaries (`unitPriceMinor: string`) and BigInt internally. |
| **Outbox duplicate processing** | Medium | Medium | SQS consumer must enforce idempotency via PostgreSQL unique constraint or Redis lock key. |
| **External Accounting Provider rate limits** | High | High | Implement token bucket / leaky bucket rate limiter before dispatching HTTP calls. |
| **Tenant data leakage** | Critical | Low | Enforce tenant scoping at repository interface level (`tenantId` mandatory argument in all repository queries). |

---

## 8. Summary Checklist for Engineering Reviews

- [ ] Domain logic free of NestJS / TypeORM annotations.
- [ ] Zod contracts enforced on all incoming HTTP requests.
- [ ] Every repository call requires `tenantId`.
- [ ] In-memory adapters provided alongside all production infrastructure adapters.
- [ ] Fastify CORS, Helmet, and correlation ID tracing enabled.
- [ ] All unit and integration tests passing green.
