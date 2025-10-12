import { eq, and } from "drizzle-orm";

import { db } from "@lib/db";
import { Pet, User, petTable } from "@lib/db/schema";
import type { CreatePetSchema, UpdatePetSchema } from "@/schemas";
import { doesUserExist } from "@/utils/auth";
import { EntityNotFoundError } from "@/exceptions";
import { takeFirst } from "@/utils";

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

  public async getOne(
    id: Pet["id"],
    ownerId: Pet["ownerId"]
  ): Promise<Pet> {
    try {
      const pet = await db
        .select()
        .from(petTable)
        .where(and(eq(petTable.ownerId, ownerId), eq(petTable.id, id)))
        .limit(1);

      const entity = takeFirst(pet);
      if (!entity) {
        throw new EntityNotFoundError("PET");
      }

      return entity;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByType(
    type: Pet["type"],
    ownerId: Pet["ownerId"]
  ): Promise<Pet[]> {
    try {
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
      if (!id || !ownerId) throw new EntityNotFoundError("PET");
      const updates = {
        ...rest,
        updatedAt: new Date(),
      };

      const result = await db
        .update(petTable)
        .set(updates)
        .where(and(eq(petTable.ownerId, ownerId), eq(petTable.id, id)))
        .returning({ id: petTable.id });

      if (!takeFirst(result)) {
        throw new EntityNotFoundError("PET");
      }
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: Pet["id"], ownerId: Pet["ownerId"]): Promise<void> {
    try {
      const deleted = await db
        .delete(petTable)
        .where(and(eq(petTable.ownerId, ownerId), eq(petTable.id, id)))
        .returning({ id: petTable.id });

      if (!takeFirst(deleted)) {
        throw new EntityNotFoundError("PET");
      }
    } catch (error) {
      throw error;
    }
  }
}
