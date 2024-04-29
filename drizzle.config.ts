import type { Config } from 'drizzle-kit'
import { env } from './src/lib/env'

export default {
  schema: 'src/lib/db/schema.ts',
  out: 'src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  breakpoints: true,
} satisfies Config