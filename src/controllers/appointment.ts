import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AppointmentService from "@service/appointment";

export default class AppointmentController {
  private service: AppointmentService;

  constructor() {
    this.service = new AppointmentService();
  }

  public getOneAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.service.get(Number(req.params.id));
      res.status(StatusCodes.OK).json(data);
    } catch (err) {
      next(err);
    }
  };

  public getAllAppointments = async (
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

  public getUserAppointments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.service.getAllByUserId(req.user.id);
      res.status(StatusCodes.OK).json(data);
    } catch (err) {
      next(err);
    }
  };

  public createAppointment = async (
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

  public updateAppointment = async (
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

  public deleteAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(StatusCodes.OK).json({
        message: "Appointment deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
