import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

import { UserPayload } from "@/constants";
import { InvalidRole, InvalidToken } from "@/exceptions";
import { User } from "@/lib/db/schema";
import { env } from "@/lib/env";

const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    let payload = req.get("Authorization");
    if (payload && payload.startsWith("Bearer ")) {
      payload = payload.slice(7, payload.length);
      const _token: UserPayload = jwt.verify(
        payload,
        env.JWT_SECRET
      ) as UserPayload;
      if (_token && _token.id && _token.role) {
        req.user = { id: _token.id, role: _token.role };
        next();
      } else {
        throw new InvalidToken();
      }
    } else {
      throw new InvalidToken();
    }
  } catch (error) {
    next(error);
  }
};

const allowedRoles = (role: User["role"][]): RequestHandler => {
  return async (req, _, next) => {
    if (role.includes(req.user?.role)) {
      next();
    } else {
      next(new InvalidRole());
    }
  };
};

export { authMiddleware, allowedRoles };
