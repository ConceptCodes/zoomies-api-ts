import { eq } from "drizzle-orm";

import { db } from "@lib/db";
import { Vet, vetTable } from "@lib/db/schema";
import { CreateVetSchema, UpdateVetSchema } from "@/schemas";
import { EntityNotFoundError } from "@/exceptions";
import { takeFirst } from "@/utils";

export default class VetService {
  public async getById(userId: Vet["userId"]): Promise<Vet> {
    try {
      const vets = await db
        .select()
        .from(vetTable)
        .where(eq(vetTable.userId, userId))
        .limit(1);

      const vet = takeFirst(vets);
      if (!vet) {
        throw new EntityNotFoundError("VET");
      }

      return vet;
    } catch (error) {
      throw error;
    }
  }

  public async getAll(): Promise<Vet[]> {
    try {
      const vets = await db.select().from(vetTable);
      return vets;
    } catch (error) {
      throw error;
    }
  }

  public async create(data: CreateVetSchema): Promise<Vet> {
    try {
      const created = await db.insert(vetTable).values(data).returning();
      const vet = takeFirst(created);
      if (!vet) {
        throw new EntityNotFoundError("VET");
      }

      return vet;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    userId: Vet["userId"],
    data: UpdateVetSchema
  ): Promise<Vet> {
    try {
      const updates = {
        ...Object.fromEntries(
          Object.entries(data).filter(([, value]) => value !== undefined)
        ),
        updatedAt: new Date(),
      };

      const updated = await db
        .update(vetTable)
        .set(updates)
        .where(eq(vetTable.userId, userId))
        .returning();

      const vet = takeFirst(updated);
      if (!vet) {
        throw new EntityNotFoundError("VET");
      }

      return vet;
    } catch (error) {
      throw error;
    }
  }
}
