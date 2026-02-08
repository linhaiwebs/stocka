import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db: Database.Database | null = null;

interface TableColumn {
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

const REQUIRED_TABLES = [
  'templates',
  'admin_users',
  'traffic_links',
  'visitors',
  'page_views',
  'conversions',
  'schema_version',
  'template_seed_log',
  'site_settings'
];

const REQUIRED_COLUMNS = {
  templates: ['id', 'name', 'slug', 'html_content', 'api_key', 'is_default', 'created_at', 'updated_at', 'template_type', 'template_category', 'component_name', 'tracking_code', 'css_content', 'js_content', 'component_code'],
  visitors: ['id', 'visitor_id', 'template_id', 'traffic_link_id', 'user_agent', 'ip_address', 'referrer', 'first_visit', 'last_visit', 'page_views', 'converted', 'scroll_depth_percent', 'time_on_page_seconds', 'interaction_events', 'last_interaction_at']
};

function getCurrentSchemaVersion(database: Database.Database): number {
  try {
    const row = database.prepare('SELECT MAX(version) as version FROM schema_version').get() as { version: number | null };
    return row?.version || 0;
  } catch {
    return 0;
  }
}

function validateDatabaseStructure(database: Database.Database): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  try {
    const tables = database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
    const tableNames = tables.map(t => t.name);

    for (const requiredTable of REQUIRED_TABLES) {
      if (!tableNames.includes(requiredTable)) {
        issues.push(`Missing required table: ${requiredTable}`);
      }
    }

    for (const [tableName, requiredColumns] of Object.entries(REQUIRED_COLUMNS)) {
      if (!tableNames.includes(tableName)) continue;

      try {
        const columns = database.prepare(`PRAGMA table_info(${tableName})`).all() as TableColumn[];
        const columnNames = columns.map(c => c.name);

        for (const requiredColumn of requiredColumns) {
          if (!columnNames.includes(requiredColumn)) {
            issues.push(`Missing column '${requiredColumn}' in table '${tableName}'`);
          }
        }
      } catch (error: any) {
        issues.push(`Error checking table '${tableName}': ${error.message}`);
      }
    }

    const schemaVersion = getCurrentSchemaVersion(database);
    if (schemaVersion === 1) {
      const templatesColumns = database.prepare('PRAGMA table_info(templates)').all() as TableColumn[];
      const hasTemplateType = templatesColumns.some(c => c.name === 'template_type');

      if (!hasTemplateType) {
        issues.push('Database is at version 1 but migration 002 columns are missing');
      }
    }

  } catch (error: any) {
    issues.push(`Database validation error: ${error.message}`);
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

function getDatabasePath(): string {
  return join(process.cwd(), config.database.path);
}

export function resetDatabase(createBackup: boolean = true): void {
  const dbPath = getDatabasePath();

  if (db) {
    try {
      db.close();
    } catch (error) {
      console.warn('Warning: Error closing database:', error);
    }
    db = null;
  }

  if (existsSync(dbPath)) {
    if (createBackup) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = join(process.cwd(), config.database.backupPath);

      if (!existsSync(backupDir)) {
        mkdirSync(backupDir, { recursive: true });
      }

      const backupPath = join(backupDir, `backup-before-reset-${timestamp}.db`);

      try {
        copyFileSync(dbPath, backupPath);
        console.log(`✅ Database backed up to: ${backupPath}`);
      } catch (error) {
        console.warn('⚠️  Warning: Could not create backup:', error);
      }
    }

    try {
      unlinkSync(dbPath);
      console.log('🗑️  Old database removed');
    } catch (error) {
      console.error('❌ Error removing old database:', error);
      throw error;
    }

    const walPath = `${dbPath}-wal`;
    const shmPath = `${dbPath}-shm`;

    try {
      if (existsSync(walPath)) unlinkSync(walPath);
      if (existsSync(shmPath)) unlinkSync(shmPath);
    } catch (error) {
      console.warn('⚠️  Warning: Could not remove WAL files:', error);
    }
  }

  console.log('🔄 Database reset complete. Ready for fresh initialization.');
}

function applyMigrations(database: Database.Database): void {
  const migrationsDir = join(__dirname, 'migrations');

  if (!existsSync(migrationsDir)) {
    console.log('📁 No migrations directory found, skipping migrations');
    return;
  }

  const currentVersion = getCurrentSchemaVersion(database);
  console.log(`📊 Current database schema version: ${currentVersion}`);

  const migrationFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const versionMatch = file.match(/^(\d+)_/);
    if (!versionMatch) continue;

    const migrationVersion = parseInt(versionMatch[1]);

    if (migrationVersion <= currentVersion) {
      continue;
    }

    console.log(`⬆️  Applying migration: ${file}`);
    const migrationPath = join(migrationsDir, file);
    const migration = readFileSync(migrationPath, 'utf-8');

    const cleanedMigration = migration
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanedMigration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      for (const statement of statements) {
        try {
          database.exec(statement);
        } catch (error: any) {
          console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`);
          throw error;
        }
      }

      console.log(`✅ Migration ${file} applied successfully`);
    } catch (error) {
      console.error(`❌ Error applying migration ${file}:`, error);
      throw error;
    }
  }
}

export function initDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = join(process.cwd(), config.database.path);
  const dbDir = dirname(dbPath);

  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  const backupDir = join(process.cwd(), config.database.backupPath);
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  console.log(`🚀 Initializing SQLite database at: ${dbPath}`);

  db = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
  });

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schemaPath = join(__dirname, 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');

  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      db.exec(statement);
    } catch (error) {
      console.error('Error executing schema statement:', statement);
      throw error;
    }
  }

  console.log('✅ Database schema initialized successfully');

  applyMigrations(db);

  const validation = validateDatabaseStructure(db);
  if (!validation.valid) {
    console.error('\n⚠️  Database validation failed:');
    validation.issues.forEach(issue => console.error(`   - ${issue}`));
    console.error('\n💡 To fix this, run: npm run setup:fresh\n');
  }

  return db;
}

export async function initDatabaseWithSeeding(): Promise<Database.Database> {
  const database = initDatabase();

  // Auto-seed templates
  const autoSeedEnabled = process.env.AUTO_SEED_TEMPLATES !== 'false';

  if (autoSeedEnabled) {
    const { TemplateSeederService } = await import('../services/template-seeder.service.js');
    await TemplateSeederService.seedAllTemplates();

    // Auto-seed component code for React templates
    const autoSeedComponentCode = process.env.AUTO_SEED_COMPONENT_CODE !== 'false';
    const forceSeedComponentCode = process.env.FORCE_RESEED_COMPONENT_CODE === 'true';

    if (autoSeedComponentCode) {
      await TemplateSeederService.seedAllComponentCode(forceSeedComponentCode);
    }
  }

  // Auto-create admin user if configured and none exists
  await autoCreateAdminUser(database);

  // Auto-set default template if none exists
  await autoSetDefaultTemplate(database);

  return database;
}

async function autoCreateAdminUser(database: Database.Database): Promise<void> {
  try {
    // Check if any admin users exist
    const adminCount = database.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };

    if (adminCount.count > 0) {
      console.log('✅ Admin users already exist, skipping auto-creation');
      return;
    }

    // Check if environment variables are configured
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const email = process.env.ADMIN_EMAIL || `${username}@localhost.local`;

    if (!username || !password) {
      console.log('⚠️  ADMIN_USERNAME or ADMIN_PASSWORD not configured, skipping admin auto-creation');
      console.log('💡 To create an admin user later, set environment variables and restart, or use the setup script');
      return;
    }

    // Create the admin user
    const { AuthService } = await import('../services/auth.service.js');
    const admin = await AuthService.createAdmin(username, email, password);

    if (admin) {
      console.log('✅ Default admin user created successfully');
      console.log(`   Username: ${username}`);
      console.log(`   Email: ${email}`);
      console.log('   ⚠️  Please change the default password after first login!');
    } else {
      console.error('❌ Failed to create default admin user');
    }
  } catch (error) {
    console.error('❌ Error in autoCreateAdminUser:', error);
  }
}

async function autoSetDefaultTemplate(database: Database.Database): Promise<void> {
  try {
    // Check if a default template already exists
    const defaultTemplate = database.prepare('SELECT COUNT(*) as count FROM templates WHERE is_default = 1').get() as { count: number };

    if (defaultTemplate.count > 0) {
      console.log('✅ Default template already set');
      return;
    }

    // Check if any templates exist
    const templateCount = database.prepare('SELECT COUNT(*) as count FROM templates').get() as { count: number };

    if (templateCount.count === 0) {
      console.log('⚠️  No templates found, skipping default template setup');
      return;
    }

    // Check for environment variable to specify default template
    const defaultSlug = process.env.DEFAULT_TEMPLATE_SLUG;

    if (defaultSlug) {
      // Try to set the specified template as default
      const result = database.prepare('UPDATE templates SET is_default = 1 WHERE slug = ?').run(defaultSlug);

      if (result.changes > 0) {
        console.log(`✅ Set template '${defaultSlug}' as default`);
        return;
      } else {
        console.log(`⚠️  Template '${defaultSlug}' not found, will set first template as default`);
      }
    }

    // Set the first template as default
    const firstTemplate = database.prepare('SELECT slug FROM templates ORDER BY created_at ASC LIMIT 1').get() as { slug: string } | undefined;

    if (firstTemplate) {
      database.prepare('UPDATE templates SET is_default = 1 WHERE slug = ?').run(firstTemplate.slug);
      console.log(`✅ Set first template '${firstTemplate.slug}' as default`);
    }
  } catch (error) {
    console.error('❌ Error in autoSetDefaultTemplate:', error);
  }
}

export function getDatabase(): Database.Database {
  if (!db) {
    return initDatabase();
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}

export function backupDatabase(): string {
  const db = getDatabase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(
    process.cwd(),
    config.database.backupPath,
    `backup-${timestamp}.db`
  );

  db.backup(backupPath);
  console.log(`Database backed up to: ${backupPath}`);

  return backupPath;
}

process.on('exit', () => {
  closeDatabase();
});

process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

export default {
  initDatabase,
  initDatabaseWithSeeding,
  getDatabase,
  closeDatabase,
  backupDatabase,
  resetDatabase
};
