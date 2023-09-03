import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import ServiceService from "@service/service";

export default class ServiceController {
  private service: ServiceService;

  constructor() {
    this.service = new ServiceService();
  }

  public getAllServices = async (
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.service.getAll();
      res.status(StatusCodes.OK).json(data);
    } catch (err) {
      next(err);
    }
  };

  public getOneServiceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.service.getOneById(Number(req.params.id));
      res.status(StatusCodes.OK).json(data);
    } catch (err) {
      next(err);
    }
  };

  public createService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.service.create(req.body);
      res.status(StatusCodes.CREATED).json(data);
    } catch (err) {
      next(err);
    }
  };

  public updateService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.service.update(req.body);
      res.status(StatusCodes.OK).json(data);
    } catch (err) {
      next(err);
    }
  };

  public deleteService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(StatusCodes.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  };
}
