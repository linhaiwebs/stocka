export interface TemplateManifest {
  name: string;
  description: string;
  version: string;
  category: string;
  templateCategory?: 'input-form' | 'standard' | 'free';
  isDefault: boolean;
  slug: string;
  componentName: string;
}

export interface TemplateProps {
  templateId: number;
  visitorId: string;
  trafficLinkId?: number;
  trafficData?: {
    name: string;
    url: string;
    source?: string;
    campaign?: string;
  };
  templateConfig?: Record<string, unknown>;
}
