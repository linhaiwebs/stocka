import { getDatabase } from '../config/database.js';
import { Visitor, PageView, Conversion, AnalyticsData } from '../types/index.js';

export class AnalyticsService {
  static async trackPageView(
    visitor_id: string,
    template_id: number,
    traffic_link_id: number | null,
    user_agent: string | null,
    ip_address: string | null,
    referrer: string | null
  ): Promise<boolean> {
    try {
      const db = getDatabase();

      const existingVisitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?').get(visitor_id) as Visitor | undefined;

      if (existingVisitor) {
        const updateVisitor = db.prepare(`
          UPDATE visitors
          SET last_visit = CURRENT_TIMESTAMP, page_views = page_views + 1
          WHERE visitor_id = ?
        `);
        updateVisitor.run(visitor_id);
      } else {
        const insertVisitor = db.prepare(`
          INSERT INTO visitors (visitor_id, template_id, traffic_link_id, user_agent, ip_address, referrer)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        insertVisitor.run(visitor_id, template_id, traffic_link_id, user_agent, ip_address, referrer);
      }

      const insertPageView = db.prepare(`
        INSERT INTO page_views (visitor_id, template_id, traffic_link_id)
        VALUES (?, ?, ?)
      `);
      insertPageView.run(visitor_id, template_id, traffic_link_id);

      return true;
    } catch (error) {
      console.error('Error tracking page view:', error);
      return false;
    }
  }

  static async trackConversion(
    visitor_id: string,
    template_id: number,
    traffic_link_id: number | null
  ): Promise<boolean> {
    try {
      const db = getDatabase();

      const insertConversion = db.prepare(`
        INSERT INTO conversions (visitor_id, template_id, traffic_link_id)
        VALUES (?, ?, ?)
      `);
      insertConversion.run(visitor_id, template_id, traffic_link_id);

      const updateVisitor = db.prepare(`
        UPDATE visitors
        SET converted = 1
        WHERE visitor_id = ?
      `);
      updateVisitor.run(visitor_id);

      if (traffic_link_id) {
        const updateLink = db.prepare(`
          UPDATE traffic_links
          SET conversions = conversions + 1
          WHERE id = ?
        `);
        updateLink.run(traffic_link_id);
      }

      return true;
    } catch (error) {
      console.error('Error tracking conversion:', error);
      return false;
    }
  }

  static async trackInteraction(
    visitor_id: string,
    template_id: number,
    scroll_depth_percent?: number,
    time_on_page_seconds?: number,
    interaction_events?: Array<{ type: string; timestamp: number; data?: any }>
  ): Promise<boolean> {
    try {
      const db = getDatabase();

      const updates: string[] = [];
      const params: any[] = [];

      if (scroll_depth_percent !== undefined) {
        updates.push('scroll_depth_percent = MAX(scroll_depth_percent, ?)');
        params.push(scroll_depth_percent);
      }

      if (time_on_page_seconds !== undefined) {
        updates.push('time_on_page_seconds = ?');
        params.push(time_on_page_seconds);
      }

      if (interaction_events && interaction_events.length > 0) {
        updates.push('interaction_events = ?');
        params.push(JSON.stringify(interaction_events));
      }

      updates.push('last_interaction_at = CURRENT_TIMESTAMP');

      if (updates.length === 0) {
        return true;
      }

      params.push(visitor_id);

      const updateQuery = `
        UPDATE visitors
        SET ${updates.join(', ')}
        WHERE visitor_id = ?
      `;

      const stmt = db.prepare(updateQuery);
      stmt.run(...params);

      return true;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return false;
    }
  }

  static async getAnalyticsByTemplate(template_id: number): Promise<AnalyticsData> {
    try {
      const db = getDatabase();

      const stats = db.prepare(`
        SELECT
          COUNT(DISTINCT pv.visitor_id) as totalVisitors,
          COUNT(pv.id) as totalPageViews,
          COUNT(DISTINCT c.id) as totalConversions
        FROM page_views pv
        LEFT JOIN conversions c ON c.visitor_id = pv.visitor_id AND c.template_id = pv.template_id
        WHERE pv.template_id = ?
      `).get(template_id) as any;

      const topLinks = db.prepare(`
        SELECT
          tl.id,
          tl.name,
          tl.url,
          tl.clicks,
          tl.conversions,
          CASE
            WHEN tl.clicks > 0 THEN ROUND((tl.conversions * 100.0 / tl.clicks), 2)
            ELSE 0
          END as conversionRate
        FROM traffic_links tl
        WHERE tl.template_id = ?
        ORDER BY tl.clicks DESC
        LIMIT 10
      `).all(template_id) as any[];

      const totalVisitors = stats.totalVisitors || 0;
      const totalPageViews = stats.totalPageViews || 0;
      const totalConversions = stats.totalConversions || 0;
      const conversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

      return {
        totalPageViews,
        totalVisitors,
        totalConversions,
        conversionRate,
        topLinks
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        totalPageViews: 0,
        totalVisitors: 0,
        totalConversions: 0,
        conversionRate: 0,
        topLinks: []
      };
    }
  }

  static async getAllAnalytics(): Promise<AnalyticsData> {
    try {
      const db = getDatabase();

      const stats = db.prepare(`
        SELECT
          COUNT(DISTINCT pv.visitor_id) as totalVisitors,
          COUNT(pv.id) as totalPageViews,
          COUNT(DISTINCT c.id) as totalConversions
        FROM page_views pv
        LEFT JOIN conversions c ON c.visitor_id = pv.visitor_id
      `).get() as any;

      const topLinks = db.prepare(`
        SELECT
          tl.id,
          tl.name,
          tl.url,
          tl.clicks,
          tl.conversions,
          CASE
            WHEN tl.clicks > 0 THEN ROUND((tl.conversions * 100.0 / tl.clicks), 2)
            ELSE 0
          END as conversionRate
        FROM traffic_links tl
        ORDER BY tl.clicks DESC
        LIMIT 10
      `).all() as any[];

      const totalVisitors = stats.totalVisitors || 0;
      const totalPageViews = stats.totalPageViews || 0;
      const totalConversions = stats.totalConversions || 0;
      const conversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

      return {
        totalPageViews,
        totalVisitors,
        totalConversions,
        conversionRate,
        topLinks
      };
    } catch (error) {
      console.error('Error getting all analytics:', error);
      return {
        totalPageViews: 0,
        totalVisitors: 0,
        totalConversions: 0,
        conversionRate: 0,
        topLinks: []
      };
    }
  }
}
