import { api } from '../services/api';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
    sendGA4Event?: (eventName: string, params?: Record<string, any>) => void;
    __ga4_id?: string;
  }
}

export async function initializeAnalytics(): Promise<void> {
  try {
    const analyticsSettings = await api.getAnalyticsSettings();

    if (!analyticsSettings.analytics_enabled) {
      console.log('[Analytics] Tracking is disabled');
      return;
    }

    const {
      google_analytics_id,
      google_ads_id,
      google_ads_conversion_id,
      conversion_event_name = 'conversion'
    } = analyticsSettings;

    if (!google_analytics_id && !google_ads_id) {
      console.log('[Analytics] No tracking IDs configured');
      return;
    }

    console.log('[Analytics] Initializing Google Analytics...');

    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${google_analytics_id || google_ads_id}`;

    await new Promise((resolve, reject) => {
      gtagScript.onload = resolve;
      gtagScript.onerror = reject;
      document.head.appendChild(gtagScript);
    });

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer!.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());

    if (google_analytics_id) {
      gtag('config', google_analytics_id);
      window.__ga4_id = google_analytics_id;
      console.log('[Analytics] Google Analytics configured:', google_analytics_id);

      // Create helper function to send events only to GA4
      window.sendGA4Event = function(eventName: string, params?: Record<string, any>) {
        if (!window.gtag || !window.__ga4_id) {
          console.warn('[Analytics] GA4 not initialized');
          return;
        }

        const eventParams = {
          ...params,
          send_to: window.__ga4_id
        };

        window.gtag('event', eventName, eventParams);
        console.log('[Analytics] GA4 event sent:', eventName, eventParams);
      };
    }

    if (google_ads_id) {
      gtag('config', google_ads_id);
      console.log('[Analytics] Google Ads configured:', google_ads_id);
    }

    if (google_ads_conversion_id) {
      window.gtag_report_conversion = function (url?: string) {
        let redirected = false;

        const performRedirect = () => {
          if (!redirected && typeof url !== 'undefined') {
            redirected = true;
            console.log('[Analytics] Redirecting to:', url);
            window.location.href = url;
          }
        };

        const callback = function () {
          console.log('[Analytics] Conversion callback fired');
          performRedirect();
        };

        try {
          gtag('event', conversion_event_name, {
            'send_to': google_ads_conversion_id,
            'event_callback': callback
          });
          console.log('[Analytics] Conversion event sent');
        } catch (error) {
          console.error('[Analytics] Failed to send conversion event:', error);
        }

        setTimeout(() => {
          if (!redirected) {
            console.log('[Analytics] Timeout reached, forcing redirect');
            performRedirect();
          }
        }, 1500);

        return false;
      };

      console.log('[Analytics] Conversion tracking configured:', google_ads_conversion_id);
    }

    console.log('[Analytics] Initialization complete');
  } catch (error) {
    console.error('[Analytics] Failed to initialize:', error);
  }
}
