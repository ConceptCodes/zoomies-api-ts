import { eq } from "drizzle-orm";

import { db } from "@lib/db";
import { Service, serviceTable, NewService } from "@lib/db/schema";
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
      // Ensure applicablePetTypes is an array and validate values
      const petTypesArray = Array.isArray(data.applicablePetTypes)
        ? data.applicablePetTypes
        : [data.applicablePetTypes];

      const validPetTypes = [
        "dog",
        "cat",
        "bird",
        "hamster",
        "unknown",
        "fish",
        "rabbit",
        "turtle",
        "snake",
        "lizard",
        "guinea_pig",
        "horse",
        "goat",
      ] as const;
      const filteredPetTypes = petTypesArray.filter((petType: any) =>
        validPetTypes.includes(petType)
      ) as NewService["applicablePetTypes"];

      const serviceData: NewService = {
        name: data.name,
        description: data.description || null,
        applicablePetTypes: filteredPetTypes,
        price: data.price || 100,
      };

      const service = await db
        .insert(serviceTable)
        .values(serviceData)
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
