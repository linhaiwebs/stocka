import React, { Suspense, lazy } from 'react';
import { TemplateProvider } from '../contexts/TemplateContext';
import { templateRegistry } from './template-registry.generated';
import { DynamicReactRenderer } from './DynamicReactRenderer';

interface DynamicTemplateLoaderProps {
  templateSlug: string;
  visitorId: string;
  templateId: number;
  trafficLinkId?: number;
  trafficLink?: {
    id: number;
    name: string;
    url: string;
    source?: string;
    campaign?: string;
  };
  apiKey: string;
  componentCode?: string;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg">Loading template...</p>
      </div>
    </div>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Template Error</h2>
        <p className="text-slate-600 mb-4">
          Failed to load the template. Please try refreshing the page.
        </p>
        <p className="text-sm text-slate-500">{error.message}</p>
      </div>
    </div>
  );
}

class TemplateErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export function DynamicTemplateLoader({
  templateSlug,
  visitorId,
  templateId,
  trafficLinkId,
  trafficLink,
  apiKey,
  componentCode,
}: DynamicTemplateLoaderProps) {
  // If component_code is provided, use dynamic rendering
  if (componentCode && componentCode.trim()) {
    return (
      <TemplateErrorBoundary>
        <TemplateProvider
          visitorId={visitorId}
          templateId={templateId}
          trafficLinkId={trafficLinkId}
          trafficLink={trafficLink}
          apiKey={apiKey}
        >
          <DynamicReactRenderer
            componentCode={componentCode}
            templateId={templateId}
            visitorId={visitorId}
            trafficLinkId={trafficLinkId}
            trafficData={trafficLink}
          />
        </TemplateProvider>
      </TemplateErrorBoundary>
    );
  }

  // Fallback to static template registry (for backwards compatibility)
  const templateLoader = templateRegistry[templateSlug];

  if (!templateLoader) {
    return (
      <ErrorFallback
        error={new Error(`Template "${templateSlug}" not found in registry`)}
      />
    );
  }

  const TemplateComponent = lazy(templateLoader);

  return (
    <TemplateErrorBoundary>
      <TemplateProvider
        visitorId={visitorId}
        templateId={templateId}
        trafficLinkId={trafficLinkId}
        trafficLink={trafficLink}
        apiKey={apiKey}
      >
        <Suspense fallback={<LoadingFallback />}>
          <TemplateComponent
            templateId={templateId}
            visitorId={visitorId}
            trafficLinkId={trafficLinkId}
            trafficData={trafficLink}
          />
        </Suspense>
      </TemplateProvider>
    </TemplateErrorBoundary>
  );
}
