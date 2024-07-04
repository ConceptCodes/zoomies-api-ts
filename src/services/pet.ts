import { eq, and } from "drizzle-orm";

import { db } from "@lib/db";
import { Pet, User, petTable } from "@lib/db/schema";
import type {
  CreatePetSchema,
  GetByTypePetSchema,
  GetOnePetSchema,
  UpdatePetSchema,
} from "@/schemas";
import { doesUserExist } from "@/utils/auth";
import { EntityNotFoundError } from "@/exceptions";

export default class PetService {
  public async getAll(userId: User["id"]): Promise<Pet[]> {
    try {
      const pets = await db
        .select()
        .from(petTable)
        .where(eq(petTable.ownerId, userId));
      return pets;
    } catch (error) {
      throw error;
    }
  }

  public async getOne(data: GetOnePetSchema): Promise<Pet> {
    try {
      const { id, ownerId } = data;
      const pet = await db
        .select()
        .from(petTable)
        .where(and(eq(petTable.ownerId, ownerId), eq(petTable.id, id)))
        .limit(1);
      return pet[0];
    } catch (error) {
      throw error;
    }
  }

  public async getAllByType(data: GetByTypePetSchema): Promise<Pet[]> {
    try {
      const { type, ownerId } = data;
      const pets = await db
        .select()
        .from(petTable)
        .where(and(eq(petTable.ownerId, ownerId), eq(petTable.type, type)));
      return pets;
    } catch (error) {
      throw error;
    }
  }

  public async create(data: CreatePetSchema): Promise<void> {
    try {
      const exist = await doesUserExist(data.ownerId);
      if (!exist) throw new EntityNotFoundError("USER");

      await db.insert(petTable).values(data);
    } catch (error) {
      throw error;
    }
  }

  public async update(data: UpdatePetSchema): Promise<void> {
    try {
      const { id, ownerId, ...rest } = data;
      await db
        .update(petTable)
        .set(rest)
        .where(
          and(eq(petTable.ownerId, ownerId || 0), eq(petTable.id, id || 0))
        );
    } catch (error) {
      throw error;
    }
  }

  public async delete(data: GetOnePetSchema): Promise<void> {
    try {
      const { id, ownerId } = data;
      await db
        .delete(petTable)
        .where(and(eq(petTable.ownerId, ownerId || 0), eq(petTable.id, id)));
    } catch (error) {
      throw error;
    }
  }
}
