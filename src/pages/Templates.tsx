import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Copy, ExternalLink, FileText, RefreshCw, Star, Edit2, X } from 'lucide-react';
import { getConfig } from '../config/config';

type TemplateCategory = 'input-form' | 'standard' | 'free';

interface Template {
  id: number;
  name: string;
  slug: string;
  api_key: string;
  template_type?: 'html' | 'react';
  template_category?: TemplateCategory;
  component_name?: string;
  is_default?: number;
  page_title?: string;
  page_description?: string;
  created_at: string;
  updated_at: string;
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  'input-form': '输入框',
  'standard': '通版',
  'free': '无料'
};

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  'input-form': 'bg-blue-100 text-blue-700',
  'standard': 'bg-green-100 text-green-700',
  'free': 'bg-gray-100 text-gray-700'
};

export default function Templates() {
  const { t } = useTranslation('admin');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editForm, setEditForm] = useState({ page_title: '', page_description: '' });

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const categoryParam = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await fetch(`${apiUrl}/api/admin/templates${categoryParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTemplates = async () => {
    setSyncing(true);

    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const scanResponse = await fetch(`${apiUrl}/api/admin/templates/scan-components`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const scanData = await scanResponse.json();
      if (!scanData.success) {
        alert('Failed to scan templates');
        return;
      }

      const newComponents = scanData.data.filter((c: any) => !c.exists);

      if (newComponents.length === 0) {
        alert('All templates are already up to date!');
        return;
      }

      const componentNames = newComponents.map((c: any) => c.componentName);

      const importResponse = await fetch(`${apiUrl}/api/admin/templates/import-components`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ components: componentNames }),
      });

      const importData = await importResponse.json();
      if (importData.success) {
        fetchTemplates();
        const importedCount = importData.data.imported.length;
        const skippedCount = importData.data.skipped.length;
        alert(`Successfully synchronized ${importedCount} new template(s)${skippedCount > 0 ? `, ${skippedCount} skipped` : ''}`);
      }
    } catch (error) {
      console.error('Failed to sync templates:', error);
      alert('Failed to sync templates. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm(t('templates.deleteConfirm'))) return;

    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${apiUrl}/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key copied to clipboard!');
  };

  const handleSetDefault = async (id: number) => {
    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${apiUrl}/api/admin/templates/${id}/set-default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchTemplates();
        alert('Default template updated successfully!');
      }
    } catch (error) {
      console.error('Failed to set default template:', error);
      alert('Failed to set default template');
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setEditForm({
      page_title: template.page_title || '',
      page_description: template.page_description || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTemplate) return;

    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${apiUrl}/api/admin/templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_title: editForm.page_title || null,
          page_description: editForm.page_description || null
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchTemplates();
        setEditingTemplate(null);
        alert('Template updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update template:', error);
      alert('Failed to update template');
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
          <h1 className="text-3xl font-bold text-gray-900">{t('templates.title')}</h1>
          <p className="text-gray-600 mt-2">管理您的落地页模板</p>
        </div>
        <button
          onClick={handleSyncTemplates}
          disabled={syncing}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? '同步中...' : '同步模板'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">分类筛选：</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setSelectedCategory('input-form')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === 'input-form'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            输入框
          </button>
          <button
            onClick={() => setSelectedCategory('standard')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === 'standard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            通版
          </button>
          <button
            onClick={() => setSelectedCategory('free')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === 'free'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            无料
          </button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-600 mb-6">Click the "Sync Templates" button above to import templates from the templates directory</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      template.template_type === 'react'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {template.template_type === 'react' ? 'React' : 'HTML'}
                    </span>
                    {template.template_category && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[template.template_category]}`}>
                        {CATEGORY_LABELS[template.template_category]}
                      </span>
                    )}
                    {template.is_default === 1 && (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        <Star className="w-3 h-3 fill-current" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Slug:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{template.slug}</span>
                    </div>
                    {template.template_type === 'react' && template.component_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Component:</span>
                        <span className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-700">
                          {template.component_name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">API Key:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {template.api_key.substring(0, 20)}...
                      </span>
                      <button
                        onClick={() => copyApiKey(template.api_key)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy API Key"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(template.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {template.is_default !== 1 && (
                    <button
                      onClick={() => handleSetDefault(template.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Set as Default"
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Page Title"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <a
                    href={`/template/${template.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview Template"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Template"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Page Title & Description</h2>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                  <span className="text-gray-500 font-normal ml-2">(50-60 characters recommended)</span>
                </label>
                <input
                  type="text"
                  value={editForm.page_title}
                  onChange={(e) => setEditForm({ ...editForm, page_title: e.target.value })}
                  placeholder="e.g., AI Stock Analysis Tool - Make Better Investment Decisions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {editForm.page_title.length} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Description (Meta Description)
                  <span className="text-gray-500 font-normal ml-2">(150-160 characters recommended)</span>
                </label>
                <textarea
                  value={editForm.page_description}
                  onChange={(e) => setEditForm({ ...editForm, page_description: e.target.value })}
                  placeholder="e.g., Discover powerful AI-driven stock analysis tools to make informed investment decisions. Get real-time insights and predictions."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  maxLength={300}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {editForm.page_description.length} characters
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">SEO Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Page title shows in browser tabs and search results</li>
                  <li>Description appears in search engine result snippets</li>
                  <li>Include relevant keywords naturally</li>
                  <li>Leave blank to use template name as default title</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingTemplate(null)}
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
