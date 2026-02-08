import { getDatabase } from '../config/database.js';
import type { SiteSettings, AnalyticsSettings } from '../types/index.js';

export class SiteSettingsService {
  static getSiteSettings(): SiteSettings | null {
    const db = getDatabase();

    try {
      const settings = db.prepare(`
        SELECT
          id,
          domain_name,
          copyright_text,
          privacy_policy_content,
          terms_of_service_content,
          google_ads_id,
          google_analytics_id,
          google_ads_conversion_id,
          conversion_event_name,
          analytics_enabled,
          created_at,
          updated_at
        FROM site_settings
        WHERE id = 1
      `).get() as SiteSettings | undefined;

      return settings || null;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      throw error;
    }
  }

  static getPublicSettings(): Pick<SiteSettings, 'domain_name' | 'copyright_text'> | null {
    const db = getDatabase();

    try {
      const settings = db.prepare(`
        SELECT
          domain_name,
          copyright_text
        FROM site_settings
        WHERE id = 1
      `).get() as Pick<SiteSettings, 'domain_name' | 'copyright_text'> | undefined;

      return settings || null;
    } catch (error) {
      console.error('Error fetching public settings:', error);
      throw error;
    }
  }

  static getPrivacyPolicy(): string {
    const db = getDatabase();

    try {
      const result = db.prepare(`
        SELECT privacy_policy_content
        FROM site_settings
        WHERE id = 1
      `).get() as { privacy_policy_content: string } | undefined;

      return result?.privacy_policy_content || '';
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      throw error;
    }
  }

  static getTermsOfService(): string {
    const db = getDatabase();

    try {
      const result = db.prepare(`
        SELECT terms_of_service_content
        FROM site_settings
        WHERE id = 1
      `).get() as { terms_of_service_content: string } | undefined;

      return result?.terms_of_service_content || '';
    } catch (error) {
      console.error('Error fetching terms of service:', error);
      throw error;
    }
  }

  static getAnalyticsSettings(): AnalyticsSettings {
    const db = getDatabase();

    try {
      const result = db.prepare(`
        SELECT
          google_ads_id,
          google_analytics_id,
          google_ads_conversion_id,
          conversion_event_name,
          analytics_enabled
        FROM site_settings
        WHERE id = 1
      `).get() as {
        google_ads_id?: string;
        google_analytics_id?: string;
        google_ads_conversion_id?: string;
        conversion_event_name?: string;
        analytics_enabled?: number;
      } | undefined;

      return {
        google_ads_id: result?.google_ads_id,
        google_analytics_id: result?.google_analytics_id,
        google_ads_conversion_id: result?.google_ads_conversion_id,
        conversion_event_name: result?.conversion_event_name || 'conversion',
        analytics_enabled: result?.analytics_enabled === 1
      };
    } catch (error) {
      console.error('Error fetching analytics settings:', error);
      return {
        analytics_enabled: false,
        conversion_event_name: 'conversion'
      };
    }
  }

  static updateSiteSettings(data: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>): SiteSettings {
    const db = getDatabase();

    try {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (data.domain_name !== undefined) {
        updateFields.push('domain_name = ?');
        updateValues.push(data.domain_name);
      }

      if (data.copyright_text !== undefined) {
        updateFields.push('copyright_text = ?');
        updateValues.push(data.copyright_text);
      }

      if (data.privacy_policy_content !== undefined) {
        updateFields.push('privacy_policy_content = ?');
        updateValues.push(data.privacy_policy_content);
      }

      if (data.terms_of_service_content !== undefined) {
        updateFields.push('terms_of_service_content = ?');
        updateValues.push(data.terms_of_service_content);
      }

      if (data.google_ads_id !== undefined) {
        updateFields.push('google_ads_id = ?');
        updateValues.push(data.google_ads_id);
      }

      if (data.google_analytics_id !== undefined) {
        updateFields.push('google_analytics_id = ?');
        updateValues.push(data.google_analytics_id);
      }

      if (data.google_ads_conversion_id !== undefined) {
        updateFields.push('google_ads_conversion_id = ?');
        updateValues.push(data.google_ads_conversion_id);
      }

      if (data.conversion_event_name !== undefined) {
        updateFields.push('conversion_event_name = ?');
        updateValues.push(data.conversion_event_name);
      }

      if (data.analytics_enabled !== undefined) {
        updateFields.push('analytics_enabled = ?');
        updateValues.push(data.analytics_enabled ? 1 : 0);
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');

      const query = `
        UPDATE site_settings
        SET ${updateFields.join(', ')}
        WHERE id = 1
      `;

      db.prepare(query).run(...updateValues);

      const updated = this.getSiteSettings();
      if (!updated) {
        throw new Error('Failed to retrieve updated settings');
      }

      return updated;
    } catch (error) {
      console.error('Error updating site settings:', error);
      throw error;
    }
  }
}
