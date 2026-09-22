import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    server: {
      deps: {
        inline: [
          "@nestjs/core",
          "@nestjs/common",
          "@nestjs/testing",
          "@nestjs/cqrs",
        ],
      },
    },
  },
});
