import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined. Add it to your environment before starting the app.');
}

const rawNeon = neon(process.env.DATABASE_URL);
const sqlClient: any = (query: string, params: any[], options: any) =>
  rawNeon.query(query, params, options);

export const db = drizzle(sqlClient, { schema });

