import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVisitorId } from '../hooks/useVisitorId';
import { DynamicTemplateLoader } from '../components/DynamicTemplateLoader';
import { TemplateRenderer } from '../components/TemplateRenderer';
import { ConversionTracker } from '../components/ConversionTracker';
import { GlobalFooter } from '../components/GlobalFooter';
import { api } from '../services/api';
import { storage } from '../services/storage';

interface TemplateData {
  id: number;
  slug: string;
  template_type: 'html' | 'react';
  html_content?: string;
  css_content?: string;
  js_content?: string;
  component_code?: string;
  api_key: string;
  name?: string;
  page_title?: string;
  page_description?: string;
}

interface TrafficLinkData {
  id: number;
  name: string;
  url: string;
  source?: string;
  campaign?: string;
  page_title_override?: string;
  page_description_override?: string;
}

export default function LandingPage() {
  const { slug, id } = useParams();
  const visitorId = useVisitorId();
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [trafficLinkData, setTrafficLinkData] = useState<TrafficLinkData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<{ domain_name: string; copyright_text: string } | null>(null);

  // Debug logging for traffic link data changes
  useEffect(() => {
    console.log('[LandingPage] Traffic link data updated:', trafficLinkData);
  }, [trafficLinkData]);

  // Set dynamic page title and meta description
  useEffect(() => {
    if (!templateData) return;

    // Priority: traffic link override > template custom > template name > system default
    const pageTitle =
      trafficLinkData?.page_title_override ||
      templateData.page_title ||
      templateData.name ||
      'React Dynamic Landing Page System';

    const pageDescription =
      trafficLinkData?.page_description_override ||
      templateData.page_description ||
      '';

    // Set document title
    document.title = pageTitle;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (pageDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }

    // Set Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', pageTitle);

    // Set Open Graph description
    if (pageDescription) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', pageDescription);
    }

    // Set Twitter title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', pageTitle);

    // Set Twitter description
    if (pageDescription) {
      let twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (!twitterDescription) {
        twitterDescription = document.createElement('meta');
        twitterDescription.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDescription);
      }
      twitterDescription.setAttribute('content', pageDescription);
    }
  }, [templateData, trafficLinkData]);

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const settings = await api.getPublicSiteSettings();
        setSiteSettings(settings);
      } catch (err) {
        console.error('Failed to load site settings:', err);
      }
    };

    loadSiteSettings();
  }, []);

  useEffect(() => {
    if (!visitorId) return;

    const loadTemplate = async () => {
      try {
        if (id) {
          const response = await api.getTemplateById(id);
          if (response.success && response.data) {
            const template = response.data as TemplateData;
            setTemplateData(template);

            // Try to load default traffic link for this template
            try {
              const trafficLinkResponse = await api.getDefaultTrafficLink(template.id);
              if (trafficLinkResponse.success && trafficLinkResponse.data) {
                setTrafficLinkData(trafficLinkResponse.data as TrafficLinkData);
                console.log('[LandingPage] Loaded default traffic link for template:', trafficLinkResponse.data);
              }
            } catch (err) {
              console.log('[LandingPage] No default traffic link available for template:', err);
            }
          } else {
            setError(response.error || 'Template not found');
          }
        } else if (slug) {
          const response = await api.resolveTrafficLink(
            slug,
            visitorId,
            document.referrer,
            window.location.href
          );

          if (response.success && response.data) {
            const data = response.data as any;

            if (data.bot_detected) {
              setError('Bot detected. Please use a regular browser.');
            } else if (data.template) {
              setTemplateData(data.template);
              setTrafficLinkData(data.traffic_link);
              storage.setTrafficLinkId(slug);
            } else {
              setError('Template not found');
            }
          } else {
            setError(response.error || 'Failed to resolve traffic link');
          }
        } else {
          const response = await api.getDefaultTemplate();
          if (response.success && response.data) {
            const template = response.data as TemplateData;
            setTemplateData(template);

            // Try to load default traffic link for this template
            try {
              const trafficLinkResponse = await api.getDefaultTrafficLink(template.id);
              if (trafficLinkResponse.success && trafficLinkResponse.data) {
                setTrafficLinkData(trafficLinkResponse.data as TrafficLinkData);
                console.log('[LandingPage] Loaded default traffic link for default template:', trafficLinkResponse.data);
              }
            } catch (err) {
              console.log('[LandingPage] No default traffic link available for default template:', err);
            }
          } else {
            setError(response.error || 'No default template configured');
          }
        }
      } catch (err) {
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [visitorId, slug, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!templateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No template to display</p>
        </div>
      </div>
    );
  }

  if (templateData.template_type === 'react') {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <DynamicTemplateLoader
            templateSlug={templateData.slug}
            visitorId={visitorId}
            templateId={templateData.id}
            trafficLinkId={trafficLinkData?.id}
            trafficLink={trafficLinkData}
            apiKey={templateData.api_key}
            componentCode={templateData.component_code}
          />
        </div>
        <GlobalFooter
          domainName={siteSettings?.domain_name}
          copyrightText={siteSettings?.copyright_text}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <TemplateRenderer
          htmlContent={templateData.html_content || ''}
          cssContent={templateData.css_content}
          jsContent={templateData.js_content}
          templateId={templateData.id}
          visitorId={visitorId}
          trafficLinkId={trafficLinkData?.id}
          apiKey={templateData.api_key}
        />
        <ConversionTracker
          conversionId={visitorId}
          templateId={String(templateData.id)}
        />
      </div>
      <GlobalFooter
        domainName={siteSettings?.domain_name}
        copyrightText={siteSettings?.copyright_text}
      />
    </div>
  );
}
