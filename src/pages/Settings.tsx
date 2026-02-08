import { useState, useEffect } from 'react';
import { Save, Globe, AlertCircle, BarChart3 } from 'lucide-react';
import { api } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    domain_name: '',
    copyright_text: '',
    google_analytics_id: '',
    google_ads_id: '',
    google_ads_conversion_id: '',
    conversion_event_name: 'conversion',
    analytics_enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSiteSettings();
      setSettings({
        domain_name: data.domain_name || '',
        copyright_text: data.copyright_text || '',
        google_analytics_id: data.google_analytics_id || '',
        google_ads_id: data.google_ads_id || '',
        google_ads_conversion_id: data.google_ads_conversion_id || '',
        conversion_event_name: data.conversion_event_name || 'conversion',
        analytics_enabled: data.analytics_enabled === 1,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.updateSiteSettings({
        domain_name: settings.domain_name,
        copyright_text: settings.copyright_text,
        google_analytics_id: settings.google_analytics_id || undefined,
        google_ads_id: settings.google_ads_id || undefined,
        google_ads_conversion_id: settings.google_ads_conversion_id || undefined,
        conversion_event_name: settings.conversion_event_name || 'conversion',
        analytics_enabled: settings.analytics_enabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure site settings and Google Analytics tracking</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
                <p className="text-sm text-gray-600">Configure your site information</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain Name
              </label>
              <input
                type="text"
                value={settings.domain_name}
                onChange={(e) => setSettings({ ...settings, domain_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="example.com"
              />
              <p className="text-sm text-gray-500 mt-2">
                Your website domain (displayed in footer and legal pages)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={settings.copyright_text}
                onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="© 2024 All rights reserved."
              />
              <p className="text-sm text-gray-500 mt-2">
                Copyright notice displayed in the footer
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Google Analytics Tracking</h2>
                <p className="text-sm text-gray-600">Configure Google Analytics and conversion tracking</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Analytics Tracking
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  {settings.analytics_enabled
                    ? 'Analytics scripts will be loaded on all pages'
                    : 'Analytics scripts are currently disabled'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, analytics_enabled: !settings.analytics_enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.analytics_enabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.analytics_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {!settings.analytics_enabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Analytics tracking is currently disabled. No tracking scripts will be loaded regardless of the configuration below.
                  Enable the toggle above to activate tracking.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.google_analytics_id}
                onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-sm text-gray-500 mt-2">
                Your Google Analytics 4 measurement ID (format: G-XXXXXXXXXX). Get it from{' '}
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  Google Analytics
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Ads ID
              </label>
              <input
                type="text"
                value={settings.google_ads_id}
                onChange={(e) => setSettings({ ...settings, google_ads_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="AW-XXXXXXXXXX"
              />
              <p className="text-sm text-gray-500 mt-2">
                Your Google Ads conversion tracking ID (format: AW-XXXXXXXXXX)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Ads Conversion ID
              </label>
              <input
                type="text"
                value={settings.google_ads_conversion_id}
                onChange={(e) => setSettings({ ...settings, google_ads_conversion_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="AW-XXXXXXXXXX/YYYYYYYYYY"
              />
              <p className="text-sm text-gray-500 mt-2">
                Full conversion tracking ID for Google Ads (format: AW-XXXXXXXXXX/YYYYYYYYYY)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion Event Name
              </label>
              <input
                type="text"
                value={settings.conversion_event_name}
                onChange={(e) => setSettings({ ...settings, conversion_event_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="conversion"
              />
              <p className="text-sm text-gray-500 mt-2">
                Event name used for conversion tracking (default: "conversion")
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          {saved && (
            <span className="text-green-600 font-medium">
              Settings saved successfully!
            </span>
          )}
        </div>
      </form>

      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Integration Guide</h2>
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold mb-2">Google Analytics</h3>
            <p className="text-sm text-blue-100">
              Once configured and enabled, all page views and conversions will be automatically tracked
              in your Google Analytics dashboard with custom event labels.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold mb-2">Google Ads Conversion Tracking</h3>
            <p className="text-sm text-blue-100">
              Track conversions for your Google Ads campaigns. Conversion events will fire
              automatically when users complete actions on your landing pages using the configured event name.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold mb-2">Master Switch</h3>
            <p className="text-sm text-blue-100">
              Use the "Enable Analytics Tracking" toggle to turn all tracking on or off globally.
              When disabled, no tracking scripts will be loaded regardless of whether IDs are configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
