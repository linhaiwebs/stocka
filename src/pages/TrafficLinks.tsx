import { useEffect, useState } from 'react';
import { Plus, ExternalLink, Copy, Trash2, Link as LinkIcon, Edit2, X } from 'lucide-react';
import { getConfig } from '../config/config';

interface Template {
  id: number;
  name: string;
}

interface TrafficLink {
  id: number;
  template_id: number;
  name: string;
  link_slug: string;
  url: string;
  clicks: number;
  conversions: number;
  page_title_override?: string;
  page_description_override?: string;
  created_at: string;
}

export default function TrafficLinks() {
  const [links, setLinks] = useState<TrafficLink[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLink, setNewLink] = useState({ template_id: '', name: '', url: '' });
  const [creating, setCreating] = useState(false);
  const [editingLink, setEditingLink] = useState<TrafficLink | null>(null);
  const [editForm, setEditForm] = useState({ page_title_override: '', page_description_override: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const [linksRes, templatesRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/traffic`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/admin/templates`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const linksData = await linksRes.json();
      const templatesData = await templatesRes.json();

      if (linksData.success) setLinks(linksData.data);
      if (templatesData.success) setTemplates(templatesData.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${apiUrl}/api/admin/traffic`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: parseInt(newLink.template_id),
          name: newLink.name,
          url: newLink.url,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewLink({ template_id: '', name: '', url: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create traffic link:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Are you sure you want to delete this traffic link?')) return;

    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${apiUrl}/api/admin/traffic/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete traffic link:', error);
    }
  };

  const copyLink = (link_slug: string) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/l/${link_slug}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Link copied to clipboard!');
  };

  const getConversionRate = (clicks: number, conversions: number) => {
    if (clicks === 0) return '0.00';
    return ((conversions / clicks) * 100).toFixed(2);
  };

  const getTemplateName = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || 'Unknown Template';
  };

  const handleEditLink = (link: TrafficLink) => {
    setEditingLink(link);
    setEditForm({
      page_title_override: link.page_title_override || '',
      page_description_override: link.page_description_override || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingLink) return;

    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${apiUrl}/api/admin/traffic/${editingLink.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_title_override: editForm.page_title_override || null,
          page_description_override: editForm.page_description_override || null
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
        setEditingLink(null);
        alert('Traffic link updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update traffic link:', error);
      alert('Failed to update traffic link');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Traffic Links</h1>
          <p className="text-gray-600 mt-2">Create and manage tracking links for your campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          disabled={templates.length === 0}
        >
          <Plus className="w-5 h-5" />
          New Traffic Link
        </button>
      </div>

      {templates.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Please create a template first before creating traffic links.
        </div>
      )}

      {links.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <LinkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No traffic links yet</h3>
          <p className="text-gray-600 mb-6">Create your first traffic link to start tracking conversions</p>
          {templates.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Traffic Link
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{link.name}</div>
                      <div className="text-sm text-gray-500">{link.url}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getTemplateName(link.template_id)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        /l/{link.link_slug}
                      </code>
                      <button
                        onClick={() => copyLink(link.link_slug)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy Link"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <a
                        href={`/l/${link.link_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Open Link"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{link.clicks}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">{link.conversions}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {getConversionRate(link.clicks, link.conversions)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditLink(link)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Page Title"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Traffic Link</h2>
            </div>

            <form onSubmit={handleCreateLink} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template
                </label>
                <select
                  value={newLink.template_id}
                  onChange={(e) => setNewLink({ ...newLink, template_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                >
                  <option value="">Choose a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Black Friday Campaign"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conversion URL
                </label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="https://example.com/signup"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Users will be redirected here when they click a CTA button
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Traffic Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewLink({ template_id: '', name: '', url: '' });
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Page Title Override</h2>
              <button
                onClick={() => setEditingLink(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={editingLink.name}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <input
                  type="text"
                  value={getTemplateName(editingLink.template_id)}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title Override
                  <span className="text-gray-500 font-normal ml-2">(50-60 characters recommended)</span>
                </label>
                <input
                  type="text"
                  value={editForm.page_title_override}
                  onChange={(e) => setEditForm({ ...editForm, page_title_override: e.target.value })}
                  placeholder="Leave empty to use template's default title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {editForm.page_title_override.length} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Description Override
                  <span className="text-gray-500 font-normal ml-2">(150-160 characters recommended)</span>
                </label>
                <textarea
                  value={editForm.page_description_override}
                  onChange={(e) => setEditForm({ ...editForm, page_description_override: e.target.value })}
                  placeholder="Leave empty to use template's default description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  maxLength={300}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {editForm.page_description_override.length} characters
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">A/B Testing with Title Overrides:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Override the template's default title for this specific traffic link</li>
                  <li>Perfect for testing different messaging for different campaigns</li>
                  <li>Priority: Traffic Link Override → Template Title → Template Name</li>
                  <li>Leave empty to fall back to template's default settings</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingLink(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
