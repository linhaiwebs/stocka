import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, FileText, Link2, TrendingUp, Users, MousePointerClick } from 'lucide-react';
import { getConfig } from '../config/config';

interface DashboardStats {
  totalTemplates: number;
  totalLinks: number;
  totalVisitors: number;
  totalConversions: number;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const { t } = useTranslation('admin');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const config = getConfig();
      const apiUrl = config.api.baseUrl || '';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: t('dashboard.activeTemplates'),
      value: stats?.totalTemplates || 0,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/templates',
    },
    {
      title: t('dashboard.activeLinks'),
      value: stats?.totalLinks || 0,
      icon: Link2,
      color: 'bg-cyan-500',
      link: '/admin/traffic',
    },
    {
      title: t('dashboard.visitors'),
      value: stats?.totalVisitors || 0,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/analytics',
    },
    {
      title: t('dashboard.conversionsLabel'),
      value: stats?.totalConversions || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/admin/analytics',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mt-2">欢迎使用落地页管理系统</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">快捷操作</h2>
          <div className="space-y-3">
            <Link
              to="/admin/templates"
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">创建新模板</span>
            </Link>
            <Link
              to="/admin/traffic"
              className="flex items-center gap-3 p-4 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors"
            >
              <Link2 className="w-5 h-5" />
              <span className="font-medium">创建流量链接</span>
            </Link>
            <Link
              to="/admin/analytics"
              className="flex items-center gap-3 p-4 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">查看数据分析</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.recentActivity')}</h2>
          <div className="space-y-3">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <MousePointerClick className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">{t('dashboard.noRecentActivity')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">快速开始</h2>
        <p className="text-blue-100 mb-6">
          按照以下步骤开始追踪您的落地页转化数据
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">1</div>
            <h3 className="font-semibold mb-1">创建模板</h3>
            <p className="text-sm text-blue-100">上传或设计您的落地页</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">2</div>
            <h3 className="font-semibold mb-1">创建流量链接</h3>
            <p className="text-sm text-blue-100">为您的营销活动生成追踪链接</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">3</div>
            <h3 className="font-semibold mb-1">追踪数据</h3>
            <p className="text-sm text-blue-100">实时监控访客和转化数据</p>
          </div>
        </div>
      </div>
    </div>
  );
}
