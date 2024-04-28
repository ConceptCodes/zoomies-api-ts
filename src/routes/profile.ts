import { Router } from "express";

import ProfileController from "@controller/profile";
import { Routes } from "@/constants";
import ValidationMiddleware from "@middleware/validation";
import { updateSchema } from "@/schemas";

export default class ProfileRoute implements Routes {
  public path = "/profile";
  public router = Router();
  public controller = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/`, this.controller.getProfile);
    this.router.patch(
      `${this.path}/`,
      ValidationMiddleware(updateSchema),
      this.controller.updateProfile
    );
  }
}
