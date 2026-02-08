import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = join(__dirname, '../templates');
const REQUIRED_FIELDS = ['name', 'slug', 'componentName'];
const RECOMMENDED_FIELDS = ['description', 'templateCategory', 'category'];

function validateManifests() {
  console.log('🔍 Validating template manifests...\n');

  let hasErrors = false;
  let hasWarnings = false;
  const results = [];

  // Get all template directories
  const entries = readdirSync(TEMPLATES_DIR, { withFileTypes: true });
  const templateDirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => !name.startsWith('.'));

  console.log(`Found ${templateDirs.length} template directories\n`);

  for (const templateDir of templateDirs) {
    const templatePath = join(TEMPLATES_DIR, templateDir);
    const manifestPath = join(templatePath, 'manifest.json');
    const indexPath = join(templatePath, 'index.tsx');

    const result = {
      template: templateDir,
      manifestPath,
      indexPath,
      errors: [],
      warnings: [],
      status: 'valid'
    };

    // Check if manifest.json exists
    if (!existsSync(manifestPath)) {
      result.errors.push('manifest.json not found');
      result.status = 'error';
      hasErrors = true;
      results.push(result);
      continue;
    }

    // Check if index.tsx exists
    if (!existsSync(indexPath)) {
      result.errors.push('index.tsx not found');
      result.status = 'error';
      hasErrors = true;
      results.push(result);
      continue;
    }

    // Parse manifest.json
    let manifest;
    try {
      const manifestContent = readFileSync(manifestPath, 'utf-8');
      manifest = JSON.parse(manifestContent);
    } catch (error) {
      result.errors.push(`Failed to parse manifest.json: ${error.message}`);
      result.status = 'error';
      hasErrors = true;
      results.push(result);
      continue;
    }

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!manifest[field] || typeof manifest[field] !== 'string' || manifest[field].trim() === '') {
        result.errors.push(`Required field "${field}" is missing or empty`);
        result.status = 'error';
        hasErrors = true;
      }
    }

    // Validate recommended fields
    for (const field of RECOMMENDED_FIELDS) {
      if (!manifest[field] || typeof manifest[field] !== 'string' || manifest[field].trim() === '') {
        result.warnings.push(`Recommended field "${field}" is missing or empty`);
        if (result.status === 'valid') {
          result.status = 'warning';
        }
        hasWarnings = true;
      }
    }

    // Validate componentName format (should be PascalCase)
    if (manifest.componentName) {
      const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(manifest.componentName);
      if (!isPascalCase) {
        result.warnings.push(`componentName "${manifest.componentName}" should be in PascalCase`);
        if (result.status === 'valid') {
          result.status = 'warning';
        }
        hasWarnings = true;
      }
    }

    // Validate slug format (should be kebab-case)
    if (manifest.slug) {
      const isKebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(manifest.slug);
      if (!isKebabCase) {
        result.warnings.push(`slug "${manifest.slug}" should be in kebab-case`);
        if (result.status === 'valid') {
          result.status = 'warning';
        }
        hasWarnings = true;
      }
    }

    // Extract actual export from index.tsx
    try {
      const indexContent = readFileSync(indexPath, 'utf-8');

      // Try to match: export default function ComponentName
      let exportMatch = indexContent.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);

      // If not found, try: export const ComponentName =
      if (!exportMatch) {
        exportMatch = indexContent.match(/export\s+const\s+([A-Za-z0-9_]+)\s*=/);
      }

      if (exportMatch && exportMatch[1]) {
        const actualExportName = exportMatch[1];
        result.actualExport = actualExportName;

        // Compare with manifest componentName
        if (manifest.componentName && manifest.componentName !== actualExportName) {
          result.errors.push(
            `componentName mismatch: manifest has "${manifest.componentName}" but index.tsx exports "${actualExportName}"`
          );
          result.status = 'error';
          hasErrors = true;
        }
      } else {
        result.warnings.push('Could not detect export statement in index.tsx');
        if (result.status === 'valid') {
          result.status = 'warning';
        }
        hasWarnings = true;
      }
    } catch (error) {
      result.errors.push(`Failed to read index.tsx: ${error.message}`);
      result.status = 'error';
      hasErrors = true;
    }

    results.push(result);
  }

  // Print results
  console.log('=' .repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(80));
  console.log('');

  for (const result of results) {
    const icon = result.status === 'valid' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${result.template}`);

    if (result.actualExport) {
      console.log(`   Export: ${result.actualExport}`);
    }

    if (result.errors.length > 0) {
      console.log('   Errors:');
      result.errors.forEach(error => console.log(`     - ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log('   Warnings:');
      result.warnings.forEach(warning => console.log(`     - ${warning}`));
    }

    console.log('');
  }

  // Summary
  const validCount = results.filter(r => r.status === 'valid').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total templates: ${results.length}`);
  console.log(`✅ Valid: ${validCount}`);
  console.log(`⚠️  Warnings: ${warningCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('');

  if (hasErrors) {
    console.error('❌ Validation failed! Please fix the errors above.');
    process.exit(1);
  } else if (hasWarnings) {
    console.warn('⚠️  Validation passed with warnings. Consider addressing them.');
    process.exit(0);
  } else {
    console.log('✅ All manifests are valid!');
    process.exit(0);
  }
}

// Run validation
validateManifests();
