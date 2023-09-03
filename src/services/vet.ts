import { eq } from "drizzle-orm";

import { db } from "@lib/db";
import { Vet, vetTable } from "@lib/db/schema";
import { UpdateVetSchema } from "@/schemas";

export default class VetService {
  public async getById(id: Vet["userId"]): Promise<Partial<Vet>[]> {
    try {
      const pets = await db
        .select({
          id: vetTable.id,
          userId: vetTable.userId,
          startHour: vetTable.startHour,
          endHour: vetTable.endHour,
          days: vetTable.days,
        })
        .from(vetTable)
        .where(eq(vetTable.userId, id));
      return pets;
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

  public async update(data: Required<UpdateVetSchema>): Promise<void> {
    try {
      await db.update(vetTable).set(data).where(eq(vetTable.userId, data.id));
    } catch (error) {
      throw error;
    }
  }
}
