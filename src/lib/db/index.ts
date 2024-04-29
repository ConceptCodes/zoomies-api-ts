import { drizzle } from "drizzle-orm/postgres-js";
import { type Logger } from "drizzle-orm/logger";
import postgres from "postgres";

import { env } from "@lib/env";

class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.debug("___QUERY___");
    console.debug(query);
    console.debug(params);
    console.debug("___END_QUERY___");
  }
}

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

export const db = drizzle(client, { logger: new QueryLogger() });
