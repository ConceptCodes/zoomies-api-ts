import { Request, Response, NextFunction } from "express";
import HealthService from "@/services/health";
import { StatusCodes } from "http-status-codes";

class HealthController {
  private healthService = new HealthService();

  public getLiveness = async (
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(StatusCodes.OK).json({ message: "Service is healthy" });
    } catch (err) {
      next(err);
    }
  };

  public getHealthiness = async (
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const status = await this.healthService.checkIntegrationsHealth();
      res.status(StatusCodes.OK).json(status);
    } catch (err) {
      next(err);
    }
  };
}

export default HealthController;
