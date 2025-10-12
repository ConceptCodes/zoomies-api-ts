import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import ProfileService from "@service/profile";
import { User, petTable, userTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { GetByTypePetSchema, UpdateProfileSchema } from "@/schemas";

export default class ProfileController {
  private service: ProfileService;

  constructor() {
    this.service = new ProfileService();
  }

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
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

  // Note: should we allow the user to update their phone number & email without verification? 
  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const data = req.body as UpdateProfileSchema;
      await this.service.update(id, data);
      res.status(StatusCodes.OK).send();
    } catch (err) {
      next(err);
    }
  };

}
