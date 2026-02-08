declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const analytics = {
  injectScript(scriptHtml: string): void {
    if (!scriptHtml) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = scriptHtml;

    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');

      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      } else {
        newScript.textContent = script.textContent;
      }

      document.head.appendChild(newScript);
    });
  },

  reportConversion(conversionId: string, callback?: () => void): void {
    if (!window.gtag) {
      console.warn('Google Analytics not loaded');
      callback?.();
      return;
    }

    window.gtag('event', 'conversion', {
      send_to: conversionId,
      event_callback: callback
    });
  },

  trackPageView(pageUrl: string): void {
    if (!window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path: pageUrl
    });
  },

  trackEvent(eventName: string, params?: Record<string, any>): void {
    if (!window.gtag) return;

    window.gtag('event', eventName, params);
  }
};
