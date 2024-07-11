/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres('postgresql://postgres:letmein@localhost:5432/Develeb-platform');
export const db = drizzle(client, { schema, logger: true });
