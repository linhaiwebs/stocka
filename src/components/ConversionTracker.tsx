import { useEffect } from 'react';
import { analytics } from '../services/analytics';
import { api } from '../services/api';
import { storage } from '../services/storage';

interface ConversionTrackerProps {
  conversionId: string | null;
  templateId: string;
}

export function ConversionTracker({ conversionId, templateId }: ConversionTrackerProps) {
  useEffect(() => {
    if (!conversionId) return;

    const handleConversionClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const conversionElement = target.closest('[data-conversion]');

      if (!conversionElement) return;

      event.preventDefault();

      const conversionType = conversionElement.getAttribute('data-conversion') || 'default';
      const destinationUrl = conversionElement.getAttribute('href') || '';
      const conversionValue = parseFloat(
        conversionElement.getAttribute('data-conversion-value') || '0'
      );

      const sessionId = storage.getSessionId();
      const trafficLinkId = storage.getTrafficLinkId();

      const redirectAfterTracking = () => {
        if (destinationUrl) {
          window.location.href = destinationUrl;
        }
      };

      analytics.reportConversion(conversionId, redirectAfterTracking);

      if (typeof (window as any).trackGoogleAdsConversion === 'function') {
        try {
          (window as any).trackGoogleAdsConversion();
        } catch (err) {
          console.error('Failed to track Google Ads conversion:', err);
        }
      }

      if (sessionId) {
        api.trackConversion({
          visitor_session_id: sessionId,
          template_id: templateId,
          traffic_link_id: trafficLinkId || undefined,
          conversion_type: conversionType,
          conversion_value: conversionValue,
          event_data: {
            url: destinationUrl,
            timestamp: new Date().toISOString()
          }
        }).catch(err => console.error('Failed to track conversion:', err));
      }
    };

    document.addEventListener('click', handleConversionClick);

    return () => {
      document.removeEventListener('click', handleConversionClick);
    };
  }, [conversionId, templateId]);

  return null;
}
