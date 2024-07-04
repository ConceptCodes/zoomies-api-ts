import { Router } from "express";

import AppointmentController from "@controller/appointment";
import { Routes } from "@/constants";
import ValidationMiddleware from "@middleware/validation";
import { getOneAppointmentSchema, updateAppointmentSchema } from "@/schemas";
import { insertAppointmentSchema } from "@lib/db/schema";
import { authMiddleware, allowedRoles } from "@middleware/auth";

export default class AppointmentRoute implements Routes {
  public path = "/appointment";
  public router = Router();
  public controller = new AppointmentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/`,
      authMiddleware,
      this.controller.getAllAppointments
    );
    this.router.get(
      `${this.path}/:id`,
      [authMiddleware, ValidationMiddleware(getOneAppointmentSchema, "params")],
      this.controller.getOneAppointment
    );
    this.router.post(
      `${this.path}/`,
      [authMiddleware, ValidationMiddleware(insertAppointmentSchema)],
      this.controller.createAppointment
    );
    this.router.patch(
      `${this.path}/`,
      [authMiddleware, ValidationMiddleware(updateAppointmentSchema)],
      this.controller.updateAppointment
    );
    this.router.delete(
      `${this.path}/:id`,
      [
        authMiddleware,
        allowedRoles(["ADMIN"]),
        ValidationMiddleware(getOneAppointmentSchema, "params"),
      ],
      this.controller.deleteAppointment
    );
  }
}
