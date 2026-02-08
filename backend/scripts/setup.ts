import bcrypt from 'bcrypt';
import { initDatabaseWithSeeding, getDatabase, resetDatabase } from '../src/config/database.js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function setup() {
  const args = process.argv.slice(2);
  const shouldReset = args.includes('--reset') || args.includes('--fresh') || args.includes('-r');

  console.log('\n━'.repeat(50));
  console.log('🚀 Landing Page System Setup');
  console.log('━'.repeat(50));

  if (shouldReset) {
    console.log('\n⚠️  RESET MODE: This will delete the existing database and create a fresh one.');
    console.log('A backup will be created automatically before deletion.\n');

    const confirm = await question('Are you sure you want to continue? (yes/NO): ');

    if (confirm.toLowerCase() !== 'yes') {
      console.log('\n❌ Setup cancelled.\n');
      rl.close();
      process.exit(0);
    }

    console.log('\n🔄 Resetting database...\n');
    resetDatabase(true);
    console.log('');
  } else {
    console.log('\nThis will initialize the database and create an admin user.\n');
  }

  try {
    await initDatabaseWithSeeding();

    const db = getDatabase();
    const existingAdmin = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };

    if (existingAdmin.count > 0) {
      console.log('\n✅ Admin user(s) already exist. Skipping admin creation.\n');
      const createAnother = await question('Do you want to create another admin user? (y/N): ');

      if (createAnother.toLowerCase() !== 'y' && createAnother.toLowerCase() !== 'yes') {
        console.log('\n✨ Setup complete!\n');
        rl.close();
        process.exit(0);
      }
    }

    console.log('━'.repeat(50));
    console.log('Create Admin User');
    console.log('━'.repeat(50));
    console.log();

    const username = await question('Username: ');
    if (!username) {
      console.log('\n❌ Username is required\n');
      rl.close();
      process.exit(1);
    }

    const email = await question('Email: ');
    if (!email || !email.includes('@')) {
      console.log('\n❌ Valid email is required\n');
      rl.close();
      process.exit(1);
    }

    const password = await question('Password (min 8 characters): ');
    if (!password || password.length < 8) {
      console.log('\n❌ Password must be at least 8 characters long\n');
      rl.close();
      process.exit(1);
    }

    const confirmPassword = await question('Confirm Password: ');
    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match\n');
      rl.close();
      process.exit(1);
    }

    const existingUser = db.prepare('SELECT email FROM admin_users WHERE email = ? OR username = ?').get(email, username);

    if (existingUser) {
      console.log(`\n❌ User with email "${email}" or username "${username}" already exists\n`);
      rl.close();
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insert = db.prepare(`
      INSERT INTO admin_users (username, email, password_hash)
      VALUES (?, ?, ?)
    `);

    const result = insert.run(username, email, passwordHash);

    const newUser = db.prepare('SELECT id, username, email, created_at FROM admin_users WHERE id = ?').get(result.lastInsertRowid) as any;

    console.log('\n✅ Admin user created successfully!\n');
    console.log('User Details:');
    console.log('━'.repeat(50));
    console.log(`  ID:       ${newUser.id}`);
    console.log(`  Username: ${newUser.username}`);
    console.log(`  Email:    ${newUser.email}`);
    console.log(`  Created:  ${newUser.created_at}`);
    console.log('━'.repeat(50));

    console.log('\n✨ Setup complete! You can now start the server with: npm run dev\n');

    rl.close();
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Setup failed:', err.message);

    if (!shouldReset && (err.message.includes('migration') || err.message.includes('column') || err.message.includes('table'))) {
      console.error('\n💡 The database may be in an inconsistent state.');
      console.error('   Try running: npm run setup:fresh\n');
    } else {
      console.error('');
    }

    rl.close();
    process.exit(1);
  }
}

setup();
