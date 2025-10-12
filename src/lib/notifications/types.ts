export const notificationChannels = ["EMAIL", "SMS", "PUSH"] as const;

export type NotificationChannel = (typeof notificationChannels)[number];

export type NotificationPreferences = {
  channels: NotificationChannel[];
  upcomingAppointments: {
    enabled: boolean;
  };
};

export enum NotificationEventType {
  APPOINTMENT_REMINDER = "APPOINTMENT_REMINDER",
}

export type AppointmentReminderPayload = {
  appointmentId: string;
  appointmentDate: string;
  userId: string;
  vetId: string;
  serviceId: string;
  petId: string;
};

export type NotificationPayloadMap = {
  [NotificationEventType.APPOINTMENT_REMINDER]: AppointmentReminderPayload;
};

export type NotificationJob<
  T extends NotificationEventType = NotificationEventType,
> = {
  id?: string;
  type: T;
  sendAt?: Date;
  payload: NotificationPayloadMap[T];
};
