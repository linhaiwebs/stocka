import { getDatabase } from '../config/database.js';
import { DashboardStats } from '../types/index.js';

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    try {
      const db = getDatabase();

      const templatesCount = db.prepare('SELECT COUNT(*) as count FROM templates').get() as any;
      const linksCount = db.prepare('SELECT COUNT(*) as count FROM traffic_links').get() as any;
      const pageViewsCount = db.prepare('SELECT COUNT(*) as count FROM page_views').get() as any;
      const conversionsCount = db.prepare('SELECT COUNT(*) as count FROM conversions').get() as any;
      const visitorsCount = db.prepare('SELECT COUNT(*) as count FROM visitors').get() as any;

      const totalTemplates = templatesCount.count || 0;
      const totalTrafficLinks = linksCount.count || 0;
      const totalPageViews = pageViewsCount.count || 0;
      const totalConversions = conversionsCount.count || 0;
      const totalVisitors = visitorsCount.count || 0;
      const conversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

      return {
        totalTemplates,
        totalTrafficLinks,
        totalPageViews,
        totalConversions,
        conversionRate
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalTemplates: 0,
        totalTrafficLinks: 0,
        totalPageViews: 0,
        totalConversions: 0,
        conversionRate: 0
      };
    }
  }

  static async getRecentActivity(limit: number = 10): Promise<any[]> {
    try {
      const db = getDatabase();

      const recentPageViews = db.prepare(`
        SELECT
          pv.id,
          pv.visitor_id,
          pv.viewed_at,
          t.name as template_name,
          tl.name as link_name
        FROM page_views pv
        LEFT JOIN templates t ON t.id = pv.template_id
        LEFT JOIN traffic_links tl ON tl.id = pv.traffic_link_id
        ORDER BY pv.viewed_at DESC
        LIMIT ?
      `).all(limit) as any[];

      return recentPageViews;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  static async getTopTemplates(limit: number = 5): Promise<any[]> {
    try {
      const db = getDatabase();

      const topTemplates = db.prepare(`
        SELECT
          t.id,
          t.name,
          COUNT(DISTINCT pv.visitor_id) as visitors,
          COUNT(pv.id) as page_views,
          COUNT(DISTINCT c.id) as conversions,
          CASE
            WHEN COUNT(DISTINCT pv.visitor_id) > 0
            THEN ROUND((COUNT(DISTINCT c.id) * 100.0 / COUNT(DISTINCT pv.visitor_id)), 2)
            ELSE 0
          END as conversion_rate
        FROM templates t
        LEFT JOIN page_views pv ON pv.template_id = t.id
        LEFT JOIN conversions c ON c.template_id = t.id
        GROUP BY t.id, t.name
        ORDER BY page_views DESC
        LIMIT ?
      `).all(limit) as any[];

      return topTemplates;
    } catch (error) {
      console.error('Error getting top templates:', error);
      return [];
    }
  }
}
