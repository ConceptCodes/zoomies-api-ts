import { describe, expect, test } from "bun:test";
import express from "express";
import request from "supertest";

import HealthRoute from "../src/routes/health";

const buildTestApp = () => {
  const app = express();
  const healthRoute = new HealthRoute();
  app.use("/api", healthRoute.router);
  return app;
};

describe("HealthRoute", () => {
  const app = buildTestApp();

  test("GET /api/health/alive returns PONG", async () => {
    const response = await request(app).get("/api/health/alive");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "PONG" });
  });
});
