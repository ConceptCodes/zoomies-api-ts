import { eq } from "drizzle-orm";

import { EntityNotFoundError } from "@/exceptions";
import { db } from "@lib/db";
import { Appointment, appointmentTable } from "@lib/db/schema";
import { CreateAppointmentSchema, UpdateAppointmentSchema } from "@/schemas";
import { getNotificationPublisher } from "@service/notification";

export default class AppointmentService {
  public async get(id: Appointment["id"]) {
    try {
      const tmp = await db
        .select()
        .from(appointmentTable)
        .where(eq(appointmentTable.id, id))
        .limit(1);

      if (!tmp[0]) throw new EntityNotFoundError("Appointment Not Found");

      return tmp[0];
    } catch (err) {
      throw err;
    }
  }

  public async getAll(): Promise<Appointment[]> {
    try {
      const tmp = await db.select().from(appointmentTable);
      return tmp;
    } catch (err) {
      throw err;
    }
  }

  public async getAllByUserId(userId: Appointment["userId"]) {
    try {
      const tmp = await db
        .select()
        .from(appointmentTable)
        .where(eq(appointmentTable.userId, userId));

      return tmp;
    } catch (err) {
      throw err;
    }
  }

  public async create(
    userId: Appointment["userId"],
    data: CreateAppointmentSchema
  ): Promise<Appointment> {
    try {
      const appointmentPayload = { ...data, userId };

      const inserted = await db
        .insert(appointmentTable)
        .values(appointmentPayload)
        .returning();

      const appointment = inserted[0];

      if (!appointment) {
        throw new EntityNotFoundError("Appointment Creation Failed");
      }

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

      return appointment;
    } catch (err) {
      throw err;
    }
  }

  public async update(
    data: Required<UpdateAppointmentSchema>
  ): Promise<Appointment> {
    try {
      const result = await db
        .update(appointmentTable)
        .set(data)
        .where(eq(appointmentTable.id, data.id))
        .returning();

      return result[0];
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
}
