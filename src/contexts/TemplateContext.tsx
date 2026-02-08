import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import {
  useTemplateAPI,
  useScrollDepthTracking,
  useTimeOnPage,
  useInteractionTracking,
  useConversionTracking,
} from '../template-utils';
import { getConfig } from '../config/config';

interface TrafficLink {
  id: number;
  name: string;
  url: string;
  source?: string;
  campaign?: string;
}

interface TemplateContextValue {
  visitorId: string;
  templateId: number;
  trafficLinkId?: number;
  trafficLink?: TrafficLink;
  apiKey: string;
  trackConversion: (conversionType?: string) => void;
  trackInteraction: (type: string, data?: Record<string, unknown>) => void;
  trackClick: (elementId: string, elementType?: string) => void;
  trackTabSwitch: (fromTab: string, toTab: string) => void;
  getScrollDepth: () => number;
  getTimeOnPage: () => number;
  sendGA4Event: (eventName: string, params?: Record<string, any>) => void;
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

export interface TemplateProviderProps {
  visitorId: string;
  templateId: number;
  trafficLinkId?: number;
  trafficLink?: TrafficLink;
  apiKey: string;
  children: React.ReactNode;
}

export function TemplateProvider({
  visitorId,
  templateId,
  trafficLinkId,
  trafficLink,
  apiKey,
  children,
}: TemplateProviderProps) {
  const api = useTemplateAPI(apiKey);
  const hasTrackedPageViewRef = useRef(false);
  const lastInteractionUpdateRef = useRef(0);

  // Debug logging for traffic link prop
  useEffect(() => {
    console.log('[TemplateProvider] Received traffic link:', trafficLink);
  }, [trafficLink]);

  const { getMaxDepth } = useScrollDepthTracking({
    onDepthReached: (depth) => {
      sendInteractionUpdate({ scroll_depth_percent: depth });
    },
  });

  const { getTimeOnPage } = useTimeOnPage({
    onMilestone: (seconds) => {
      sendInteractionUpdate({ time_on_page_seconds: seconds });
    },
  });

  const { trackInteraction: trackInteractionEvent, getEvents } = useInteractionTracking({
    onInteraction: () => {
      const now = Date.now();
      if (now - lastInteractionUpdateRef.current > 5000) {
        sendInteractionUpdate({});
      }
    },
  });

  const { trackConversion: trackConversionEvent } = useConversionTracking({
    onConversion: async (conversionType) => {
      const success = await api.trackConversion({
        visitor_id: visitorId,
        template_id: templateId,
        traffic_link_id: trafficLinkId,
      });

      if (success && conversionType && window.trackGoogleAdsConversion) {
        window.trackGoogleAdsConversion();
      }
    },
  });

  const sendInteractionUpdate = useCallback(
    async (updates: {
      scroll_depth_percent?: number;
      time_on_page_seconds?: number;
    }) => {
      const now = Date.now();
      lastInteractionUpdateRef.current = now;

      await api.trackInteraction({
        visitor_id: visitorId,
        template_id: templateId,
        scroll_depth_percent: updates.scroll_depth_percent || getMaxDepth(),
        time_on_page_seconds: updates.time_on_page_seconds || getTimeOnPage(),
        interaction_events: getEvents(),
      });
    },
    [api, visitorId, templateId, getMaxDepth, getTimeOnPage, getEvents]
  );

  useEffect(() => {
    if (!hasTrackedPageViewRef.current) {
      hasTrackedPageViewRef.current = true;

      api.trackPageView({
        visitor_id: visitorId,
        template_id: templateId,
        traffic_link_id: trafficLinkId,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      });
    }
  }, [api, visitorId, templateId, trafficLinkId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      navigator.sendBeacon(
        `${apiUrl}/api/analytics/interaction`,
        JSON.stringify({
          visitor_id: visitorId,
          template_id: templateId,
          scroll_depth_percent: getMaxDepth(),
          time_on_page_seconds: getTimeOnPage(),
          interaction_events: getEvents(),
        })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [visitorId, templateId, getMaxDepth, getTimeOnPage, getEvents]);

  const handleConversion = useCallback(
    (conversionType?: string) => {
      trackConversionEvent(conversionType);
    },
    [trackConversionEvent]
  );

  const handleInteraction = useCallback(
    (type: string, data?: Record<string, unknown>) => {
      trackInteractionEvent(type, data);
    },
    [trackInteractionEvent]
  );

  const handleClick = useCallback(
    (elementId: string, elementType?: string) => {
      trackInteractionEvent('click', { elementId, elementType });
    },
    [trackInteractionEvent]
  );

  const handleTabSwitch = useCallback(
    (fromTab: string, toTab: string) => {
      trackInteractionEvent('tab_switch', { fromTab, toTab });
    },
    [trackInteractionEvent]
  );

  const handleSendGA4Event = useCallback(
    (eventName: string, params?: Record<string, any>) => {
      if (typeof window !== 'undefined' && window.sendGA4Event) {
        window.sendGA4Event(eventName, params);
      } else {
        console.warn('[TemplateContext] sendGA4Event not available');
      }
    },
    []
  );

  const value: TemplateContextValue = {
    visitorId,
    templateId,
    trafficLinkId,
    trafficLink,
    apiKey,
    trackConversion: handleConversion,
    trackInteraction: handleInteraction,
    trackClick: handleClick,
    trackTabSwitch: handleTabSwitch,
    getScrollDepth: getMaxDepth,
    getTimeOnPage,
    sendGA4Event: handleSendGA4Event,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
}

declare global {
  interface Window {
    trackGoogleAdsConversion?: () => void;
  }
}
