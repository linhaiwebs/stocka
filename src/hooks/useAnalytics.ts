import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { analytics } from '../services/analytics';

export function useAnalytics(templateId: string | null) {
  const [loaded, setLoaded] = useState(false);
  const [conversionId, setConversionId] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId || loaded) return;

    const loadAnalytics = async () => {
      try {
        const response = await api.getTrackingScript(templateId);

        if (response.success && response.data) {
          const { script_html, google_ads_conversion_id } = response.data as any;

          if (script_html) {
            analytics.injectScript(script_html);
          }

          if (google_ads_conversion_id) {
            setConversionId(google_ads_conversion_id);
          }

          setLoaded(true);

          setTimeout(() => {
            analytics.trackPageView(window.location.pathname);
          }, 1000);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }
    };

    loadAnalytics();
  }, [templateId, loaded]);

  return { loaded, conversionId };
}
