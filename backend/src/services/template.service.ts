import { getDatabase } from '../config/database.js';
import { Template } from '../types/index.js';
import { nanoid } from 'nanoid';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { HTMLParser } from '../utils/html-parser.js';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export class TemplateService {
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static generateApiKey(): string {
    return `lp_${nanoid(32)}`;
  }

  static sanitizeHTML(html: string): string {
    return purify.sanitize(html, {
      ALLOWED_TAGS: ['div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'strong', 'em', 'b', 'i', 'u', 'section', 'article', 'header', 'footer', 'nav', 'button', 'form', 'input', 'label', 'textarea', 'select', 'option', 'main', 'aside', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'canvas', 'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel', 'type', 'name', 'value', 'placeholder', 'width', 'height', 'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'data-conversion-trigger', 'data-traffic-link-id']
    });
  }

  static async create(
    name: string,
    html_content: string,
    template_type: 'html' | 'react' = 'html',
    component_name?: string,
    template_category?: 'input-form' | 'standard' | 'free'
  ): Promise<{ template: Template | null; apiKey: string | null }> {
    try {
      const db = getDatabase();

      const slug = this.generateSlug(name);
      const apiKey = this.generateApiKey();
      const category = template_category || 'input-form';

      if (template_type === 'react') {
        const insert = db.prepare(`
          INSERT INTO templates (name, slug, html_content, template_type, template_category, component_name, api_key)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const result = insert.run(
          name,
          slug,
          '',
          'react',
          category,
          component_name || slug,
          apiKey
        );

        const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(result.lastInsertRowid) as Template;
        return { template, apiKey };
      }

      const parsed = HTMLParser.parse(html_content);
      const sanitizedHtml = this.sanitizeHTML(parsed.html);

      const insert = db.prepare(`
        INSERT INTO templates (name, slug, html_content, css_content, js_content, api_key, template_type, template_category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(name, slug, sanitizedHtml, parsed.css, parsed.js, apiKey, 'html', category);

      const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(result.lastInsertRowid) as Template;

      return { template, apiKey };
    } catch (error) {
      console.error('Error creating template:', error);
      return { template: null, apiKey: null };
    }
  }

  static async createReactTemplate(
    name: string,
    componentName: string,
    description?: string,
    tracking_code?: string,
    customSlug?: string,
    template_category?: 'input-form' | 'standard' | 'free'
  ): Promise<{ template: Template | null; apiKey: string | null }> {
    try {
      const db = getDatabase();

      const slug = customSlug || this.generateSlug(componentName);
      const apiKey = this.generateApiKey();
      const category = template_category || 'input-form';

      const insert = db.prepare(`
        INSERT INTO templates (name, slug, html_content, template_type, template_category, component_name, api_key, tracking_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        name,
        slug,
        description || '',
        'react',
        category,
        componentName,
        apiKey,
        tracking_code || null
      );

      const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(result.lastInsertRowid) as Template;

      return { template, apiKey };
    } catch (error) {
      console.error('Error creating React template:', error);
      return { template: null, apiKey: null };
    }
  }

  static async getAll(category?: string): Promise<Template[]> {
    try {
      const db = getDatabase();

      if (category && ['input-form', 'standard', 'free'].includes(category)) {
        const templates = db.prepare('SELECT * FROM templates WHERE template_category = ? ORDER BY updated_at DESC').all(category) as Template[];
        return templates;
      }

      const templates = db.prepare('SELECT * FROM templates ORDER BY updated_at DESC').all() as Template[];
      return templates;
    } catch (error) {
      console.error('Error getting all templates:', error);
      return [];
    }
  }

  static async getByCategory(category: 'input-form' | 'standard' | 'free'): Promise<Template[]> {
    try {
      const db = getDatabase();
      const templates = db.prepare('SELECT * FROM templates WHERE template_category = ? ORDER BY updated_at DESC').all(category) as Template[];
      return templates;
    } catch (error) {
      console.error('Error getting templates by category:', error);
      return [];
    }
  }

  static async getById(id: number): Promise<Template | null> {
    try {
      const db = getDatabase();
      const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(id) as Template | undefined;
      return template || null;
    } catch (error) {
      console.error('Error getting template by id:', error);
      return null;
    }
  }

  static async getBySlug(slug: string): Promise<Template | null> {
    try {
      const db = getDatabase();
      const template = db.prepare('SELECT * FROM templates WHERE slug = ?').get(slug) as Template | undefined;
      return template || null;
    } catch (error) {
      console.error('Error getting template by slug:', error);
      return null;
    }
  }

  static async getByComponentName(componentName: string): Promise<Template | null> {
    try {
      const db = getDatabase();
      const template = db.prepare('SELECT * FROM templates WHERE component_name = ?').get(componentName) as Template | undefined;
      return template || null;
    } catch (error) {
      console.error('Error getting template by component name:', error);
      return null;
    }
  }

  static async getByApiKey(apiKey: string): Promise<Template | null> {
    try {
      const db = getDatabase();
      const template = db.prepare('SELECT * FROM templates WHERE api_key = ?').get(apiKey) as Template | undefined;
      return template || null;
    } catch (error) {
      console.error('Error getting template by API key:', error);
      return null;
    }
  }

  static async update(id: number, name?: string, html_content?: string, tracking_code?: string, component_code?: string, template_category?: 'input-form' | 'standard' | 'free', page_title?: string, page_description?: string): Promise<Template | null> {
    try {
      const db = getDatabase();
      const updates: string[] = [];
      const values: any[] = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
        updates.push('slug = ?');
        values.push(this.generateSlug(name));
      }

      if (html_content) {
        const parsed = HTMLParser.parse(html_content);
        const sanitizedHtml = this.sanitizeHTML(parsed.html);

        updates.push('html_content = ?');
        values.push(sanitizedHtml);
        updates.push('css_content = ?');
        values.push(parsed.css);
        updates.push('js_content = ?');
        values.push(parsed.js);
      }

      if (tracking_code !== undefined) {
        updates.push('tracking_code = ?');
        values.push(tracking_code);
      }

      if (component_code !== undefined) {
        updates.push('component_code = ?');
        values.push(component_code);
      }

      if (template_category !== undefined) {
        updates.push('template_category = ?');
        values.push(template_category);
      }

      if (page_title !== undefined) {
        updates.push('page_title = ?');
        values.push(page_title || null);
      }

      if (page_description !== undefined) {
        updates.push('page_description = ?');
        values.push(page_description || null);
      }

      if (updates.length === 0) {
        return this.getById(id);
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const updateStmt = db.prepare(`
        UPDATE templates
        SET ${updates.join(', ')}
        WHERE id = ?
      `);

      updateStmt.run(...values);

      return this.getById(id);
    } catch (error) {
      console.error('Error updating template:', error);
      return null;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const deleteStmt = db.prepare('DELETE FROM templates WHERE id = ?');
      deleteStmt.run(id);
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }

  static async regenerateApiKey(id: number): Promise<string | null> {
    try {
      const db = getDatabase();
      const newApiKey = this.generateApiKey();

      const updateStmt = db.prepare(`
        UPDATE templates
        SET api_key = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      updateStmt.run(newApiKey, id);

      return newApiKey;
    } catch (error) {
      console.error('Error regenerating API key:', error);
      return null;
    }
  }

  static async getDefaultTemplate(): Promise<Template | null> {
    try {
      const db = getDatabase();
      const template = db.prepare('SELECT * FROM templates WHERE is_default = 1 LIMIT 1').get() as Template | undefined;

      if (!template) {
        const firstTemplate = db.prepare('SELECT * FROM templates ORDER BY created_at ASC LIMIT 1').get() as Template | undefined;
        return firstTemplate || null;
      }

      return template;
    } catch (error) {
      console.error('Error getting default template:', error);
      return null;
    }
  }

  static async setDefaultTemplate(id: number): Promise<boolean> {
    try {
      const db = getDatabase();

      const template = await this.getById(id);
      if (!template) {
        return false;
      }

      db.prepare('UPDATE templates SET is_default = 0').run();

      db.prepare('UPDATE templates SET is_default = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

      return true;
    } catch (error) {
      console.error('Error setting default template:', error);
      return false;
    }
  }

  static async updateComponentCode(id: number, componentCode: string): Promise<Template | null> {
    try {
      const db = getDatabase();

      const template = await this.getById(id);
      if (!template) {
        return null;
      }

      if (template.template_type !== 'react') {
        throw new Error('Can only update component code for React templates');
      }

      const updateStmt = db.prepare(`
        UPDATE templates
        SET component_code = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      updateStmt.run(componentCode, id);

      return this.getById(id);
    } catch (error) {
      console.error('Error updating component code:', error);
      return null;
    }
  }
}
