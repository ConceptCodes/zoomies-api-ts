import { db } from "../../src/lib/db";
import {
  userTable,
  petTable,
  vetTable,
  serviceTable,
  appointmentTable,
  sessionTable,
} from "../../src/lib/db/schema";
import { sql } from "drizzle-orm";

export class TestDatabaseHelper {
  static async cleanDatabase() {
    // Clean all tables in correct order to respect foreign keys
    await db.delete(sessionTable);
    await db.delete(appointmentTable);
    await db.delete(petTable);
    await db.delete(vetTable);
    await db.delete(serviceTable);
    await db.delete(userTable);
  }

  static async createTestUser(userData: any = {}) {
    const defaultUser = {
      email: "test@example.com",
      password: "hashedpassword",
      fullName: "Test User",
      phoneNumber: "1234567890",
      role: "USER",
      emailVerified: new Date(),
      ...userData,
    };

    const result = await db.insert(userTable).values(defaultUser).returning();
    return result[0];
  }

  static async createTestPet(petData: any = {}, ownerId: string) {
    const defaultPet = {
      name: "Test Pet",
      age: 3,
      type: "dog",
      ownerId,
      ...petData,
    };

    const result = await db.insert(petTable).values(defaultPet).returning();
    return result[0];
  }

  static async createTestVet(vetData: any = {}, userId: string) {
    const defaultVet = {
      userId,
      allowedPetTypes: ["dog", "cat"],
      startHour: 9,
      endHour: 17,
      days: 5,
      ...vetData,
    };

    const result = await db.insert(vetTable).values(defaultVet).returning();
    return result[0];
  }

  static async createTestService(serviceData: any = {}) {
    const defaultService = {
      name: "Test Service",
      description: "Test service description",
      applicablePetTypes: ["dog"],
      price: 10000,
      ...serviceData,
    };

    const result = await db
      .insert(serviceTable)
      .values(defaultService)
      .returning();
    return result[0];
  }

  static async createTestAppointment(
    appointmentData: any = {},
    userId: string,
    petId: string,
    vetId: string,
    serviceId: string
  ) {
    const defaultAppointment = {
      userId,
      petId,
      vetId,
      serviceId,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      description: "Test appointment",
      duration: 30,
      ...appointmentData,
    };

    const result = await db
      .insert(appointmentTable)
      .values(defaultAppointment)
      .returning();
    return result[0];
  }

  static async resetSequences() {
    // Reset auto-increment sequences for predictable IDs in tests
    await db.execute(sql`ALTER SEQUENCE user_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE pet_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE vet_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE service_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE appointment_id_seq RESTART WITH 1`);
  }
}

export const createTestContext = async () => {
  await TestDatabaseHelper.cleanDatabase();
  await TestDatabaseHelper.resetSequences();

  const user = await TestDatabaseHelper.createTestUser();
  const pet = await TestDatabaseHelper.createTestPet({}, user.id);
  const vet = await TestDatabaseHelper.createTestVet({}, user.id);
  const service = await TestDatabaseHelper.createTestService();
  const appointment = await TestDatabaseHelper.createTestAppointment(
    {},
    user.id,
    pet.id,
    vet.id,
    service.id
  );

  return { user, pet, vet, service, appointment };
};
