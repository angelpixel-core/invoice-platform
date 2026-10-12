# Invoice Platform (Multi-Tenant Integration SaaS)

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20%2F%20DDD-green.svg)](docs/architecture.md)
[![Status](https://img.shields.io/badge/Status-PoC%20(Stage%208%2F19)-orange.svg)](docs/commit-plan.md)

Multi-tenant invoice integration SaaS platform built with **NestJS**, **TypeScript (Strict)**, and **Vue 3**, focused on resilient APIs, third-party accounting integrations, event-driven workflows, and cloud-native AWS services.

---

## 📚 Executive & Technical Documentation

For Engineering Managers, Delivery Leads, and contributing engineers:

- 📖 **[Engineering & Delivery Guide (API Spec, Roadmap & Tech Debt)](docs/engineering-and-delivery-guide.md)**: Full API endpoint specification, cURL usage examples, hardening backlog, and WBS delivery roadmap.
- 🏛️ **[System Architecture](docs/architecture.md)**: Hexagonal boundary rules, CQRS slicing, and port/adapter contracts.
- 📋 **[19-Commit Evolutionary Plan](docs/commit-plan.md)**: Phased architectural evolution roadmap.
- 📜 **[Engineering Contract (AGENTS.md)](AGENTS.md)**: Rules for strict typing, tenant isolation, and boundary validations.

---

## ⚡ Tech Stack

- **Backend:** NestJS 11 + Fastify + CQRS
- **Domain & Validation:** Domain-Driven Design (DDD), Pure TypeScript, Zod boundary validation
- **Persistence:** PostgreSQL 16 via TypeORM (Production) + In-Memory repository (Isolated Testing)
- **Caching:** Redis 7 via ioredis (Cache-Aside pattern)
- **Messaging:** Transactional Outbox pattern + AWS SQS / LocalStack
- **Frontend:** Vue 3 + TypeScript + Vite
- **Testing:** Vitest

---

## 🚀 Quick Start

### 1. Standalone / In-Memory Mode (No Docker Required)
Run the application with zero external dependencies using in-memory adapters:

```bash
# Clone and install dependencies
pnpm install

# Run automated tests
pnpm test

# Start the API server
pnpm --filter @invoice/api dev
```

### 2. Full Infrastructure Mode (PostgreSQL, Redis, LocalStack)

```bash
# Start background infrastructure
docker compose -f infrastructure/docker-compose.yml up -d

# Run database migrations
pnpm --filter @invoice/api migration:run

# Start API in watch mode
pnpm --filter @invoice/api dev
```

The API will be available at `http://localhost:3000`.

---

## 📡 API Overview (Summary)

| Method | Endpoint | Required Headers | Description |
|---|---|---|---|
| `GET` | `/health` | — | Liveness & uptime check |
| `POST` | `/invoices` | `x-tenant-id`, `idempotency-key` | Issue invoice with domain validation & outbox event |
| `GET` | `/invoices` | `x-tenant-id` | Search invoices with Redis cache-aside |

Detailed payloads, headers, query parameters, and cURLs are documented in [docs/engineering-and-delivery-guide.md](docs/engineering-and-delivery-guide.md).
