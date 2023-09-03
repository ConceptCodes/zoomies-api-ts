import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import ProfileService from "@service/profile";
import { User, petTable, userTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { GetByTypePetSchema } from "@/schemas";

export default class ProfileController {
  private service: ProfileService;

  constructor() {
    this.service = new ProfileService();
  }

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.get(req.user.id);
      res.status(StatusCodes.OK).json(user);
    } catch (err) {
      next(err);
    }
  };

  public async getAllByType(data: GetByTypePetSchema): Promise<User[]> {
    try {
      const { ownerId, type } = data;
      const pets = await db
        .select()
        .from(userTable)
        .where(and(eq(userTable.id, ownerId), eq(petTable.type, type)));
      return pets;
    } catch (error) {
      throw error;
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const { phoneNumber, fullName } = req.body;
      await this.service.update({
        id,
        phoneNumber,
        fullName,
      });
      res.status(StatusCodes.OK).send();
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      await this.service.delete(id);
      res.status(StatusCodes.OK).send();
    } catch (err) {
      next(err);
    }
  };
}
