import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import "dotenv/config";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8000),
    NODE_ENV: z
      .enum(["local", "development", "production"])
      .default("production"),

    DATABASE_URL: z.string().url(),

    DEFAULT_APPOINTMENT_DURATION: z.coerce
      .number()
      .int()
      .positive()
      .default(30),

    JWT_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),
    JWT_EXPIRES_IN: z.string().refine((x) => {
      return x.endsWith("m") || x.endsWith("h") || x.endsWith("d");
    }),
    JWT_REFRESH_EXPIRES_IN: z.string().refine((x) => {
      return x.endsWith("m") || x.endsWith("h") || x.endsWith("d");
    }),

    RESEND_API_KEY: z.string().optional(),
    TWILIO_ACCOUNT_SID: z.string().min(1).optional(),
    TWILIO_AUTH_TOKEN: z.string().min(1).optional(),
    TWILIO_FROM_NUMBER: z.string().min(1).optional(),
    TWILIO_DEFAULT_COUNTRY_CODE: z.string().min(1).default("+1"),

    REDIS_URL: z.string().url(),
    REDIS_TOKEN: z.string().min(1),
    REDIS_EXPIRES_IN_MINS: z.coerce.number().int().positive().default(5),
    NOTIFICATION_QUEUE_KEY: z
      .string()
      .min(1)
      .default("zoomies:notifications"),
    NOTIFICATION_SCHEDULED_QUEUE_KEY: z
      .string()
      .min(1)
      .default("zoomies:notifications:scheduled"),
    NOTIFICATION_WORKER_POLL_INTERVAL_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(1000),
    NOTIFICATION_SCHEDULED_BATCH_SIZE: z.coerce
      .number()
      .int()
      .positive()
      .default(50),
    APPOINTMENT_REMINDER_LEAD_MINUTES: z.coerce
      .number()
      .int()
      .positive()
      .default(60),
  },
  runtimeEnv: process.env,
});
