import { useState, useEffect } from 'react';
import { Save, FileText, Shield } from 'lucide-react';
import { api } from '../services/api';

export default function LegalPages() {
  const [settings, setSettings] = useState({
    domain_name: '',
    copyright_text: '',
    privacy_policy_content: '',
    terms_of_service_content: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSiteSettings();
      if (data) {
        setSettings({
          domain_name: data.domain_name,
          copyright_text: data.copyright_text,
          privacy_policy_content: data.privacy_policy_content,
          terms_of_service_content: data.terms_of_service_content,
        });
      }
    } catch (err) {
      console.error('Error loading site settings:', err);
      setError('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.updateSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving site settings:', err);
      setError('Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Legal Pages & Footer</h1>
        <p className="text-gray-600 mt-2">Manage your site's legal content and footer information</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Footer Settings</h2>
                <p className="text-sm text-gray-600">Configure the footer displayed on all pages</p>
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
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Your website's domain name displayed in the footer
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
                required
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
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
                <p className="text-sm text-gray-600">Content displayed on the Privacy Policy page</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Policy Content
              </label>
              <textarea
                value={settings.privacy_policy_content}
                onChange={(e) => setSettings({ ...settings, privacy_policy_content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
                rows={12}
                placeholder="Enter your privacy policy content here..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                This content will be displayed on the /privacy-policy page
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
                <p className="text-sm text-gray-600">Content displayed on the Terms of Service page</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms of Service Content
              </label>
              <textarea
                value={settings.terms_of_service_content}
                onChange={(e) => setSettings({ ...settings, terms_of_service_content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
                rows={12}
                placeholder="Enter your terms of service content here..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                This content will be displayed on the /terms-of-service page
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {saved && (
            <span className="text-green-600 font-medium">
              ✓ Settings saved successfully!
            </span>
          )}
        </div>
      </form>

      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Footer Preview</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-center space-y-3">
            <p className="text-sm">{settings.copyright_text}</p>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm hover:text-blue-200 cursor-pointer">Privacy Policy</span>
              <span className="text-white/50">|</span>
              <span className="text-sm hover:text-blue-200 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-blue-100 mt-4">
          This footer will automatically appear at the bottom of all landing pages and templates.
        </p>
      </div>
    </div>
  );
}
