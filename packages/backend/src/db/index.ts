import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

dotenv.config();

import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(client, { schema, logger: true });
