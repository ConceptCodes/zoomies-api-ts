import { env } from "@lib/env";
import type { MessageQueue } from "@lib/queue";
import type {
  AppointmentReminderPayload,
  NotificationJob,
} from "@lib/notifications/types";
import { NotificationEventType } from "@lib/notifications/types";
import { getRedisClient } from "@lib/redis";

export interface NotificationIdempotencyStore {
  claim(key: string, ttlMs: number): Promise<boolean>;
}

class RedisNotificationIdempotencyStore
  implements NotificationIdempotencyStore
{
  public async claim(key: string, ttlMs: number): Promise<boolean> {
    try {
      const redis = getRedisClient();
      const ttlSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
      const result = await redis.set(key, "1", {
        nx: true,
        ex: ttlSeconds,
      });
      return result === "OK";
    } catch (error) {
      console.warn("Notification idempotency store not available", error);
      return true; // best effort when redis is unavailable
    }
  }
}

export class NotificationPublisher {
  constructor(
    private readonly queue: MessageQueue<NotificationJob>,
    private readonly idempotencyStore: NotificationIdempotencyStore = new RedisNotificationIdempotencyStore()
  ) {}

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

    const key = `notifications:appointment:${payload.appointmentId}:${payload.appointmentDate}`;
    const ttlMs = Math.max(
      leadTimeMs,
      appointmentDate.getTime() - Date.now() + leadTimeMs
    );

    const shouldPublish = await this.idempotencyStore.claim(key, ttlMs);
    if (!shouldPublish) {
      return;
    }

    const job: NotificationJob = {
      type: NotificationEventType.APPOINTMENT_REMINDER,
      payload,
      sendAt,
    };

    await this.publish(job);
  }
}
