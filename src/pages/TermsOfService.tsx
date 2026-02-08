import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GlobalFooter } from '../components/GlobalFooter';
import { api } from '../services/api';

export default function TermsOfService() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<{ domain_name: string; copyright_text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [termsData, settingsData] = await Promise.all([
          api.getTermsOfService(),
          api.getPublicSiteSettings()
        ]);
        setContent(termsData.content);
        setSiteSettings(settingsData);
      } catch (error) {
        console.error('Error fetching terms of service:', error);
        setContent('Failed to load terms of service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Link
            to="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8">Terms of Service</h1>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <GlobalFooter
        domainName={siteSettings?.domain_name}
        copyrightText={siteSettings?.copyright_text}
      />
    </div>
  );
}
