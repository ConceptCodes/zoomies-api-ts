import "./setup-env";

import { describe, expect, mock, test } from "bun:test";
import type { Request, Response } from "express";

import HealthController from "../src/controllers/health";

const createResponse = () => {
  const wrapper: {
    statusCode: number;
    body: unknown;
    status: Response["status"];
    json: Response["json"];
  } = {
    statusCode: 0,
    body: undefined,
    status(code: number) {
      wrapper.statusCode = code;
      return wrapper as unknown as Response;
    },
    json(payload: unknown) {
      wrapper.body = payload;
      return wrapper as unknown as Response;
    },
  };

  return wrapper as unknown as Response & {
    statusCode: number;
    body: unknown;
  };
};

describe("HealthController", () => {
  test("getLiveness returns PONG", async () => {
    const controller = new HealthController();
    const req = {} as Request;
    const res = createResponse();
    const next = mock((err?: unknown) => err as void);

    await controller.getLiveness(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "PONG" });
    expect(next.mock.calls.length).toBe(0);
  });
});
