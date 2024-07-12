import * as dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres:letmein@localhost:5432/Develeb-platform',
  },
  verbose: true,
  strict: true,
});
