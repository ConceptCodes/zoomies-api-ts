import { Router } from "express";

import ServiceController from "@controller/service";
import { Routes } from "@/constants";
import ValidationMiddleware from "@middleware/validation";
import { insertServiceSchema } from "@lib/db/schema";
import { getOneServiceSchema, updateServiceSchema } from "@/schemas";
import { authMiddleware, allowedRoles } from "@middleware/auth";

export default class ServiceRoute implements Routes {
  public path = "/services";
  public router = Router();
  public controller = new ServiceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/`, this.controller.getAllServices);
    this.router.get(
      `${this.path}/:id`,
      ValidationMiddleware(getOneServiceSchema, "params"),
      this.controller.getOneServiceById
    );
    this.router.post(
      `${this.path}/`,
      [
        ValidationMiddleware(insertServiceSchema),
        authMiddleware,
        allowedRoles(["ADMIN"]),
      ],
      this.controller.createService
    );
    this.router.patch(
      `${this.path}/`,
      [
        ValidationMiddleware(updateServiceSchema),
        authMiddleware,
        allowedRoles(["ADMIN"]),
      ],
      this.controller.updateService
    );
    this.router.delete(
      `${this.path}/:id`,
      [
        ValidationMiddleware(getOneServiceSchema, "params"),
        authMiddleware,
        allowedRoles(["ADMIN"]),
      ],
      this.controller.deleteService
    );
  }
}
