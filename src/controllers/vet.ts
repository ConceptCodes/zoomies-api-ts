import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import VetService from "@service/vet";

export default class VetController {
  private service: VetService;

  constructor() {
    this.service = new VetService();
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
      const id = Number(req.params.id);
      const vet = await this.service.getById(id);
      res.status(StatusCodes.OK).json(vet);
    } catch (error) {
      next(error);
    }
  }

  public async updateVetInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const vet = await this.service.update(req.body);
      res.status(StatusCodes.OK).json(vet);
    } catch (error) {
      next(error);
    }
  }
}
