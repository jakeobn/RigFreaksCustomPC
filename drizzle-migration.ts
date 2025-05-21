import { db } from './server/db';
import * as schema from './shared/schema';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

// This script will automatically generate migrations based on your schema
// and run them on your database
async function main() {
  console.log('Migrating database...');
  
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  
  console.log('Migration completed successfully!');
}

main().catch((e) => {
  console.error('Migration failed');
  console.error(e);
  process.exit(1);
});