# Commit Plan

| # | Commit | Main scope |
|---:|---|---|
| 1 | `chore(workspace): initialize typescript monorepo` | pnpm workspace, Vue, NestJS, TypeScript |
| 2 | `feat(domain): define invoice domain` | Invoice aggregate, value objects, repository port |
| 3 | `feat(validation): add invoice input contracts` | Zod request/query schemas |
| 4 | `feat(persistence): add invoice repository adapters` | TypeORM/PostgreSQL + InMemory |
| 5 | `feat(api): expose invoice commands and queries` | application handlers + HTTP API |
| 6 | `feat(cache): add redis search cache` | cache-aside search |
| 7 | `feat(events): introduce invoice event contracts and outbox` | versioned events + outbox |
| 8 | `feat(messaging): add localstack sqs adapter` | SQS publisher/consumer |
| 9 | `feat(integration): add accounting provider simulator` | local external API |
| 10 | `feat(auth): add oauth token lifecycle` | token acquisition/cache/expiry |
| 11 | `feat(sync): process invoice synchronization` | worker sync + webhooks |
| 12 | `feat(resilience): add retries rate limits and dlq` | retry/backoff/rate limits/DLQ |
| 13 | `feat(web): add minimal invoice UI` | Vue invoice UI |
| 14 | `test(e2e): cover invoice workflows` | E2E workflows |
| 15 | `test(load): add invoice search load scenario` | k6 load testing |
| 16 | `infra(terraform): define aws production architecture` | AWS production architecture |
| 17 | `docs(ai): document agent-assisted engineering workflow` | AI engineering workflow |
| 18 | `docs(architecture): document system decisions` | ADRs + diagrams |
| 19 | `docs(readme): document engineering proof points` | final README + capability mapping |

Commit 3 is cumulative: Commit 2 + validation contracts.
