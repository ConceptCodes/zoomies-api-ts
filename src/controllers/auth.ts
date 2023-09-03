import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AuthService from "@service/auth";

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

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(StatusCodes.OK).json({ token });
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, refreshToken } = await this.service.register(req.body);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(StatusCodes.CREATED).json({ token });
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.logout(req.user.id);
      res.clearCookie("refreshToken");
      res.status(StatusCodes.OK).send();
    } catch (err) {
      next(err);
    }
  };
}
