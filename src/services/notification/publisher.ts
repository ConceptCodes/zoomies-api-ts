import { env } from "@lib/env";
import type { MessageQueue } from "@lib/queue";
import type {
  AppointmentReminderPayload,
  NotificationJob,
} from "@lib/notifications/types";
import { NotificationEventType } from "@lib/notifications/types";

export class NotificationPublisher {
  constructor(private readonly queue: MessageQueue<NotificationJob>) {}

  public async publish(job: NotificationJob): Promise<void> {
    await this.queue.publish({
      payload: job,
      sendAt: job.sendAt,
    });
  }

  public async scheduleAppointmentReminder(
    payload: AppointmentReminderPayload,
    appointmentDate: Date
  ): Promise<void> {
    const leadTimeMs =
      env.APPOINTMENT_REMINDER_LEAD_MINUTES * 60 * 1000;
    const target = new Date(appointmentDate.getTime() - leadTimeMs);

    const sendAt = target.getTime() > Date.now() ? target : new Date();

    const job: NotificationJob = {
      type: NotificationEventType.APPOINTMENT_REMINDER,
      payload,
      sendAt,
    };

    await this.publish(job);
  }
}
