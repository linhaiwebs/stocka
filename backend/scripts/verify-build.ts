import { existsSync } from 'fs';
import { join } from 'path';

const REQUIRED_FILES = [
  'dist/server.js',
  'dist/config/schema.sql',
  'dist/config/migrations/002_enhanced_tracking.sql',
  'dist/config/migrations/003_add_css_js_content.sql',
  'dist/config/migrations/004_add_site_settings.sql',
  'dist/config/migrations/005_add_google_analytics_settings.sql',
  'dist/config/migrations/006_add_link_slug.sql',
  'dist/config/migrations/007_fix_react_template_slugs.sql',
  'dist/config/migrations/008_add_component_code.sql'
];

console.log('🔍 Verifying build output...\n');

let allFilesExist = true;

for (const file of REQUIRED_FILES) {
  const filePath = join(process.cwd(), file);
  const exists = existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
}

console.log('');

if (allFilesExist) {
  console.log('✅ All required files present!');
  process.exit(0);
} else {
  console.error('❌ Some required files are missing!');
  console.error('\nThis will cause database initialization to fail.');
  console.error('Please check the build process.');
  process.exit(1);
}
