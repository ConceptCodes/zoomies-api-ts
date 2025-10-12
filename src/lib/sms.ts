import twilio, { Twilio } from "twilio";

import { env } from "@lib/env";

let client: Twilio | null = null;

export function isTwilioConfigured(): boolean {
  return Boolean(
    env.TWILIO_ACCOUNT_SID &&
      env.TWILIO_AUTH_TOKEN &&
      env.TWILIO_FROM_NUMBER
  );
}

function getTwilioClient(): Twilio {
  if (!isTwilioConfigured()) {
    throw new Error("Twilio SMS is not configured");
  }

  if (!client) {
    client = twilio(env.TWILIO_ACCOUNT_SID!, env.TWILIO_AUTH_TOKEN!);
  }

  return client;
}

export async function sendSms(to: string, body: string): Promise<void> {
  const twilioClient = getTwilioClient();
  await twilioClient.messages.create({
    to,
    from: env.TWILIO_FROM_NUMBER!,
    body,
  });
}
