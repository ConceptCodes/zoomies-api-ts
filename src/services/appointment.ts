import { and, eq } from "drizzle-orm";

import {
  EntityNotFoundError,
  InvalidRole,
} from "@/exceptions";
import { db } from "@lib/db";
import {
  Appointment,
  Pet,
  Service,
  User,
  Vet,
  appointmentTable,
  petTable,
  serviceTable,
  vetTable,
} from "@lib/db/schema";
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
} from "@/schemas";
import { getNotificationPublisher } from "@service/notification";
import { takeFirst } from "@/utils";
import { UserPayload } from "@/constants";

export default class AppointmentService {
  public async get(id: Appointment["id"], requester: UserPayload) {
    try {
      const appointment = await this.findByIdOrThrow(id);
      this.assertAccess(appointment, requester);
      return appointment;
    } catch (err) {
      throw err;
    }
  }

  public async getAll(): Promise<Appointment[]> {
    try {
      return await db.select().from(appointmentTable);
    } catch (err) {
      throw err;
    }
  }

  public async getAllByUserId(userId: Appointment["userId"]) {
    try {
      return await db
        .select()
        .from(appointmentTable)
        .where(eq(appointmentTable.userId, userId));
    } catch (err) {
      throw err;
    }
  }

  public async create(
    userId: Appointment["userId"],
    data: CreateAppointmentSchema
  ): Promise<Appointment> {
    try {
      await this.assertPetOwnership(data.petId, userId);
      await this.assertServiceExists(data.serviceId);
      await this.assertVetExists(data.vetId);

      const appointmentPayload = { ...data, userId };

      const inserted = await db
        .insert(appointmentTable)
        .values(appointmentPayload)
        .returning();

      const appointment = takeFirst(inserted);
      if (!appointment) {
        throw new EntityNotFoundError("APPOINTMENT");
      }

      await this.scheduleReminder(appointment);

      return appointment;
    } catch (err) {
      throw err;
    }
  }

  public async update(
    requester: UserPayload,
    data: UpdateAppointmentSchema
  ): Promise<Appointment> {
    try {
      const existing = await this.findByIdOrThrow(data.id);
      this.assertAccess(existing, requester);

      await this.assertPetOwnership(data.petId, existing.userId);
      await this.assertServiceExists(data.serviceId);

      const updates = {
        ...data,
        updatedAt: new Date(),
      };

      const result = await db
        .update(appointmentTable)
        .set(updates)
        .where(eq(appointmentTable.id, data.id))
        .returning();

      const appointment = takeFirst(result);
      if (!appointment) {
        throw new EntityNotFoundError("APPOINTMENT");
      }

      await this.scheduleReminder(appointment);

      return appointment;
    } catch (err) {
      throw err;
    }
  }

  public async delete(id: Appointment["id"]): Promise<void> {
    try {
      await db.delete(appointmentTable).where(eq(appointmentTable.id, id));
    } catch (err) {
      throw err;
    }
  }

  private assertAccess(
    appointment: Appointment,
    requester: UserPayload
  ): void {
    if (requester.role === "ADMIN") return;
    if (appointment.userId !== requester.id) {
      throw new InvalidRole();
    }
  }

  private async findByIdOrThrow(id: Appointment["id"]): Promise<Appointment> {
    const results = await db
      .select()
      .from(appointmentTable)
      .where(eq(appointmentTable.id, id))
      .limit(1);

    const appointment = takeFirst(results);
    if (!appointment) {
      throw new EntityNotFoundError("APPOINTMENT");
    }
    return appointment;
  }

  private async assertPetOwnership(
    petId: Pet["id"],
    ownerId: User["id"]
  ): Promise<void> {
    const pets = await db
      .select({ id: petTable.id })
      .from(petTable)
      .where(and(eq(petTable.id, petId), eq(petTable.ownerId, ownerId)))
      .limit(1);

    if (!takeFirst(pets)) {
      throw new EntityNotFoundError("PET");
    }
  }

  private async assertServiceExists(serviceId: Service["id"]): Promise<void> {
    const services = await db
      .select({ id: serviceTable.id })
      .from(serviceTable)
      .where(eq(serviceTable.id, serviceId))
      .limit(1);

    if (!takeFirst(services)) {
      throw new EntityNotFoundError("SERVICE");
    }
  }

  private async assertVetExists(vetUserId: Vet["userId"]): Promise<void> {
    const vets = await db
      .select({ id: vetTable.id })
      .from(vetTable)
      .where(eq(vetTable.userId, vetUserId))
      .limit(1);

    if (!takeFirst(vets)) {
      throw new EntityNotFoundError("VET");
    }
  }

  private async scheduleReminder(appointment: Appointment): Promise<void> {
    try {
      const publisher = getNotificationPublisher();
      await publisher.scheduleAppointmentReminder(
        {
          appointmentId: appointment.id,
          appointmentDate: appointment.date.toISOString(),
          userId: appointment.userId,
          vetId: appointment.vetId,
          serviceId: appointment.serviceId,
          petId: appointment.petId,
        },
        new Date(appointment.date)
      );
    } catch (error) {
      console.error("Failed to schedule appointment reminder", {
        appointmentId: appointment.id,
        error,
      });
    }
  }
}
