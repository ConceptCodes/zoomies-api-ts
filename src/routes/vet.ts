import { Router } from "express";

import VetController from "@controller/vet";
import { Routes } from "@/constants";
import ValidationMiddleware from "@middleware/validation";
import { getOneVetSchema } from "@/schemas";
import { authMiddleware } from "@middleware/auth";

export default class VetRoute implements Routes {
  public path = "/vets";
  public router = Router();
  public controller = new VetController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/`,
      authMiddleware,
      this.controller.getAllVets
    );
    this.router.get(
      `${this.path}/:id`,
      [authMiddleware, ValidationMiddleware(getOneVetSchema, "params")],
      this.controller.getVetById
    );
  }
}
