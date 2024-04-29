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

    DEFAULT_APPOINTMENT_DURATION: z.coerce.number().int().positive(),

    JWT_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),
    JWT_EXPIRES_IN: z.string().refine((x) => {
      return x.endsWith("m") || x.endsWith("h") || x.endsWith("d");
    }),
    JWT_REFRESH_EXPIRES_IN: z.string().refine((x) => {
      return x.endsWith("m") || x.endsWith("h") || x.endsWith("d");
    }),

    RESEND_API_KEY: z.string().optional(),

    REDIS_URL: z.string().url(),
    REDIS_TOKEN: z.string().min(1),
    REDIS_EXPIRES_IN_MINS: z.coerce.number().int().positive(),
  },
  runtimeEnv: process.env,
});
