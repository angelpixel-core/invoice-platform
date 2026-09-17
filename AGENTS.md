---
id: AGENTS
aliases: []
tags: []
---

# Agent Engineering Contract

## Architecture

The frontend is Vue 3 + TypeScript.
The backend is NestJS + TypeScript.
They are separate applications communicating through HTTP.

- Keep domain code independent from NestJS, TypeORM, Redis and AWS SDKs.
- application logic depending on ports
- infrastructure implementing those ports
- HTTP controllers as adapters
- Keep commands and queries as vertical slices.
- External provider payloads are untrusted input and must be validated at boundaries.
- All tenant-scoped reads and writes require an explicit tenant identifier.

## TypeScript

- `strict` mode is mandatory.
- Prefer explicit domain types over `any`.
- Avoid leaking infrastructure types into domain/application layers.
- Keep frontend and backend concerns separated.

## Persistence

- PostgreSQL is the production relational store.
- In-memory adapters are valid test implementations of ports, not generic mocks.
- Never enable TypeORM `synchronize` in production.

## Messaging

- Event payloads are versioned contracts.
- Consumers must be idempotent.
- Standard SQS semantics are treated as at-least-once delivery.

## AI-generated code

AI output must pass:

1. type checking
2. linting
3. relevant tests
4. architecture boundary review
5. security review for external input and secrets
6. human review before merge
