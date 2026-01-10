import 'dotenv/config';
import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '.env.local',
});

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL env is missing');
}

export default defineConfig({
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL,
  },
});
