import { eq } from "drizzle-orm";

import { db } from "@lib/db";
import { Service, serviceTable } from "@lib/db/schema";
import { CreateServiceSchema, UpdateServiceSchema } from "@/schemas";

export default class ServiceService {
  public async getAll(): Promise<Service[]> {
    try {
      const services = await db.select().from(serviceTable);
      return services;
    } catch (err) {
      throw err;
    }
  }

  public async getOneById(id: Service["id"]): Promise<Service> {
    try {
      const service = await db
        .select()
        .from(serviceTable)
        .where(eq(serviceTable.id, id));
      return service[0];
    } catch (err) {
      throw err;
    }
  }

  public async create(data: CreateServiceSchema): Promise<Service> {
    try {
      const service = await db
        .insert(serviceTable)
        .values({
          ...data,
          applicablePetTypes: data.applicablePetTypes as any, // TODO: Fix this
        })
        .returning();
      return service[0];
    } catch (err) {
      throw err;
    }
  }

  public async update(data: UpdateServiceSchema): Promise<Service> {
    try {
      const service = await db.update(serviceTable).set(data).returning();
      return service[0];
    } catch (err) {
      throw err;
    }
  }

  public async delete(id: Service["id"]): Promise<void> {
    try {
      await db.delete(serviceTable).where(eq(serviceTable.id, id));
    } catch (err) {
      throw err;
    }
  }
}
