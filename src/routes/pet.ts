import { Router } from "express";

import PetController from "@controller/pet";
import { Routes } from "@/constants";
import ValidationMiddleware from "@middleware/validation";
import {
  getByIdPetSchema,
  getByTypePetSchema,
  getOnePetSchema,
  updatePetSchema,
} from "@/schemas";
import { insertPetSchema } from "@lib/db/schema";
import { authMiddleware } from "@middleware/auth";

export default class PetRoute implements Routes {
  public path = "/pets";
  public router = Router();
  public controller = new PetController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/`,
      authMiddleware,
      this.controller.getAllPets
    );
    this.router.get(
      `${this.path}/:id`,
      [authMiddleware, ValidationMiddleware(getOnePetSchema, "params")],
      this.controller.getPetById
    );
    this.router.get(
      `${this.path}/type/:type`,
      [authMiddleware, ValidationMiddleware(getByTypePetSchema, "params")],
      this.controller.getPetsByType
    );
    this.router.post(
      `${this.path}/`,
      [authMiddleware, ValidationMiddleware(insertPetSchema)],
      this.controller.createPet
    );
    this.router.patch(
      `${this.path}/`,
      [authMiddleware, ValidationMiddleware(updatePetSchema)],
      this.controller.updatePet
    );
    this.router.delete(
      `${this.path}/:id`,
      [authMiddleware, ValidationMiddleware(getByIdPetSchema, "params")],
      this.controller.deletePet
    );
  }
}
