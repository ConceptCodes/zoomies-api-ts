import "./setup-env";

import { describe, expect, test } from "bun:test";

import {
  NotificationPublisher,
  type NotificationIdempotencyStore,
} from "../src/services/notification/publisher";
import type { MessageQueue, QueueMessage } from "../src/lib/queue";
import type { NotificationJob } from "../src/lib/notifications/types";
import { NotificationEventType } from "../src/lib/notifications/types";

class StubQueue implements MessageQueue<NotificationJob> {
  public published: QueueMessage<NotificationJob>[] = [];

  async publish(message: QueueMessage<NotificationJob>): Promise<void> {
    this.published.push(message);
  }

  subscribe(): void {
    throw new Error("Not implemented in stub");
  }
}

class StubIdempotencyStore implements NotificationIdempotencyStore {
  public claims: { key: string; ttlMs: number }[] = [];

  constructor(private readonly shouldClaim: boolean) {}

  async claim(key: string, ttlMs: number): Promise<boolean> {
    this.claims.push({ key, ttlMs });
    return this.shouldClaim;
  }
}

describe("NotificationPublisher", () => {
  test("publish forwards job to queue unchanged", async () => {
    const queue = new StubQueue();
    const publisher = new NotificationPublisher(queue, new StubIdempotencyStore(true));

    const job: NotificationJob = {
      type: NotificationEventType.APPOINTMENT_REMINDER,
      payload: {
        appointmentId: "appointment-1",
        appointmentDate: new Date().toISOString(),
        userId: "user-1",
        vetId: "vet-1",
        serviceId: "service-1",
        petId: "pet-1",
      },
    };

    await publisher.publish(job);

    expect(queue.published.length).toBe(1);
    expect(queue.published[0]?.payload).toEqual(job);
  });

  test("scheduleAppointmentReminder sets sendAt relative to reminder lead time", async () => {
    const queue = new StubQueue();
    const publisher = new NotificationPublisher(queue, new StubIdempotencyStore(true));

    const appointmentDate = new Date(Date.now() + 90 * 60 * 1000); // 90 minutes ahead

    await publisher.scheduleAppointmentReminder(
      {
        appointmentId: "appointment-1",
        appointmentDate: appointmentDate.toISOString(),
        userId: "user-1",
        vetId: "vet-1",
        serviceId: "service-1",
        petId: "pet-1",
      },
      appointmentDate
    );

    expect(queue.published.length).toBe(1);
    const message = queue.published[0];
    expect(message).toBeDefined();

    const expectedSendAtMs =
      appointmentDate.getTime() -
      60 * 60 * 1000; // env.APPOINTMENT_REMINDER_LEAD_MINUTES default 60

    expect(message?.sendAt?.getTime()).toBe(expectedSendAtMs);
  });

  test("scheduleAppointmentReminder defaults sendAt to now when appointment is imminent", async () => {
    const queue = new StubQueue();
    const publisher = new NotificationPublisher(queue, new StubIdempotencyStore(true));

    const soon = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes out

    await publisher.scheduleAppointmentReminder(
      {
        appointmentId: "appointment-1",
        appointmentDate: soon.toISOString(),
        userId: "user-1",
        vetId: "vet-1",
        serviceId: "service-1",
        petId: "pet-1",
      },
      soon
    );

    const now = Date.now();
    const message = queue.published[0];
    expect(message?.sendAt).toBeDefined();
    const sendAt = message?.sendAt?.getTime() ?? 0;

    expect(sendAt).toBeGreaterThanOrEqual(now - 1000);
    expect(sendAt).toBeLessThanOrEqual(now + 1000);
  });
  test("idempotency store prevents duplicate scheduling for same appointment/date", async () => {
    const queue = new StubQueue();
    const store = new StubIdempotencyStore(false);
    const publisher = new NotificationPublisher(queue, store);

    const appointmentDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const payload = {
      appointmentId: "appointment-1",
      appointmentDate: appointmentDate.toISOString(),
      userId: "user-1",
      vetId: "vet-1",
      serviceId: "service-1",
      petId: "pet-1",
    };

    await publisher.scheduleAppointmentReminder(payload, appointmentDate);
    await publisher.scheduleAppointmentReminder(payload, appointmentDate);

    expect(store.claims.length).toBe(2);
    expect(queue.published.length).toBe(0);
    expect(store.claims[0]?.key).toContain(payload.appointmentId);
    expect(store.claims[0]?.key).toContain(payload.appointmentDate);
  });
});
