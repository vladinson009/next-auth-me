import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL env is missing');
}
const sql = neon(process.env.NEON_DATABASE_URL);

const db = drizzle(sql);

export default db;
