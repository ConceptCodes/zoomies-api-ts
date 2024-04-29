import { Router } from "express";
import AuthController from "@controller/auth";
import { Routes } from "@/constants";
import { loginSchema, registerSchema, verifyEmailSchema } from "@/schemas";
import ValidationMiddleware from "@middleware/validation";

export default class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(loginSchema),
      this.controller.login
    );
    this.router.get(`${this.path}/logout`, this.controller.logout);
    this.router.post(
      `${this.path}/register`,
      ValidationMiddleware(registerSchema, "body"),
      this.controller.register
    );
    this.router.post(
      `${this.path}/verify-email`,
      ValidationMiddleware(verifyEmailSchema),
      this.controller.verifyEmail
    );
  }
}
