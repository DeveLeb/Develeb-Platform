import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres('postgresql://postgres:letmein@localhost:5432/Develeb-platform');

async function main() {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: './src/drizzle/migrations',
  });

  await migrationClient.end();
}

main();
