import "./setup-env";

import { describe, expect, mock, test } from "bun:test";
import type { NextFunction, Request, Response } from "express";

import VetController from "../src/controllers/vet";
import { InvalidRole } from "../src/exceptions";
import type VetService from "../src/services/vet";

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

describe("VetController", () => {
  test("updateVetInfo rejects when caller is neither admin nor owner", async () => {
    const updateMock = mock();
    const service = {
      update: updateMock,
    } as unknown as VetService;

    const controller = new VetController(service);
    const next = mock((err?: unknown) => err);

    const req = {
      params: { id: "target-user" },
      user: { id: "different-user", role: "USER" },
      body: { startHour: 9 },
    } as unknown as Request;

    const res = createResponse();

    await controller.updateVetInfo(req, res, next);

    expect(next.mock.calls.length).toBe(1);
    expect(next.mock.calls[0]?.[0]).toBeInstanceOf(InvalidRole);
    expect(updateMock.mock.calls.length).toBe(0);
  });

  test("updateVetInfo allows users to update their own vet profile", async () => {
    const updatedVet = {
      id: "vet-1",
      userId: "target-user",
      allowedPetTypes: ["dog"],
      startHour: 9,
      endHour: 17,
      days: 5,
    };
    const updateMock = mock(async () => updatedVet);
    const service = {
      update: updateMock,
    } as unknown as VetService;

    const controller = new VetController(service);
    const next = mock((err?: unknown) => err);

    const req = {
      params: { id: "target-user" },
      user: { id: "target-user", role: "USER" },
      body: { startHour: 8 },
    } as unknown as Request;

    const res = createResponse();

    await controller.updateVetInfo(req, res, next);

    expect(next.mock.calls.length).toBe(0);
    expect(updateMock.mock.calls.length).toBe(1);
    expect(updateMock.mock.calls[0]).toEqual([
      "target-user",
      { startHour: 8 },
    ]);
    expect((res as unknown as { statusCode: number }).statusCode).toBe(200);
    expect((res as unknown as { body: unknown }).body).toEqual(updatedVet);
  });
});
