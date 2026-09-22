import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OUTBOX_TOKEN } from "../../../../application/shared/ports/outbox.token";
import { OutboxOrmEntity } from "./entities/outbox.orm-entity";

import { OutboxTypeOrmRepository } from "./repositories/outbox.typeorm.repository";
import { OutboxInMemoryRepository } from "./repositories/outbox.in-memory.repository";

@Module({
  imports: [TypeOrmModule.forFeature([OutboxOrmEntity])],
  providers: [
    OutboxTypeOrmRepository,
    OutboxInMemoryRepository,
    {
      provide: OUTBOX_TOKEN,
      useFactory: (
        typeOrmRepository: OutboxTypeOrmRepository,
        inMemoryRepository: OutboxInMemoryRepository,
      ) => {
        const isTestEnv = process.env["NODE_ENV"] === "test";
        return isTestEnv ? inMemoryRepository : typeOrmRepository;
      },
      inject: [OutboxTypeOrmRepository, OutboxInMemoryRepository],
    },
  ],
  exports: [OUTBOX_TOKEN, TypeOrmModule],
})
export class OutboxPersistenceModule {}
