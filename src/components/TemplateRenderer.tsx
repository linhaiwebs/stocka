import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { getConfig } from '../config/config';

interface TemplateRendererProps {
  htmlContent: string;
  cssContent?: string;
  jsContent?: string;
  templateId?: number;
  visitorId?: string | null;
  trafficLinkId?: number;
  apiKey?: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
    dataLayer?: any[];
  }
}

export function TemplateRenderer({
  htmlContent,
  cssContent,
  jsContent,
  templateId,
  visitorId,
  trafficLinkId,
  apiKey
}: TemplateRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['style', 'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'canvas'],
      ADD_ATTR: ['target', 'data-conversion-trigger', 'data-traffic-link-id', 'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'width', 'height']
    });

    containerRef.current.innerHTML = sanitizedHTML;

    // Auto-inject traffic link ID into conversion triggers that don't have one
    if (trafficLinkId && containerRef.current) {
      const conversionTriggers = containerRef.current.querySelectorAll('[data-conversion-trigger]');
      conversionTriggers.forEach((element) => {
        if (!element.getAttribute('data-traffic-link-id')) {
          element.setAttribute('data-traffic-link-id', String(trafficLinkId));
        }
      });
    }

    // Execute template JavaScript AFTER HTML is rendered and traffic link IDs are set
    if (jsContent && jsContent.trim()) {
      setTimeout(() => {
        try {
          const scriptFunction = new Function(jsContent);
          scriptFunction();
        } catch (err) {
          console.error(`Error executing template ${templateId} JavaScript:`, err);
          if (err instanceof Error) {
            console.error('JavaScript error details:', err.message);
          }
        }
      }, 0);
    }
  }, [htmlContent, trafficLinkId, jsContent, templateId]);

  useEffect(() => {
    if (!containerRef.current || !visitorId || !templateId) return;

    const handleConversionClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const conversionButton = target.closest('[data-conversion-trigger]');

      if (!conversionButton) return;

      event.preventDefault();
      event.stopPropagation();

      let linkId = conversionButton.getAttribute('data-traffic-link-id');

      if (!linkId && trafficLinkId) {
        linkId = String(trafficLinkId);
      }

      const linkIdNum = linkId ? parseInt(linkId) : undefined;
      let destinationUrl: string | undefined;

      console.log('[Conversion] Starting conversion click handler');
      console.log('[Conversion] Traffic Link ID:', linkIdNum);
      console.log('[Conversion] Template ID:', templateId);

      try {
        // Strategy 1: Try to get destination URL from traffic link if available
        if (linkIdNum) {
          console.log('[Conversion] Strategy 1: Fetching URL from traffic link ID', linkIdNum);
          const linkResponse = await api.getTrafficLinkById(linkIdNum);
          if (linkResponse.success && linkResponse.data) {
            const trafficLink = linkResponse.data as any;
            destinationUrl = trafficLink.url;
            console.log('[Conversion] Strategy 1: Got URL from traffic link:', destinationUrl);
          }
        }

        // Strategy 2: If no URL yet and we have a template ID, get default traffic link for template
        if (!destinationUrl && templateId) {
          console.log('[Conversion] Strategy 2: Fetching default traffic link for template', templateId);
          try {
            const defaultLinkResponse = await api.getDefaultTrafficLink(templateId);
            if (defaultLinkResponse.success && defaultLinkResponse.data) {
              const defaultLink = defaultLinkResponse.data as any;
              destinationUrl = defaultLink.url;
              console.log('[Conversion] Strategy 2: Got URL from default traffic link:', destinationUrl);
            }
          } catch (error) {
            console.log('[Conversion] Strategy 2: Failed to get default traffic link:', error);
          }
        }

        // Strategy 3: Try to get URL from button's href attribute
        if (!destinationUrl) {
          console.log('[Conversion] Strategy 3: Checking button href attribute');
          const linkElement = conversionButton.tagName === 'A'
            ? conversionButton
            : conversionButton.querySelector('a');

          if (linkElement && linkElement instanceof HTMLAnchorElement) {
            destinationUrl = linkElement.href;
            console.log('[Conversion] Strategy 3: Got URL from href:', destinationUrl);
          }
        }

        // Track conversion using template-specific API key if available
        if (apiKey) {
          const config = getConfig();
          const API_URL = config.api.baseUrl || '';
          await fetch(`${API_URL}/api/analytics/conversion`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Template-API-Key': apiKey,
            },
            body: JSON.stringify({
              visitor_id: visitorId,
              template_id: templateId,
              traffic_link_id: linkIdNum
            }),
          });
        } else {
          // Fallback to global API service (uses environment API key)
          await api.trackConversion({
            visitor_id: visitorId,
            template_id: String(templateId),
            traffic_link_id: linkIdNum
          });
        }

        // Handle redirect and conversion tracking
        console.log('[Conversion] Destination URL:', destinationUrl);

        if (destinationUrl) {
          let redirected = false;

          if (window.gtag_report_conversion) {
            console.log('[Conversion] Using gtag_report_conversion');
            window.gtag_report_conversion(destinationUrl);

            // Safety fallback: force redirect after 2 seconds if gtag hasn't redirected
            setTimeout(() => {
              if (!redirected) {
                console.log('[Conversion] Safety timeout - forcing redirect');
                redirected = true;
                window.location.href = destinationUrl;
              }
            }, 2000);
          } else {
            console.log('[Conversion] Direct redirect (no gtag)');
            redirected = true;
            window.location.href = destinationUrl;
          }
        } else {
          console.log('[Conversion] No destination URL, staying on current page');
        }
      } catch (error) {
        console.error(`Error handling conversion for template ${templateId}:`, error);
      }
    };

    containerRef.current.addEventListener('click', handleConversionClick as EventListener, true);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleConversionClick as EventListener, true);
      }
    };
  }, [visitorId, templateId, trafficLinkId, apiKey]);

  useEffect(() => {
    if (styleRef.current) {
      document.head.removeChild(styleRef.current);
      styleRef.current = null;
    }

    if (cssContent && cssContent.trim()) {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-template-styles', 'true');
      styleElement.textContent = cssContent;
      document.head.appendChild(styleElement);
      styleRef.current = styleElement;
    }

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [cssContent]);

  return <div ref={containerRef} className="template-container w-full" />;
}
