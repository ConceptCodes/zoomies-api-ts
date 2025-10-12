import { Router } from "express";

import VetController from "@controller/vet";
import { Routes } from "@/constants";
import ValidationMiddleware from "@middleware/validation";
import {
  createVetSchema,
  getOneVetSchema,
  updateVetSchema,
} from "@/schemas";
import { authMiddleware, allowedRoles } from "@middleware/auth";

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

    this.router.post(
      this.path,
      [
        authMiddleware,
        allowedRoles(["ADMIN"]),
        ValidationMiddleware(createVetSchema),
      ],
      this.controller.createVet
    );

    this.router.patch(
      `${this.path}/:id`,
      [
        authMiddleware,
        ValidationMiddleware(getOneVetSchema, "params"),
        ValidationMiddleware(updateVetSchema),
      ],
      this.controller.updateVetInfo
    );
  }
}
