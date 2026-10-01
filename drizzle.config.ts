import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env.local");
}

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;