import { Redis } from "@upstash/redis";
import { env } from "./env";
import { Nullable } from "global";

let redis: Nullable<Redis> = null;

export async function connectToRedis() {
  if (redis) return;
  redis = new Redis({ url: env.REDIS_URL, token: env.REDIS_TOKEN });
}

export const set = async (key: string, value: string) => {
  try {
    await redis?.set(key, value, {
      ex: env.REDIS_EXPIRES_IN_MINS * 60,
    });
  } catch (err) {
    throw err;
  }
};

export const get = async (key: string) => {
  try {
    return await redis?.get(key);
  } catch (err) {
    throw err;
  }
};
