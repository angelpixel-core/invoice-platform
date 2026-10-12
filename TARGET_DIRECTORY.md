# TARGET_DIRECTORY.md

Target repository structure for the 19-commit plan. `[C#]` means introduced or materially changed in that commit; ranges mean it evolves later.

```text
invoice-integration-platform/
├── AGENTS.md                                  # C1→C19
├── README.md                                  # C1→C19
├── Makefile                                   # C1→C19
├── package.json                               # C1→C19
├── pnpm-workspace.yaml                        # C1
├── tsconfig.base.json                         # C1→C19
├── .gitignore                                 # C1
├── apps/
│   ├── api/
│   │   ├── package.json                       # C1→C19
│   │   ├── tsconfig.json                      # C1
│   │   └── src/
│   │       ├── main.ts                        # C1→C19
│   │       ├── app.module.ts                  # C1→C19
│   │       ├── health.controller.ts           # C1→C19
│   │       ├── domain/                        # C2→C19
│   │       ├── application/                   # C3→C19
│   │       ├── infrastructure/                # C4→C19
│   │       └── interfaces/http/               # C5→C19
│   ├── web/                                   # C1→C19 (Vue)
│   └── accounting-provider-simulator/         # C9→C12
├── packages/
│   ├── event-contracts/                        # C7→C19
│   ├── config/                                # C4→C19
│   └── testkit/                               # C14→C19
├── infrastructure/
│   ├── docker-compose.yml                     # C4→C12
│   └── terraform/                             # C16→C19
├── docs/
│   ├── commit-plan.md                         # C1→C19
│   ├── architecture.md                        # C1→C19
│   ├── diagrams/                              # C18
│   ├── adr/                                   # C18
│   └── ai-engineering/                        # C17→C19
└── tests/
    ├── integration/                           # C4→C14
    ├── e2e/                                   # C14→C19
    └── load/invoice-search.js                 # C15→C19
```

## Repository dependency rule

`InvoiceRepository` is a domain/application port. Because a TypeScript interface does not exist at runtime, Nest uses a `Symbol` token. The provider selects an implementation: InMemory for local/test scenarios and TypeORM/PostgreSQL for production. The application never constructs the adapter.

Expected dependency direction:

`IssueInvoiceHandler → INVOICE_REPOSITORY → TypeOrmInvoiceRepository → TypeORM → PostgreSQL`

or in tests/local isolation:

`IssueInvoiceHandler → INVOICE_REPOSITORY → InMemoryInvoiceRepository`

Commit 7 introduces the same pattern for `Outbox`: application code depends on the port; infrastructure supplies the implementation.

## 19 commits

1. workspace bootstrap
2. invoice domain
3. Zod validation
4. persistence adapters
5. commands/queries + HTTP API
6. Redis cache-aside
7. event contracts + transactional outbox
8. LocalStack/SQS
9. accounting provider simulator
10. OAuth token lifecycle
11. synchronization + webhooks
12. retries/rate limits/backpressure/DLQ
13. Vue UI
14. E2E tests
15. k6 load testing
16. Terraform/AWS
17. AI engineering workflow
18. ADRs + architecture diagrams
19. final README/proof-point mapping
