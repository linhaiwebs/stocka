import bcrypt from 'bcrypt';
import { getDatabase, initDatabase } from '../src/config/database.js';

async function createAdmin() {
  const username = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];

  if (!username || !email || !password) {
    console.log('\n❌ Missing required arguments\n');
    console.log('Usage: npm run create-admin <username> <email> <password>');
    console.log('Example: npm run create-admin admin admin@example.com SecurePass123!\n');
    process.exit(1);
  }

  if (password.length < 8) {
    console.log('\n❌ Password must be at least 8 characters long\n');
    process.exit(1);
  }

  try {
    initDatabase();
    const db = getDatabase();

    const existingUser = db.prepare('SELECT email FROM admin_users WHERE email = ? OR username = ?').get(email, username);

    if (existingUser) {
      console.error(`\n❌ User with email "${email}" or username "${username}" already exists\n`);
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
    console.log('\n✨ You can now login with these credentials\n');

    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Error:', err.message, '\n');
    process.exit(1);
  }
}

createAdmin();
