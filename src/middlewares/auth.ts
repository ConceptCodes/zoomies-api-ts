import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt_decode, { InvalidTokenError } from "jwt-decode";

import { UserPayload } from "@/constants";
import { InvalidRole } from "@/exceptions";
import { User } from "@/lib/db/schema";

const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    let payload = req.get("Authorization");
    if (payload && payload.startsWith("Bearer ")) {
      payload = payload.slice(7, payload.length);
      const _token: UserPayload = jwt_decode(payload, {
        header: true,
      });
      if (_token && _token.id && _token.role) {
        req.user = { id: _token.id, role: _token.role };
      } else {
        throw new InvalidTokenError();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const isRole = (role: User["role"][]): RequestHandler => {
  return async (req, _, next) => {
    if (role.includes(req.user?.role)) {
      next();
    } else {
      next(new InvalidRole());
    }
  };
};

export { authMiddleware, isRole };
