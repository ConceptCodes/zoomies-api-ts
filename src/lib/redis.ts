import { Redis } from "@upstash/redis";
import { env } from "./env";
import { Nullable } from "global";

let redis: Nullable<Redis> = null;

export async function connectToRedis() {
  if (redis) return;
  redis = new Redis({ url: env.REDIS_URL, token: env.REDIS_TOKEN });
  console.log("Connected to Redis");
}

export const set = async (key: string, value: string) => {
  try {
    await redis?.set(key, value, {
      ex: env.REDIS_EXPIRES_IN_MINS * 60,
    });
    console.log(`Set key: ${key}`);
  } catch (err) {
    throw err;
  }
};

export const get = async (key: string) => {
  try {
    console.log(`Get key: ${key}`);
    return await redis?.get(key);
  } catch (err) {
    throw err;
  }
};

export function getRedisClient(): Redis {
  if (!redis) {
    throw new Error("Redis client not initialized. Call connectToRedis first.");
  }

  return redis;
}
