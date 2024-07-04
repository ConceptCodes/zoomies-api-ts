import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AuthService from "@service/auth";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/constants";

export default class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { token, refreshToken } = await this.service.login({
        email,
        password,
      });

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.header("Authorization", `Bearer ${token}`);
      res.status(StatusCodes.OK).send({
        message: "Login successful.",
      });
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.register(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Verify your email address to complete registration.",
      });
    } catch (err) {
      next(err);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.verifyEmail(req.body);
      res.status(StatusCodes.OK).send({
        message: "Email verified successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.logout(req.user.id);
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
      res.status(StatusCodes.OK).send();
    } catch (err) {
      next(err);
    }
  };
}
