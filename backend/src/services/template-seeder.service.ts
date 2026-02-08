import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from '../config/database.js';
import { TemplateService } from './template.service.js';
import { createHash } from 'crypto';
import { detectTemplateCategory } from '../utils/category-detector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TemplateMetadata {
  name?: string;
  description?: string;
  version?: string;
  category?: string;
}

interface ReactManifest {
  name: string;
  slug: string;
  componentName: string;
  description?: string;
  version?: string;
  category?: string;
  templateCategory?: 'input-form' | 'standard' | 'free';
  hasInputFields?: boolean;
  conversionType?: string;
  isDefault?: boolean;
  tags?: string[];
  author?: string;
}

interface SeedResult {
  imported: number;
  updated: number;
  skipped: number;
  failed: number;
  details: {
    filename: string;
    status: 'imported' | 'updated' | 'skipped' | 'failed';
    templateId?: number;
    apiKey?: string;
    error?: string;
  }[];
}

export class TemplateSeederService {
  private static getTemplateDir(): string {
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

  private static templateDir = TemplateSeederService.getTemplateDir();

  /**
   * Calculate SHA256 hash of file content
   */
  private static calculateHash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Extract metadata from HTML comments at the top of template files
   * Format:
   * <!--
   *   Template-Name: My Template
   *   Template-Description: A description
   *   Template-Version: 1.0.0
   *   Template-Category: Finance
   * -->
   */
  private static extractMetadata(htmlContent: string): TemplateMetadata {
    const metadata: TemplateMetadata = {};

    const commentMatch = htmlContent.match(/<!--([\s\S]*?)-->/);
    if (commentMatch) {
      const commentContent = commentMatch[1];

      const nameMatch = commentContent.match(/Template-Name:\s*(.+)/i);
      if (nameMatch) metadata.name = nameMatch[1].trim();

      const descMatch = commentContent.match(/Template-Description:\s*(.+)/i);
      if (descMatch) metadata.description = descMatch[1].trim();

      const versionMatch = commentContent.match(/Template-Version:\s*(.+)/i);
      if (versionMatch) metadata.version = versionMatch[1].trim();

      const categoryMatch = commentContent.match(/Template-Category:\s*(.+)/i);
      if (categoryMatch) metadata.category = categoryMatch[1].trim();
    }

    return metadata;
  }

  /**
   * Generate template name from filename if no metadata found
   */
  private static generateNameFromFilename(filename: string): string {
    return filename
      .replace('.html', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Check if template already exists in database by slug
   */
  private static async templateExists(slug: string): Promise<number | null> {
    try {
      const db = getDatabase();
      const template = db.prepare('SELECT id FROM templates WHERE slug = ?').get(slug) as { id: number } | undefined;
      return template ? template.id : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored hash for a template
   */
  private static getStoredHash(templateId: number): string | null {
    try {
      const db = getDatabase();
      const result = db.prepare('SELECT content_hash FROM template_seed_log WHERE template_id = ?').get(templateId) as { content_hash: string } | undefined;
      return result ? result.content_hash : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store or update template seed log
   */
  private static updateSeedLog(templateId: number, filename: string, contentHash: string): void {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO template_seed_log (template_id, filename, content_hash, seeded_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(template_id) DO UPDATE SET
          filename = excluded.filename,
          content_hash = excluded.content_hash,
          seeded_at = CURRENT_TIMESTAMP
      `);
      stmt.run(templateId, filename, contentHash);
    } catch (error) {
      console.error('Error updating seed log:', error);
    }
  }

  /**
   * Check if a directory contains a React component (has index.tsx and manifest.json)
   */
  private static isReactComponent(dirPath: string): boolean {
    try {
      const indexPath = join(dirPath, 'index.tsx');
      const manifestPath = join(dirPath, 'manifest.json');
      return existsSync(indexPath) && existsSync(manifestPath);
    } catch {
      return false;
    }
  }

  /**
   * Read and validate React component manifest
   */
  private static readReactManifest(dirPath: string): ReactManifest | null {
    try {
      const manifestPath = join(dirPath, 'manifest.json');
      const manifestContent = readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent) as ReactManifest;

      const missingFields: string[] = [];
      if (!manifest.name || manifest.name.trim() === '') missingFields.push('name');
      if (!manifest.slug || manifest.slug.trim() === '') missingFields.push('slug');
      if (!manifest.componentName || manifest.componentName.trim() === '') missingFields.push('componentName');

      if (missingFields.length > 0) {
        console.error(`  │  └─ ⚠️  Invalid manifest at ${manifestPath}:`);
        console.error(`  │      └─ Missing required fields: ${missingFields.join(', ')}`);
        console.error(`  │      └─ Current manifest has: ${Object.keys(manifest).join(', ')}`);
        console.error(`  │      └─ Fix: Add the missing fields to the manifest.json file`);
        console.error(`  │      └─ Example: "componentName": "YourComponentName"`);
        return null;
      }

      return manifest;
    } catch (error) {
      console.error(`  │  └─ ❌ Failed to read manifest.json at ${dirPath}:`, error instanceof Error ? error.message : 'Unknown error');
      if (error instanceof SyntaxError) {
        console.error(`  │      └─ This is likely a JSON parsing error. Check for syntax errors in manifest.json`);
      }
      return null;
    }
  }

  /**
   * Check if React component exists by component_name or slug
   */
  private static async reactComponentExists(componentName: string, slug: string): Promise<number | null> {
    try {
      const db = getDatabase();

      let template = db.prepare('SELECT id FROM templates WHERE component_name = ? AND template_type = ?').get(componentName, 'react') as { id: number } | undefined;

      if (template) {
        return template.id;
      }

      template = db.prepare('SELECT id FROM templates WHERE slug = ?').get(slug) as { id: number } | undefined;
      return template ? template.id : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Seed a single React component
   */
  private static async seedReactComponent(dirname: string, force: boolean = false): Promise<SeedResult['details'][0]> {
    try {
      const dirPath = join(this.templateDir, dirname);
      const manifest = this.readReactManifest(dirPath);

      if (!manifest) {
        return {
          filename: dirname,
          status: 'failed',
          error: 'Invalid or missing manifest.json'
        };
      }

      const manifestPath = join(dirPath, 'manifest.json');
      const manifestContent = readFileSync(manifestPath, 'utf-8');
      const contentHash = this.calculateHash(manifestContent);

      const detectedCategory = detectTemplateCategory(manifest.componentName, manifest);
      console.log(`  │  └─ 📂 Detected category for ${dirname}: ${detectedCategory}`);

      const existingTemplateId = await this.reactComponentExists(manifest.componentName, manifest.slug);

      if (existingTemplateId) {
        const storedHash = this.getStoredHash(existingTemplateId);

        if (!force && storedHash === contentHash) {
          return {
            filename: dirname,
            status: 'skipped',
            templateId: existingTemplateId
          };
        }

        const db = getDatabase();
        const updateStmt = db.prepare(`
          UPDATE templates
          SET name = ?,
              slug = ?,
              component_name = ?,
              html_content = ?,
              template_category = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);

        updateStmt.run(manifest.name, manifest.slug, manifest.componentName, manifest.description || '', detectedCategory, existingTemplateId);

        this.updateSeedLog(existingTemplateId, dirname, contentHash);

        return {
          filename: dirname,
          status: 'updated',
          templateId: existingTemplateId
        };
      } else {
        const result = await TemplateService.createReactTemplate(
          manifest.name,
          manifest.componentName,
          manifest.description,
          undefined,
          manifest.slug,
          detectedCategory
        );

        if (result.template && result.apiKey) {
          this.updateSeedLog(result.template.id, dirname, contentHash);
          return {
            filename: dirname,
            status: 'imported',
            templateId: result.template.id,
            apiKey: result.apiKey
          };
        } else {
          return {
            filename: dirname,
            status: 'failed',
            error: 'Failed to create React template'
          };
        }
      }
    } catch (error) {
      return {
        filename: dirname,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Seed a single template file
   */
  private static async seedTemplate(filename: string, force: boolean = false): Promise<SeedResult['details'][0]> {
    try {
      const filePath = join(this.templateDir, filename);
      const htmlContent = readFileSync(filePath, 'utf-8');
      const contentHash = this.calculateHash(htmlContent);

      const metadata = this.extractMetadata(htmlContent);
      const templateName = metadata.name || this.generateNameFromFilename(filename);
      const slug = TemplateService.generateSlug(templateName);

      const existingTemplateId = await this.templateExists(slug);

      if (existingTemplateId) {
        const storedHash = this.getStoredHash(existingTemplateId);

        if (!force && storedHash === contentHash) {
          return {
            filename,
            status: 'skipped',
            templateId: existingTemplateId
          };
        }

        const updatedTemplate = await TemplateService.update(existingTemplateId, templateName, htmlContent);

        if (updatedTemplate) {
          this.updateSeedLog(existingTemplateId, filename, contentHash);
          return {
            filename,
            status: 'updated',
            templateId: existingTemplateId
          };
        } else {
          return {
            filename,
            status: 'failed',
            error: 'Failed to update template'
          };
        }
      } else {
        const result = await TemplateService.create(templateName, htmlContent);

        if (result.template && result.apiKey) {
          this.updateSeedLog(result.template.id, filename, contentHash);
          return {
            filename,
            status: 'imported',
            templateId: result.template.id,
            apiKey: result.apiKey
          };
        } else {
          return {
            filename,
            status: 'failed',
            error: 'Failed to create template'
          };
        }
      }
    } catch (error) {
      return {
        filename,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Scan templates directory and seed all HTML files and React components
   */
  static async seedAllTemplates(force: boolean = false): Promise<SeedResult> {
    const result: SeedResult = {
      imported: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      details: []
    };

    try {
      console.log(`\n📁 Template directory: ${this.templateDir}`);
      console.log(`  └─ Working directory: ${process.cwd()}`);

      if (!existsSync(this.templateDir)) {
        console.log('⚠️  Templates directory not found at:', this.templateDir);
        console.log('   Skipping template seeding\n');
        return result;
      }

      const files = readdirSync(this.templateDir);

      const htmlFiles = files.filter(file => {
        const filePath = join(this.templateDir, file);
        return statSync(filePath).isFile() && file.endsWith('.html');
      });

      const reactDirs = files.filter(file => {
        const filePath = join(this.templateDir, file);
        if (!statSync(filePath).isDirectory()) return false;
        if (file.startsWith('.') || file === 'node_modules') return false;
        return this.isReactComponent(filePath);
      });

      if (htmlFiles.length === 0 && reactDirs.length === 0) {
        console.log('⚠️  No templates found in templates/ directory');
        return result;
      }

      console.log(`\n📦 Scanning templates directory...`);
      console.log(`  ├─ Found ${htmlFiles.length} HTML template file(s)`);
      console.log(`  ├─ Found ${reactDirs.length} React component(s)\n`);

      if (htmlFiles.length > 0) {
        console.log(`HTML Templates:`);
        for (const file of htmlFiles) {
          const seedResult = await this.seedTemplate(file, force);
          result.details.push(seedResult);

          switch (seedResult.status) {
            case 'imported':
              result.imported++;
              console.log(`  ├─ 📥 Imported: ${file}`);
              console.log(`  │  └─ Template ID: ${seedResult.templateId}, API Key: ${seedResult.apiKey}`);
              break;
            case 'updated':
              result.updated++;
              console.log(`  ├─ 🔄 Updated: ${file}`);
              console.log(`  │  └─ Template ID: ${seedResult.templateId}`);
              break;
            case 'skipped':
              result.skipped++;
              console.log(`  ├─ ⏭️  Skipped: ${file} (no changes)`);
              break;
            case 'failed':
              result.failed++;
              console.log(`  ├─ ❌ Failed: ${file}`);
              console.log(`  │  └─ Error: ${seedResult.error}`);
              break;
          }
        }
        console.log('');
      }

      if (reactDirs.length > 0) {
        console.log(`React Components:`);
        for (const dir of reactDirs) {
          const seedResult = await this.seedReactComponent(dir, force);
          result.details.push(seedResult);

          const manifest = this.readReactManifest(join(this.templateDir, dir));

          switch (seedResult.status) {
            case 'imported':
              result.imported++;
              console.log(`  ├─ 📥 Imported: ${dir}`);
              console.log(`  │  └─ Component: ${manifest?.componentName || 'Unknown'}, Template ID: ${seedResult.templateId}, API Key: ${seedResult.apiKey}`);
              break;
            case 'updated':
              result.updated++;
              console.log(`  ├─ 🔄 Updated: ${dir}`);
              console.log(`  │  └─ Component: ${manifest?.componentName || 'Unknown'}, Template ID: ${seedResult.templateId}`);
              break;
            case 'skipped':
              result.skipped++;
              console.log(`  ├─ ⏭️  Skipped: ${dir} (no changes)`);
              break;
            case 'failed':
              result.failed++;
              console.log(`  ├─ ❌ Failed: ${dir}`);
              console.log(`  │  └─ Error: ${seedResult.error}`);
              break;
          }
        }
        console.log('');
      }

      console.log(`📊 Summary:`);
      console.log(`  ├─ Imported: ${result.imported}`);
      console.log(`  ├─ Updated: ${result.updated}`);
      console.log(`  ├─ Skipped: ${result.skipped}`);
      console.log(`  └─ Failed: ${result.failed}\n`);

      if (result.imported > 0 || result.updated > 0 || result.skipped > 0) {
        const db = getDatabase();
        const totalTemplates = db.prepare('SELECT COUNT(*) as count FROM templates').get() as { count: number };
        console.log(`✅ ${totalTemplates.count} template(s) available in database\n`);
      }

    } catch (error) {
      console.error('❌ Error scanning templates directory:', error);
      result.failed++;
    }

    return result;
  }

  /**
   * Seed component code for all React templates
   * This reads the index.tsx file content and stores it in the component_code field
   */
  static async seedAllComponentCode(force: boolean = false): Promise<SeedResult> {
    const result: SeedResult = {
      imported: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      details: []
    };

    try {
      console.log(`\n🔄 Seeding component code for React templates...`);

      if (!existsSync(this.templateDir)) {
        console.log('⚠️  Templates directory not found at:', this.templateDir);
        console.log('   Skipping component code seeding\n');
        return result;
      }

      const db = getDatabase();

      const reactTemplates = db.prepare(`
        SELECT id, name, slug, component_name
        FROM templates
        WHERE template_type = 'react'
      `).all() as Array<{ id: number; name: string; slug: string; component_name: string }>;

      if (reactTemplates.length === 0) {
        console.log('⚠️  No React templates found in database\n');
        return result;
      }

      console.log(`  ├─ Found ${reactTemplates.length} React template(s) in database\n`);

      for (const template of reactTemplates) {
        const possibleNames = [
          template.slug,
          template.component_name,
          template.name.toLowerCase().replace(/\s+/g, '-')
        ];

        let componentPath: string | null = null;
        let componentDir: string | null = null;

        for (const name of possibleNames) {
          const testPath = join(this.templateDir, name);
          if (existsSync(testPath)) {
            componentDir = name;
            const testComponentPath = join(testPath, 'index.tsx');
            if (existsSync(testComponentPath)) {
              componentPath = testComponentPath;
              break;
            }
          }
        }

        if (!componentPath || !existsSync(componentPath)) {
          result.failed++;
          result.details.push({
            filename: template.name,
            status: 'failed',
            templateId: template.id,
            error: `Component file not found (tried: ${possibleNames.join(', ')})`
          });
          console.log(`  ├─ ❌ ${template.name}: Component file not found`);
          continue;
        }

        try {
          const componentCode = readFileSync(componentPath, 'utf-8');
          const codeHash = this.calculateHash(componentCode);

          const currentCode = db.prepare('SELECT component_code FROM templates WHERE id = ?').get(template.id) as { component_code: string | null } | undefined;

          if (!force && currentCode?.component_code) {
            const currentHash = this.calculateHash(currentCode.component_code);
            if (currentHash === codeHash) {
              result.skipped++;
              result.details.push({
                filename: template.name,
                status: 'skipped',
                templateId: template.id
              });
              console.log(`  ├─ ⏭️  ${template.name}: No changes`);
              continue;
            }
          }

          const updateStmt = db.prepare(`
            UPDATE templates
            SET component_code = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `);

          updateStmt.run(componentCode, template.id);

          result.updated++;
          result.details.push({
            filename: template.name,
            status: 'updated',
            templateId: template.id
          });
          console.log(`  ├─ ✅ ${template.name}: Updated (${(componentCode.length / 1024).toFixed(2)} KB)`);
        } catch (error) {
          result.failed++;
          result.details.push({
            filename: template.name,
            status: 'failed',
            templateId: template.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.log(`  ├─ ❌ ${template.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      console.log('');
      console.log(`📊 Component Code Summary:`);
      console.log(`  ├─ Updated: ${result.updated}`);
      console.log(`  ├─ Skipped: ${result.skipped}`);
      console.log(`  └─ Failed: ${result.failed}\n`);

      if (result.updated > 0) {
        console.log(`✅ Component code seeding complete!\n`);
      }

    } catch (error) {
      console.error('❌ Error seeding component code:', error);
      result.failed++;
    }

    return result;
  }
}
