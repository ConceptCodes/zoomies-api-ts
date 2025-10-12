import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import VetService from "@service/vet";
import { InvalidRole } from "@/exceptions";
import type { CreateVetSchema, UpdateVetSchema } from "@/schemas";

export default class VetController {
  private service: VetService;

  constructor(service: VetService = new VetService()) {
    this.service = service;
  }

  public async getAllVets(_: Request, res: Response, next: NextFunction) {
    try {
      const vets = await this.service.getAll();
      res.status(StatusCodes.OK).json(vets);
    } catch (error) {
      next(error);
    }
  }

  public async getVetById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const vet = await this.service.getById(id);
      res.status(StatusCodes.OK).json(vet);
    } catch (error) {
      next(error);
    }
  }

  public async createVet(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateVetSchema;
      const vet = await this.service.create(payload);
      res.status(StatusCodes.CREATED).json(vet);
    } catch (error) {
      next(error);
    }
  }

  public async updateVetInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const targetUserId = req.params.id;
      const isAdmin = req.user.role === "ADMIN";
      const isSelf = req.user.id === targetUserId;

      if (!isAdmin && !isSelf) {
        throw new InvalidRole();
      }

      const payload = req.body as UpdateVetSchema;
      const vet = await this.service.update(targetUserId, payload);
      res.status(StatusCodes.OK).json(vet);
    } catch (error) {
      next(error);
    }
  }
}
