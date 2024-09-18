import * as dotenv from 'dotenv';

dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(process.env.DATABASE_URL as string);

async function main() {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: './src/db/migrations',
  });

  await migrationClient.end();
}

main();
