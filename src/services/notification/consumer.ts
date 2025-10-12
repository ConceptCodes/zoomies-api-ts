import type { MessageQueue, QueueMessage } from "@lib/queue";
import type { NotificationJob } from "@lib/notifications/types";
import { NotificationSender } from "./sender";

export class NotificationConsumer {
  constructor(
    private readonly queue: MessageQueue<NotificationJob>,
    private readonly sender: NotificationSender
  ) {}

  public start(): void {
    this.queue.subscribe(async (message: QueueMessage<NotificationJob>) => {
      const job = message.payload;
      job.id = job.id ?? message.id;
      try {
        await this.sender.handle(job);
      } catch (error) {
        console.error("Failed to process notification job", {
          jobId: job.id,
          error,
        });
      }
    });
  }
}
