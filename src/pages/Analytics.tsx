import { useEffect, useState } from 'react';
import { TrendingUp, Users, MousePointerClick, Target } from 'lucide-react';
import { getConfig } from '../config/config';

interface TemplateAnalytics {
  id: number;
  name: string;
  totalPageViews: number;
  totalVisitors: number;
  totalConversions: number;
  conversionRate: number;
  topLinks: Array<{
    id: number;
    name: string;
    url: string;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }>;
}

export default function Analytics() {
  const [templates, setTemplates] = useState<TemplateAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const templatesRes = await fetch(`${apiUrl}/api/admin/templates`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const templatesData = await templatesRes.json();

      if (templatesData.success) {
        const analyticsPromises = templatesData.data.map(async (template: any) => {
          const analyticsRes = await fetch(
            `${apiUrl}/api/admin/analytics/template/${template.id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          const analyticsData = await analyticsRes.json();
          return {
            id: template.id,
            name: template.name,
            ...analyticsData.data,
          };
        });

        const analytics = await Promise.all(analyticsPromises);
        setTemplates(analytics);
        if (analytics.length > 0 && !selectedTemplate) {
          setSelectedTemplate(analytics[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedData = templates.find(t => t.id === selectedTemplate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No analytics data yet</h3>
          <p className="text-gray-600">Create templates and traffic links to start tracking performance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Monitor your landing page performance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Template
        </label>
        <select
          value={selectedTemplate || ''}
          onChange={(e) => setSelectedTemplate(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {selectedData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MousePointerClick className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Page Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {selectedData.totalPageViews.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900">
                {selectedData.totalVisitors.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Conversions</p>
              <p className="text-3xl font-bold text-gray-900">
                {selectedData.totalConversions.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {selectedData.conversionRate.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Top Performing Links</h2>
            </div>

            {selectedData.topLinks.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">No traffic links created yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CVR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedData.topLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{link.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 truncate max-w-xs block">
                            {link.url}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{link.clicks}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600">{link.conversions}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {link.conversionRate.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-indigo-100 mb-1">Average Visitors per Link</p>
                  <p className="text-2xl font-bold">
                    {selectedData.topLinks.length > 0
                      ? Math.round(selectedData.totalVisitors / selectedData.topLinks.length)
                      : 0}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-indigo-100 mb-1">Active Traffic Links</p>
                  <p className="text-2xl font-bold">{selectedData.topLinks.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={`/template/${selectedData.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-900">Preview Template</span>
                  <span className="text-gray-600">→</span>
                </a>
                <button
                  onClick={() => window.location.href = '/admin/traffic'}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-900">Create Traffic Link</span>
                  <span className="text-gray-600">→</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
