import { getConfig } from '../config/config.js';

const config = getConfig();
let API_URL = config.api.baseUrl;
let TEMPLATE_API_KEY = import.meta.env.VITE_TEMPLATE_API_KEY || '';

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Global API service
 *
 * This service uses the global VITE_TEMPLATE_API_KEY from environment variables.
 * It's suitable for general operations and admin functions.
 *
 * For template-specific operations (analytics tracking from within templates),
 * use the TemplateProvider context and useTemplateAPI hook instead, which use
 * each template's unique API key for proper authentication and tracking.
 */
export const api = {
  async getAnalyticsConfig(templateId: string | number) {
    const response = await fetch(`${API_URL}/api/analytics/config/${templateId}`, {
      headers: {
        'X-Template-API-Key': TEMPLATE_API_KEY
      }
    });
    return response.json() as Promise<APIResponse>;
  },

  async getTrackingScript(templateId: string | number) {
    const response = await fetch(`${API_URL}/api/analytics/tracking-script/${templateId}`, {
      headers: {
        'X-Template-API-Key': TEMPLATE_API_KEY
      }
    });
    return response.json() as Promise<APIResponse>;
  },

  async getTemplate(templateId: string | number) {
    const response = await fetch(`${API_URL}/api/templates/public/${templateId}`);
    return response.json() as Promise<APIResponse>;
  },

  async getTemplateById(templateId: string | number) {
    const response = await fetch(`${API_URL}/api/templates/public/${templateId}`);
    return response.json() as Promise<APIResponse>;
  },

  async getDefaultTemplate() {
    const response = await fetch(`${API_URL}/api/templates/public/default`);
    return response.json() as Promise<APIResponse>;
  },

  async resolveTrafficLink(slug: string, visitorId: string, referrer: string, pageUrl: string) {
    const response = await fetch(
      `${API_URL}/api/traffic/resolve/${slug}?visitor_id=${visitorId}&referrer=${encodeURIComponent(referrer)}&page_url=${encodeURIComponent(pageUrl)}`
    );
    return response.json() as Promise<APIResponse>;
  },

  async getTrafficLinkById(id: number) {
    const response = await fetch(`${API_URL}/api/traffic/public/${id}`);
    return response.json() as Promise<APIResponse>;
  },

  async getDefaultTrafficLink(templateId: number) {
    const response = await fetch(`${API_URL}/api/traffic/default/template/${templateId}`);
    return response.json() as Promise<APIResponse>;
  },

  async trackConversion(data: {
    visitor_id?: string;
    visitor_session_id?: string;
    template_id: string | number;
    traffic_link_id?: number | string;
    conversion_type?: string;
    conversion_value?: number;
    event_data?: any;
  }) {
    const response = await fetch(`${API_URL}/api/analytics/conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Template-API-Key': TEMPLATE_API_KEY
      },
      body: JSON.stringify(data)
    });
    return response.json() as Promise<APIResponse>;
  },

  async trackPageView(data: {
    visitor_id: string;
    template_id: string | number;
    traffic_link_id?: number | string;
    user_agent?: string;
    ip_address?: string;
    referrer?: string;
  }) {
    const response = await fetch(`${API_URL}/api/analytics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Template-API-Key': TEMPLATE_API_KEY
      },
      body: JSON.stringify(data)
    });
    return response.json() as Promise<APIResponse>;
  },

  async getPublicSiteSettings() {
    const response = await fetch(`${API_URL}/api/site-settings/public`);
    const result = await response.json() as APIResponse;
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch site settings');
    }
    return result.data as { domain_name: string; copyright_text: string };
  },

  async getAnalyticsSettings() {
    const response = await fetch(`${API_URL}/api/site-settings/analytics`);
    const result = await response.json() as APIResponse;
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch analytics settings');
    }
    return result.data as {
      google_ads_id?: string;
      google_analytics_id?: string;
      google_ads_conversion_id?: string;
      conversion_event_name?: string;
      analytics_enabled: boolean;
    };
  },

  async getPrivacyPolicy() {
    const response = await fetch(`${API_URL}/api/site-settings/privacy-policy`);
    const result = await response.json() as APIResponse;
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch privacy policy');
    }
    return result.data as { content: string };
  },

  async getTermsOfService() {
    const response = await fetch(`${API_URL}/api/site-settings/terms-of-service`);
    const result = await response.json() as APIResponse;
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch terms of service');
    }
    return result.data as { content: string };
  },

  async getSiteSettings() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/api/admin/site-settings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json() as APIResponse;
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch site settings');
    }
    return result.data as {
      id: number;
      domain_name: string;
      copyright_text: string;
      privacy_policy_content: string;
      terms_of_service_content: string;
      google_ads_id?: string;
      google_analytics_id?: string;
      google_ads_conversion_id?: string;
      conversion_event_name?: string;
      analytics_enabled?: number;
      created_at: string;
      updated_at: string;
    };
  },

  async updateSiteSettings(data: {
    domain_name?: string;
    copyright_text?: string;
    privacy_policy_content?: string;
    terms_of_service_content?: string;
    google_ads_id?: string;
    google_analytics_id?: string;
    google_ads_conversion_id?: string;
    conversion_event_name?: string;
    analytics_enabled?: boolean;
  }) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/api/admin/site-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await response.json() as APIResponse;
    if (!result.success) {
      throw new Error(result.error || 'Failed to update site settings');
    }
    return result.data;
  }
};
