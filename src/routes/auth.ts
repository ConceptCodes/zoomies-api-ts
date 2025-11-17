import { Router } from "express";
import rateLimit from "express-rate-limit";
import AuthController from "@controller/auth";
import { Routes } from "@/constants";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/schemas";
import ValidationMiddleware from "@middleware/validation";

export default class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public controller = new AuthController();

  private authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message:
      "Too many authentication attempts from this IP, please try again later.",
  });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      this.authLimiter,
      ValidationMiddleware(loginSchema),
      this.controller.login
    );
    this.router.get(`${this.path}/logout`, this.controller.logout);
    this.router.post(
      `${this.path}/register`,
      this.authLimiter,
      ValidationMiddleware(registerSchema, "body"),
      this.controller.register
    );
    this.router.post(
      `${this.path}/verify-email`,
      this.authLimiter,
      ValidationMiddleware(verifyEmailSchema),
      this.controller.verifyEmail
    );
    this.router.post(
      `${this.path}/forgot-password`,
      this.authLimiter,
      ValidationMiddleware(forgotPasswordSchema),
      this.controller.forgotPassword
    );
    this.router.post(
      `${this.path}/reset-password`,
      this.authLimiter,
      ValidationMiddleware(resetPasswordSchema),
      this.controller.resetPassword
    );
  }
}
