import { describe, expect, test } from "bun:test";

import { NotificationPublisher } from "../src/services/notification/publisher";
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

describe("NotificationPublisher", () => {
  test("publish forwards job to queue unchanged", async () => {
    const queue = new StubQueue();
    const publisher = new NotificationPublisher(queue);

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
    const publisher = new NotificationPublisher(queue);

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
    const publisher = new NotificationPublisher(queue);

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
});
