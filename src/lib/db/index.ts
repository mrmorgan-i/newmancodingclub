import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

// drizzle instance
export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

// types
export type Database = typeof db;
export { schema };
