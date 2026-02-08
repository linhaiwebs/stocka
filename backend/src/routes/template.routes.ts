import { Router } from 'express';
import { readdirSync, existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { authenticateAdmin, authenticateTemplate, AuthRequest } from '../middleware/auth.js';
import { TemplateService } from '../services/template.service.js';
import { detectTemplateCategory } from '../utils/category-detector.js';

const router = Router();

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

router.post('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, html_content, template_type, component_name, template_category } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    if (template_category && !['input-form', 'standard', 'free'].includes(template_category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template category'
      });
    }

    if (template_type === 'react') {
      if (!component_name) {
        return res.status(400).json({
          success: false,
          error: 'Component name is required for React templates'
        });
      }

      const result = await TemplateService.create(name, '', 'react', component_name, template_category);

      if (!result.template) {
        return res.status(500).json({
          success: false,
          error: 'Failed to create template'
        });
      }

      return res.json({
        success: true,
        data: {
          template: result.template,
          api_key: result.apiKey
        }
      });
    }

    if (!html_content) {
      return res.status(400).json({
        success: false,
        error: 'HTML content is required for HTML templates'
      });
    }

    const result = await TemplateService.create(name, html_content, 'html', undefined, template_category);

    if (!result.template) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create template'
      });
    }

    res.json({
      success: true,
      data: {
        template: result.template,
        api_key: result.apiKey
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const category = req.query.category as string | undefined;

    if (category && !['input-form', 'standard', 'free'].includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category filter'
      });
    }

    const templates = await TemplateService.getAll(category);

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    const template = await TemplateService.getById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.put('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, html_content, tracking_code, component_code, template_category, page_title, page_description } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    if (template_category && !['input-form', 'standard', 'free'].includes(template_category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template category'
      });
    }

    const template = await TemplateService.update(id, name, html_content, tracking_code, component_code, template_category, page_title, page_description);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.delete('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    const success = await TemplateService.delete(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.post('/:id/regenerate-key', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    const newApiKey = await TemplateService.regenerateApiKey(id);

    if (!newApiKey) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: { api_key: newApiKey }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/render/:templateId', authenticateTemplate, async (req: AuthRequest, res) => {
  try {
    if (!req.templateId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    const template = await TemplateService.getById(req.templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: {
        html_content: template.html_content,
        name: template.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/public/default', async (req, res) => {
  try {
    const template = await TemplateService.getDefaultTemplate();

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'No default template found'
      });
    }

    res.json({
      success: true,
      data: {
        id: template.id,
        slug: template.slug,
        template_type: template.template_type || 'html',
        html_content: template.html_content,
        css_content: template.css_content || '',
        js_content: template.js_content || '',
        component_code: template.component_code || '',
        api_key: template.api_key,
        name: template.name,
        page_title: template.page_title || null,
        page_description: template.page_description || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    const template = await TemplateService.getById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: template.id,
        slug: template.slug,
        template_type: template.template_type || 'html',
        html_content: template.html_content,
        css_content: template.css_content || '',
        js_content: template.js_content || '',
        component_code: template.component_code || '',
        api_key: template.api_key,
        name: template.name,
        page_title: template.page_title || null,
        page_description: template.page_description || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.post('/:id/set-default', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    const success = await TemplateService.setDefaultTemplate(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      message: 'Template set as default successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/scan-components', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const templatesDir = getTemplateDir();
    console.log('[scan-components] Templates directory:', templatesDir);
    console.log('[scan-components] Current working directory:', process.cwd());

    if (!existsSync(templatesDir)) {
      console.log('[scan-components] Templates directory does not exist');
      return res.json({
        success: true,
        data: []
      });
    }

    const components: Array<{ componentName: string; name: string; description?: string; exists: boolean }> = [];
    const entries = readdirSync(templatesDir);
    console.log('[scan-components] Found entries:', entries);

    for (const entry of entries) {
      const entryPath = join(templatesDir, entry);

      if (!statSync(entryPath).isDirectory() || entry.startsWith('.')) {
        console.log(`[scan-components] Skipping ${entry} (not a directory or hidden)`);
        continue;
      }

      const indexPath = join(entryPath, 'index.tsx');
      if (!existsSync(indexPath)) {
        console.log(`[scan-components] Skipping ${entry} (no index.tsx found)`);
        continue;
      }

      let manifest: any = { name: entry };
      const manifestPath = join(entryPath, 'manifest.json');

      if (existsSync(manifestPath)) {
        try {
          const manifestContent = readFileSync(manifestPath, 'utf-8');
          manifest = JSON.parse(manifestContent);
        } catch (error) {
          console.warn(`[scan-components] Invalid manifest.json for ${entry}`);
        }
      }

      // Check if template already exists by component_name first, then by slug
      const existingByComponent = await TemplateService.getByComponentName(entry);
      const existingBySlug = !existingByComponent ? await TemplateService.getBySlug(entry) : null;
      const existing = existingByComponent || existingBySlug;

      console.log(`[scan-components] Component ${entry}: exists=${!!existing}`);

      components.push({
        componentName: entry,
        name: manifest.name || entry,
        description: manifest.description,
        exists: !!existing
      });
    }

    console.log(`[scan-components] Total components found: ${components.length}`);
    res.json({
      success: true,
      data: components
    });
  } catch (error) {
    console.error('[scan-components] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/debug-scan', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const templatesDir = getTemplateDir();
    const debugInfo: any = {
      cwd: process.cwd(),
      templatesDir,
      templatesDirExists: existsSync(templatesDir),
      entries: [],
      existingTemplates: []
    };

    if (existsSync(templatesDir)) {
      const allEntries = readdirSync(templatesDir, { withFileTypes: true });

      for (const dirent of allEntries) {
        const entryInfo: any = {
          name: dirent.name,
          isDirectory: dirent.isDirectory(),
          isFile: dirent.isFile(),
        };

        if (dirent.isDirectory()) {
          const dirPath = join(templatesDir, dirent.name);
          const dirContents = readdirSync(dirPath);
          entryInfo.contents = dirContents;
          entryInfo.hasIndexTsx = dirContents.includes('index.tsx');
          entryInfo.hasManifest = dirContents.includes('manifest.json');

          if (entryInfo.hasManifest) {
            try {
              const manifestPath = join(dirPath, 'manifest.json');
              const manifestContent = readFileSync(manifestPath, 'utf-8');
              entryInfo.manifest = JSON.parse(manifestContent);
            } catch (error) {
              entryInfo.manifestError = String(error);
            }
          }
        }

        debugInfo.entries.push(entryInfo);
      }
    }

    // Get all existing templates from database
    const allTemplates = await TemplateService.getAll();
    debugInfo.existingTemplates = allTemplates.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      component_name: t.component_name,
      template_type: t.template_type
    }));

    res.json({
      success: true,
      data: debugInfo
    });
  } catch (error) {
    console.error('[debug-scan] Error:', error);
    res.status(500).json({
      success: false,
      error: String(error)
    });
  }
});

router.post('/import-components', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { components } = req.body;

    if (!components || !Array.isArray(components)) {
      return res.status(400).json({
        success: false,
        error: 'Components array is required'
      });
    }

    const templatesDir = getTemplateDir();
    console.log('[import-components] Templates directory:', templatesDir);
    console.log('[import-components] Components to import:', components);

    const imported: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];

    for (const componentName of components) {
      // Check if template already exists by component_name first, then by slug
      const existingByComponent = await TemplateService.getByComponentName(componentName);
      const existingBySlug = !existingByComponent ? await TemplateService.getBySlug(componentName) : null;
      const existing = existingByComponent || existingBySlug;

      if (existing) {
        console.log(`[import-components] Skipping ${componentName} (already exists)`);
        skipped.push(componentName);
        continue;
      }

      const manifestPath = join(templatesDir, componentName, 'manifest.json');
      let manifest: any = { name: componentName };

      if (existsSync(manifestPath)) {
        try {
          const manifestContent = readFileSync(manifestPath, 'utf-8');
          manifest = JSON.parse(manifestContent);
          console.log(`[import-components] Loaded manifest for ${componentName}:`, manifest);
        } catch (error) {
          console.warn(`[import-components] Invalid manifest.json for ${componentName}`);
        }
      }

      const category = detectTemplateCategory(componentName, manifest);
      console.log(`[import-components] Creating React template for ${componentName} with category: ${category}`);

      const result = await TemplateService.createReactTemplate(
        manifest.name,
        componentName,
        manifest.description,
        undefined,
        undefined,
        category
      );

      if (result.template) {
        console.log(`[import-components] Successfully imported ${componentName} (category: ${category})`);
        imported.push(componentName);
      } else {
        console.log(`[import-components] Failed to import ${componentName}`);
        failed.push(componentName);
      }
    }

    console.log(`[import-components] Summary - Imported: ${imported.length}, Skipped: ${skipped.length}, Failed: ${failed.length}`);

    res.json({
      success: true,
      data: {
        imported,
        skipped,
        failed
      }
    });
  } catch (error) {
    console.error('[import-components] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
