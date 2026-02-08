import { getDatabase } from '../config/database.js';
import { TrafficLink } from '../types/index.js';
import { nanoid } from 'nanoid';

export class TrafficService {
  static generateSlug(): string {
    return nanoid(8);
  }

  static async isSlugUnique(slug: string): Promise<boolean> {
    try {
      const db = getDatabase();
      const existing = db.prepare('SELECT id FROM traffic_links WHERE link_slug = ?').get(slug);
      return !existing;
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      return false;
    }
  }

  static async generateUniqueSlug(): Promise<string> {
    let slug = this.generateSlug();
    let attempts = 0;
    const maxAttempts = 10;

    while (!await this.isSlugUnique(slug) && attempts < maxAttempts) {
      slug = this.generateSlug();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique slug after maximum attempts');
    }

    return slug;
  }

  static async create(template_id: number, name: string, url: string): Promise<TrafficLink | null> {
    try {
      const db = getDatabase();
      const slug = await this.generateUniqueSlug();

      const insert = db.prepare(`
        INSERT INTO traffic_links (template_id, name, url, link_slug)
        VALUES (?, ?, ?, ?)
      `);

      const result = insert.run(template_id, name, url, slug);

      const link = db.prepare('SELECT * FROM traffic_links WHERE id = ?').get(result.lastInsertRowid) as TrafficLink;

      return link;
    } catch (error) {
      console.error('Error creating traffic link:', error);
      return null;
    }
  }

  static async getAll(): Promise<TrafficLink[]> {
    try {
      const db = getDatabase();
      const links = db.prepare('SELECT * FROM traffic_links ORDER BY created_at DESC').all() as TrafficLink[];
      return links;
    } catch (error) {
      console.error('Error getting all traffic links:', error);
      return [];
    }
  }

  static async getById(id: number): Promise<TrafficLink | null> {
    try {
      const db = getDatabase();
      const link = db.prepare('SELECT * FROM traffic_links WHERE id = ?').get(id) as TrafficLink | undefined;
      return link || null;
    } catch (error) {
      console.error('Error getting traffic link by id:', error);
      return null;
    }
  }

  static async getByTemplateId(template_id: number): Promise<TrafficLink[]> {
    try {
      const db = getDatabase();
      const links = db.prepare('SELECT * FROM traffic_links WHERE template_id = ? ORDER BY created_at DESC').all(template_id) as TrafficLink[];
      return links;
    } catch (error) {
      console.error('Error getting traffic links by template id:', error);
      return [];
    }
  }

  static async update(id: number, name?: string, url?: string, page_title_override?: string, page_description_override?: string): Promise<TrafficLink | null> {
    try {
      const db = getDatabase();
      const updates: string[] = [];
      const values: any[] = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }

      if (url) {
        updates.push('url = ?');
        values.push(url);
      }

      if (page_title_override !== undefined) {
        updates.push('page_title_override = ?');
        values.push(page_title_override || null);
      }

      if (page_description_override !== undefined) {
        updates.push('page_description_override = ?');
        values.push(page_description_override || null);
      }

      if (updates.length === 0) {
        return this.getById(id);
      }

      values.push(id);

      const updateStmt = db.prepare(`
        UPDATE traffic_links
        SET ${updates.join(', ')}
        WHERE id = ?
      `);

      updateStmt.run(...values);

      return this.getById(id);
    } catch (error) {
      console.error('Error updating traffic link:', error);
      return null;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const deleteStmt = db.prepare('DELETE FROM traffic_links WHERE id = ?');
      deleteStmt.run(id);
      return true;
    } catch (error) {
      console.error('Error deleting traffic link:', error);
      return false;
    }
  }

  static async incrementClicks(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const updateStmt = db.prepare(`
        UPDATE traffic_links
        SET clicks = clicks + 1
        WHERE id = ?
      `);
      updateStmt.run(id);
      return true;
    } catch (error) {
      console.error('Error incrementing clicks:', error);
      return false;
    }
  }

  static async incrementConversions(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const updateStmt = db.prepare(`
        UPDATE traffic_links
        SET conversions = conversions + 1
        WHERE id = ?
      `);
      updateStmt.run(id);
      return true;
    } catch (error) {
      console.error('Error incrementing conversions:', error);
      return false;
    }
  }
}
