export interface Template {
  id: number;
  name: string;
  slug: string;
  html_content: string;
  css_content?: string;
  js_content?: string;
  template_type?: 'html' | 'react';
  template_category?: 'input-form' | 'standard' | 'free';
  component_name?: string;
  component_code?: string;
  tracking_code?: string;
  api_key: string;
  is_default?: number;
  page_title?: string;
  page_description?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface TrafficLink {
  id: number;
  template_id: number;
  name: string;
  url: string;
  link_slug: string;
  clicks: number;
  conversions: number;
  page_title_override?: string;
  page_description_override?: string;
  created_at: string;
}

export interface Visitor {
  id: number;
  visitor_id: string;
  template_id: number;
  traffic_link_id: number | null;
  user_agent: string | null;
  ip_address: string | null;
  referrer: string | null;
  first_visit: string;
  last_visit: string;
  page_views: number;
  converted: boolean;
}

export interface PageView {
  id: number;
  visitor_id: string;
  template_id: number;
  traffic_link_id: number | null;
  viewed_at: string;
}

export interface Conversion {
  id: number;
  visitor_id: string;
  template_id: number;
  traffic_link_id: number | null;
  converted_at: string;
}

export interface JWTPayload {
  user_id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalyticsData {
  totalPageViews: number;
  totalVisitors: number;
  totalConversions: number;
  conversionRate: number;
  topLinks: Array<{
    id: number;
    name: string;
    url: string;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }>;
}

export interface DashboardStats {
  totalTemplates: number;
  totalTrafficLinks: number;
  totalPageViews: number;
  totalConversions: number;
  conversionRate: number;
}

export interface SiteSettings {
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
}

export interface AnalyticsSettings {
  google_ads_id?: string;
  google_analytics_id?: string;
  google_ads_conversion_id?: string;
  conversion_event_name?: string;
  analytics_enabled: boolean;
}
