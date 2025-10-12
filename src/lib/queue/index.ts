import { randomUUID } from "crypto";

export type QueueMessage<TPayload> = {
  id?: string;
  payload: TPayload;
  sendAt?: Date;
};

export type QueueHandler<TPayload> = (
  message: QueueMessage<TPayload>
) => void | Promise<void>;

export interface MessageQueue<TPayload> {
  publish(message: QueueMessage<TPayload>): Promise<void>;
  subscribe(handler: QueueHandler<TPayload>): void;
}

export function ensureMessageId<TPayload>(
  message: QueueMessage<TPayload>
): QueueMessage<TPayload> & { id: string } {
  return {
    ...message,
    id: message.id ?? randomUUID(),
  };
}
