import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";

const notFoundMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    console.error(
      `${request.ip} - ${request.method} - ${request.originalUrl} - ${StatusCodes.NOT_FOUND} - ${response.statusMessage}`
    );
    response.status(StatusCodes.NOT_FOUND).send("404 Not Found");
  } catch (error) {
    next(error);
  }
};

export default notFoundMiddleware;
