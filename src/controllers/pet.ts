import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import PetService from "@service/pet";
import { Pet } from "@lib/db/schema";

export default class PetController {
  private service: PetService;

  constructor() {
    this.service = new PetService();
  }

  public async getAllPets(req: Request, res: Response, next: NextFunction) {
    try {
      const pets = await this.service.getAll(req.user.id);
      res.status(StatusCodes.OK).json(pets);
    } catch (error) {
      next(error);
    }
  }

  public async getPetById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const pet = await this.service.getOne({
        id,
        ownerId: req.user.id,
      });
      res.status(StatusCodes.OK).json(pet);
    } catch (error) {
      next(error);
    }
  }

  public async getPetsByType(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type as Pet["type"];
    try {
      const pets = await this.service.getAllByType({
        type,
        ownerId: req.user.id,
      });
      res.status(StatusCodes.OK).json(pets);
    } catch (error) {
      next(error);
    }
  }

  public async createPet(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.create(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Pet created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async updatePet(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.update(req.body);
      res.status(StatusCodes.NO_CONTENT).json({
        message: "Pet updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async deletePet(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await this.service.delete({
        id,
        ownerId: req.user.id,
      });
      res.status(StatusCodes.NO_CONTENT).json({
        message: "Pet deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
