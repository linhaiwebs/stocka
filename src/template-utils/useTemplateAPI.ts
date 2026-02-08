import { useCallback } from 'react';
import { getConfig } from '../config/config';

const config = getConfig();
const API_URL = config.api.baseUrl || '';

export interface TrackingData {
  visitor_id: string;
  template_id: number;
  traffic_link_id?: number;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
}

export interface ConversionData {
  visitor_id: string;
  template_id: number;
  traffic_link_id?: number;
}

export interface InteractionData {
  visitor_id: string;
  template_id: number;
  scroll_depth_percent?: number;
  time_on_page_seconds?: number;
  interaction_events?: Array<{
    type: string;
    timestamp: number;
    data?: Record<string, unknown>;
  }>;
}

export function useTemplateAPI(apiKey: string) {
  const trackPageView = useCallback(
    async (data: TrackingData): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/analytics/pageview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Template-API-Key': apiKey,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        return result.success;
      } catch (error) {
        console.error('Failed to track page view:', error);
        return false;
      }
    },
    [apiKey]
  );

  const trackConversion = useCallback(
    async (data: ConversionData): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/analytics/conversion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Template-API-Key': apiKey,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        return result.success;
      } catch (error) {
        console.error('Failed to track conversion:', error);
        return false;
      }
    },
    [apiKey]
  );

  const trackInteraction = useCallback(
    async (data: InteractionData): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/analytics/interaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Template-API-Key': apiKey,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        return result.success;
      } catch (error) {
        console.error('Failed to track interaction:', error);
        return false;
      }
    },
    [apiKey]
  );

  return {
    trackPageView,
    trackConversion,
    trackInteraction,
  };
}
