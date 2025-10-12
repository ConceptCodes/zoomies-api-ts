import { Redis } from "@upstash/redis";

import { ensureMessageId, MessageQueue, QueueHandler, QueueMessage } from ".";
import { getRedisClient } from "@lib/redis";

type RedisQueueOptions = {
  queueKey: string;
  scheduledKey: string;
  pollIntervalMs: number;
  scheduledBatchSize: number;
};

type SerializedMessage = {
  id: string;
  payload: unknown;
  sendAt?: string;
};

export class RedisQueue<TPayload> implements MessageQueue<TPayload> {
  private handlers: QueueHandler<TPayload>[] = [];
  private polling = false;
  private redis: Redis;

  constructor(private readonly options: RedisQueueOptions) {
    this.redis = getRedisClient();
  }

  public subscribe(handler: QueueHandler<TPayload>): void {
    this.handlers.push(handler);
    if (!this.polling) {
      this.polling = true;
      void this.processLoop();
    }
  }

  public async publish(message: QueueMessage<TPayload>): Promise<void> {
    const finalized = ensureMessageId(message);
    if (finalized.sendAt && finalized.sendAt.getTime() > Date.now()) {
      await this.scheduleMessage(finalized);
      return;
    }

    await this.enqueueImmediate(finalized);
  }

  private async processLoop(): Promise<void> {
    if (!this.polling) return;

    try {
      await this.flushScheduledMessages();
      const raw = await this.redis.rpop<string>(this.options.queueKey);
      if (raw) {
        const parsed = this.deserialize(raw);
        await this.dispatch(parsed);
        setImmediate(() => void this.processLoop());
        return;
      }
    } catch (error) {
      console.error("Redis queue processing error", error);
    }

    setTimeout(() => void this.processLoop(), this.options.pollIntervalMs);
  }

  private async flushScheduledMessages(): Promise<void> {
    const now = Date.now();
    const due =
      (await this.redis.zrange<string>(
        this.options.scheduledKey,
        0,
        now,
        {
          byScore: true,
          limit: {
            offset: 0,
            count: this.options.scheduledBatchSize,
          },
        }
      )) ?? [];

    if (!due.length) return;

    for (const raw of due) {
      await this.redis.lpush(this.options.queueKey, raw);
      await this.redis.zrem(this.options.scheduledKey, raw);
    }
  }

  private async enqueueImmediate(
    message: QueueMessage<TPayload> & { id: string }
  ): Promise<void> {
    const serialized = this.serialize(message);
    await this.redis.lpush(this.options.queueKey, serialized);
  }

  private async scheduleMessage(
    message: QueueMessage<TPayload> & { id: string }
  ): Promise<void> {
    const serialized = this.serialize(message);
    await this.redis.zadd(this.options.scheduledKey, {
      score: message.sendAt!.getTime(),
      member: serialized,
    });
  }

  private serialize(
    message: QueueMessage<TPayload> & { id: string }
  ): string {
    const payload: SerializedMessage = {
      id: message.id,
      payload: message.payload,
      sendAt: message.sendAt ? message.sendAt.toISOString() : undefined,
    };

    return JSON.stringify(payload);
  }

  private deserialize(raw: string): QueueMessage<TPayload> & { id: string } {
    const parsed = JSON.parse(raw) as SerializedMessage;
    return {
      id: parsed.id,
      payload: parsed.payload as TPayload,
      sendAt: parsed.sendAt ? new Date(parsed.sendAt) : undefined,
    };
  }

  private async dispatch(message: QueueMessage<TPayload> & { id: string }) {
    for (const handler of this.handlers) {
      await handler(message);
    }
  }
}
