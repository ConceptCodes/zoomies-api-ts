import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt_decode from "jwt-decode";

import { UserPayload } from "@/constants";
import { InvalidRole } from "@/exceptions";
import { User } from "@/lib/db/schema";

const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const payload = req.get("x-access-token");
    if (payload) {
      const _token: UserPayload = jwt_decode(payload, {
        header: true,
      });
      if (_token) {
        req.user = { id: _token.id, role: _token.role };
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
