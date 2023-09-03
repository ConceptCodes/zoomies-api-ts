import { RequestHandler } from "express";
import { ZodError, ZodSchema } from "zod";

import { InternalError, ValidationError } from "@/exceptions";

/**
 * Format Zod Error
 *
 * @description Formats the error object from zod into a string
 * @param error {ZodError} the error object from zod
 * @returns {string} the formatted error message
 */
const formatZodError = (error: ZodError) => {
  return error.errors
    .map((error) => {
      return `${error.path} is ${error.message}`;
    })
    .join(", ");
};

/**
 * Validation Middleware
 *
 * @description Validates the request against a zod schema
 * @param schema {ZodSchema} the zod schema to validate against
 * @returns {RequestHandler} the request handler
 * @throws {HttpException} if the request body is invalid
 * @throws {HttpException} if there is an error parsing the request body
 */
const ValidationMiddleware = <T>(
  schema: ZodSchema<T>,
  type: "body" | "query" | "params" = "body"
): RequestHandler => {
  return async (req, _, next) => {
    console.info(
      `TASK:: Validation Middleware >> SUB_TASK:: Validating request ${type} against ${schema.description}`
    );
    try {
      await schema.parseAsync(req[type]);
      console.info(
        `TASK:: Validation Middleware >> STATUS:: Request ${type} is valid`
      );
      next();
    } catch (error) {
      console.warn(
        `TASK:: Validation Middleware >> STATUS:: Error parsing request ${type}`
      );
      if (error instanceof ZodError) {
        const errors = formatZodError(error);
        next(new ValidationError(errors));
      } else {
        next(new InternalError());
      }
    }
  };
};

export default ValidationMiddleware;
