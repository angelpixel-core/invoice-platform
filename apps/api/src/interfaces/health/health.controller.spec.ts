import { Test, TestingModule } from "@nestjs/testing";
import { describe, expect, it, beforeEach } from "vitest";

import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return healthy status indicators", () => {
    const result = controller.getHealth();

    expect(result.status).toBe("ok");
    expect(result.uptime).toBeGreaterThan(0);
    expect(typeof result.timestamp).toBe("string");

    // Verifies it is a valid ISO date string format
    expect(Date.parse(result.timestamp)).not.toBeNaN();
  });
});
