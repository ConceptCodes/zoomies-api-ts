import { env } from "@lib/env";
import { RedisQueue } from "@lib/queue/redis";
import type { MessageQueue } from "@lib/queue";
import type { NotificationJob } from "@lib/notifications/types";

import { NotificationPublisher } from "./publisher";
import { NotificationConsumer } from "./consumer";
import { NotificationSender } from "./sender";

let queue: MessageQueue<NotificationJob> | null = null;
let publisher: NotificationPublisher | null = null;
let consumer: NotificationConsumer | null = null;

export function initializeNotificationModule(): void {
  if (queue && publisher && consumer) {
    return;
  }

  queue = new RedisQueue<NotificationJob>({
    queueKey: env.NOTIFICATION_QUEUE_KEY,
    scheduledKey: env.NOTIFICATION_SCHEDULED_QUEUE_KEY,
    pollIntervalMs: env.NOTIFICATION_WORKER_POLL_INTERVAL_MS,
    scheduledBatchSize: env.NOTIFICATION_SCHEDULED_BATCH_SIZE,
  });

  publisher = new NotificationPublisher(queue);
  const sender = new NotificationSender();
  consumer = new NotificationConsumer(queue, sender);
  consumer.start();
}

export function getNotificationPublisher(): NotificationPublisher {
  if (!publisher) {
    throw new Error("Notification module not initialized");
  }

  return publisher;
}
