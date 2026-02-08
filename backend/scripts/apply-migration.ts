import { initDatabaseWithSeeding, resetDatabase } from '../src/config/database.js';

async function applyMigration() {
  console.log('\n🔄 Resetting database and applying migrations...\n');

  try {
    // Reset database and create backup
    resetDatabase(true);

    // Initialize database with seeding
    await initDatabaseWithSeeding();

    console.log('\n✅ Migration applied successfully and templates seeded!\n');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

applyMigration();
