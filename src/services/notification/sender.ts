import { eq } from "drizzle-orm";

import {
  NotificationChannel,
  NotificationEventType,
  NotificationJob,
  NotificationPayloadMap,
} from "@lib/notifications/types";
import {
  Appointment,
  Pet,
  Service,
  User,
  appointmentTable,
  petTable,
  serviceTable,
  userTable,
} from "@lib/db/schema";
import { db } from "@lib/db";
import { takeFirst } from "@/utils";
import { sendEmail } from "@lib/email";
import { isTwilioConfigured, sendSms } from "@lib/sms";
import { env } from "@lib/env";

type AppointmentReminderJob = NotificationJob<
  NotificationEventType.APPOINTMENT_REMINDER
>;

type AppointmentReminderPayload =
  NotificationPayloadMap[NotificationEventType.APPOINTMENT_REMINDER];

type AppointmentReminderContext = {
  job: AppointmentReminderJob;
  user: User;
  appointment: Appointment;
  pet?: Pick<Pet, "name">;
  service?: Pick<Service, "name">;
  vet?: Pick<User, "fullName">;
};

interface NotificationChannelAdapter {
  sendAppointmentReminder(context: AppointmentReminderContext): Promise<void>;
}

class EmailNotificationAdapter implements NotificationChannelAdapter {
  public async sendAppointmentReminder(
    context: AppointmentReminderContext
  ): Promise<void> {
    const appointmentDate = new Date(context.appointment.date);
    const formattedDate = appointmentDate.toUTCString();

    const serviceName = context.service?.name ?? "your appointment";
    const petName = context.pet?.name;

    await sendEmail(context.user.email, "appointmentReminder", {
      name: context.user.fullName,
      appointmentDate: formattedDate,
      serviceName,
      petName: petName ?? "",
      vetName: context.vet?.fullName ?? "",
    });
  }
}

class SmsNotificationAdapter implements NotificationChannelAdapter {
  public async sendAppointmentReminder(
    context: AppointmentReminderContext
  ): Promise<void> {
    if (!isTwilioConfigured()) {
      console.warn("Twilio SMS not configured, skipping SMS notification");
      return;
    }

    const { phoneNumber, fullName } = context.user;
    if (!phoneNumber) {
      console.warn("User phone number missing, skipping SMS notification", {
        userId: context.user.id,
      });
      return;
    }

    const appointmentDate = new Date(context.appointment.date);
    const formattedDate = appointmentDate.toUTCString();
    const serviceName = context.service?.name ?? "your appointment";
    const petName = context.pet?.name;

    const messageParts = [
      `Hi ${fullName},`,
      `Reminder: ${serviceName}`,
      petName ? `for ${petName}` : "",
      `on ${formattedDate}.`,
      context.vet?.fullName ? `Vet: ${context.vet.fullName}.` : "",
      "Reply STOP to opt-out.",
    ].filter(Boolean);

    const body = messageParts.join(" ").trim();

    const destination = phoneNumber.startsWith("+")
      ? phoneNumber
      : `${env.TWILIO_DEFAULT_COUNTRY_CODE ?? "+1"}${phoneNumber}`;

    await sendSms(destination, body);
  }
}

class UnsupportedNotificationAdapter implements NotificationChannelAdapter {
  constructor(private readonly channel: NotificationChannel) {}

  public async sendAppointmentReminder(): Promise<void> {
    console.warn(
      `No notification adapter configured for channel ${this.channel}`
    );
  }
}

export class NotificationSender {
  private readonly channelAdapters: Record<
    NotificationChannel,
    NotificationChannelAdapter
  >;

  constructor(
    adapters?: Partial<Record<NotificationChannel, NotificationChannelAdapter>>
  ) {
    const emailAdapter = adapters?.EMAIL ?? new EmailNotificationAdapter();

    const smsAdapter =
      adapters?.SMS ??
      (isTwilioConfigured()
        ? new SmsNotificationAdapter()
        : new UnsupportedNotificationAdapter("SMS"));

    this.channelAdapters = {
      EMAIL: emailAdapter,
      SMS: smsAdapter,
      PUSH:
        adapters?.PUSH ??
        new UnsupportedNotificationAdapter("PUSH"),
    };
  }

  public async handle(job: NotificationJob): Promise<void> {
    switch (job.type) {
      case NotificationEventType.APPOINTMENT_REMINDER:
        await this.handleAppointmentReminder(job);
        break;
      default:
        console.warn(`Unhandled notification job type: ${job.type}`);
    }
  }

  private async handleAppointmentReminder(
    job: AppointmentReminderJob
  ): Promise<void> {
    const { payload } = job;

    const user = await this.fetchUser(payload.userId);
    if (!user) return;

    const preferences = user.notificationPreferences;
    if (!preferences.upcomingAppointments.enabled) {
      return;
    }

    const channels = preferences.channels;
    if (!channels.length) return;

    const context = await this.buildAppointmentReminderContext(
      job,
      payload,
      user
    );

    if (!context) return;

    for (const channel of channels) {
      const adapter = this.channelAdapters[channel];
      if (!adapter) {
        console.warn(`Adapter for channel ${channel} not configured`);
        continue;
      }
      console.info("Sending notification", {
        jobId: job.id,
        channel,
        type: job.type,
      });
      await adapter.sendAppointmentReminder(context);
    }
  }

  private async fetchUser(userId: string): Promise<User | undefined> {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    return takeFirst(users) ?? undefined;
  }

  private async buildAppointmentReminderContext(
    job: AppointmentReminderJob,
    payload: AppointmentReminderPayload,
    user: User
  ): Promise<AppointmentReminderContext | undefined> {
    const appointment = await this.fetchAppointment(payload.appointmentId);
    if (!appointment) {
      console.warn("Appointment not found for reminder job", {
        jobId: job.id,
        appointmentId: payload.appointmentId,
      });
      return undefined;
    }

    const [pet, service, vet] = await Promise.all([
      this.fetchPet(payload.petId),
      this.fetchService(payload.serviceId),
      this.fetchVet(payload.vetId),
    ]);

    return {
      job,
      user,
      appointment,
      pet,
      service,
      vet,
    };
  }

  private async fetchAppointment(
    appointmentId: string
  ): Promise<Appointment | undefined> {
    const appointments = await db
      .select()
      .from(appointmentTable)
      .where(eq(appointmentTable.id, appointmentId))
      .limit(1);

    return takeFirst(appointments) ?? undefined;
  }

  private async fetchPet(
    petId: string
  ): Promise<Pick<Pet, "name"> | undefined> {
    const pets = await db
      .select({
        name: petTable.name,
      })
      .from(petTable)
      .where(eq(petTable.id, petId))
      .limit(1);

    return takeFirst(pets) ?? undefined;
  }

  private async fetchService(
    serviceId: string
  ): Promise<Pick<Service, "name"> | undefined> {
    const services = await db
      .select({
        name: serviceTable.name,
      })
      .from(serviceTable)
      .where(eq(serviceTable.id, serviceId))
      .limit(1);

    return takeFirst(services) ?? undefined;
  }

  private async fetchVet(
    vetId: string
  ): Promise<Pick<User, "fullName"> | undefined> {
    const vets = await db
      .select({
        fullName: userTable.fullName,
      })
      .from(userTable)
      .where(eq(userTable.id, vetId))
      .limit(1);

    return takeFirst(vets) ?? undefined;
  }
}
