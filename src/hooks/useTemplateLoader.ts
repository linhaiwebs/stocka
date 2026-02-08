import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';

interface TemplateContent {
  html_content: string;
  css_content: string;
  js_content: string;
}

export function useTemplateLoader(templateId: string | null) {
  const [template, setTemplate] = useState<TemplateContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setLoading(false);
      return;
    }

    const loadTemplate = async () => {
      try {
        setLoading(true);
        const response = await api.getTemplate(templateId);

        if (response.success && response.data) {
          setTemplate(response.data as TemplateContent);
          storage.setTemplateId(templateId);
        } else {
          setError(response.error || 'Failed to load template');
        }
      } catch (err) {
        setError('Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  return { template, loading, error };
}
