import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@lib/env";

const client = postgres(env.DATABASE_URL);

export async function checkDatabaseHealth() {
  try {
    await client`SELECT 1`;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const db = drizzle(client);
