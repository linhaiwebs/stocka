import { getDatabase } from '../src/config/database.js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

function getTemplateDir(): string {
  if (process.env.TEMPLATES_DIR) {
    return process.env.TEMPLATES_DIR;
  }

  const possiblePaths = [
    join(process.cwd(), 'templates'),
    join(process.cwd(), '..', 'templates'),
    '/app/templates'
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return join(process.cwd(), '..', 'templates');
}

async function seedComponentCode() {
  console.log('\n━'.repeat(50));
  console.log('🔄 Seeding Component Code for React Templates');
  console.log('━'.repeat(50));
  console.log();

  const db = getDatabase();
  const templatesDir = getTemplateDir();

  console.log(`📁 Templates directory: ${templatesDir}`);
  console.log();

  if (!existsSync(templatesDir)) {
    console.error('❌ Templates directory does not exist');
    process.exit(1);
  }

  // Get all React templates from database
  const reactTemplates = db.prepare(`
    SELECT id, name, slug, component_name
    FROM templates
    WHERE template_type = 'react'
  `).all() as Array<{ id: number; name: string; slug: string; component_name: string }>;

  console.log(`📊 Found ${reactTemplates.length} React template(s) in database`);
  console.log();

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const template of reactTemplates) {
    console.log(`Processing: ${template.name} (${template.component_name})`);

    // Try to find the component directory using various naming strategies
    const possibleNames = [
      template.component_name,
      template.slug,
      template.name.toLowerCase().replace(/\s+/g, '-')
    ];

    let componentPath: string | null = null;
    let componentDir: string | null = null;

    for (const name of possibleNames) {
      const testPath = join(templatesDir, name);
      if (existsSync(testPath)) {
        componentDir = name;
        componentPath = join(testPath, 'index.tsx');
        if (existsSync(componentPath)) {
          break;
        }
        componentPath = null;
      }
    }

    if (!componentPath || !existsSync(componentPath)) {
      console.log(`  ⚠️  Component file not found (tried: ${possibleNames.join(', ')})`);
      failed++;
      console.log();
      continue;
    }

    try {
      // Read the component code
      const componentCode = readFileSync(componentPath, 'utf-8');

      // Update the database
      const updateStmt = db.prepare(`
        UPDATE templates
        SET component_code = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      updateStmt.run(componentCode, template.id);

      console.log(`  ✅ Updated with code from: ${componentDir}/index.tsx`);
      console.log(`  📏 Code size: ${(componentCode.length / 1024).toFixed(2)} KB`);
      updated++;
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      failed++;
    }

    console.log();
  }

  console.log('━'.repeat(50));
  console.log('📊 Summary:');
  console.log(`  ✅ Updated: ${updated}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log('━'.repeat(50));
  console.log();

  if (updated > 0) {
    console.log('✨ Component code seeding complete!');
    console.log('💡 React templates can now be dynamically modified in the database.');
  }

  console.log();
  process.exit(0);
}

seedComponentCode().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
