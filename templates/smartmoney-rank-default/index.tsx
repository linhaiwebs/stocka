import { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  Zap,
  Eye,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const TICKER_ITEMS = [
  'NVDA +12.3%',
  'TSLA +8.7%',
  'AAPL +5.2%',
  'GOOGL +6.9%',
  'MSFT +4.1%',
  'META +9.8%',
  'AMD +11.5%',
  'AMZN +7.3%',
];

const RANKINGS = [
  { rank: 1, name: 'Warren Capital', score: 98.5, change: '+2.3%', trend: 'up' },
  { rank: 2, name: 'Vanguard Elite', score: 96.2, change: '+1.8%', trend: 'up' },
  { rank: 3, name: 'BlackStone Pro', score: 94.7, change: '-0.5%', trend: 'down' },
  { rank: 4, name: 'Goldman Trust', score: 93.1, change: '+3.2%', trend: 'up' },
  { rank: 5, name: 'Morgan Wealth', score: 91.8, change: '+1.1%', trend: 'up' },
  { rank: 6, name: 'Citadel Group', score: 90.3, change: '-1.2%', trend: 'down' },
  { rank: 7, name: 'Renaissance Fund', score: 89.5, change: '+0.8%', trend: 'up' },
  { rank: 8, name: 'Bridgewater', score: 87.9, change: '+2.1%', trend: 'up' },
];

const FAQS = [
  {
    question: 'How accurate is the SmartMoney tracking data?',
    answer: 'Our data is sourced directly from SEC filings and updated in real-time. We have a 99.8% accuracy rate verified by independent auditors.',
  },
  {
    question: 'Can I track multiple investors simultaneously?',
    answer: 'Yes! You can track unlimited investors across different portfolios. Our advanced dashboard allows you to organize and monitor all your tracked investors in one place.',
  },
  {
    question: 'How often are the rankings updated?',
    answer: 'Rankings are recalculated every 4 hours based on the latest market data, portfolio performance, and trading activity of tracked investors.',
  },
  {
    question: 'What makes SmartMoney Rank different from competitors?',
    answer: 'We combine AI-powered analytics with real-time institutional data, providing deeper insights that go beyond basic tracking. Our proprietary scoring algorithm has been refined over 5 years.',
  },
];

export default function SmartMoneyRankDefault({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trackTabSwitch, trafficLink } = useTemplate();
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const config = getConfig();
    const apiUrl = config.api.baseUrl || '';
    const script = document.createElement('script');
    script.src = `${apiUrl}/api/analytics/tracking-script/${templateId}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [templateId]);

  const handleTabChange = (newTab: string) => {
    trackTabSwitch(activeTab, newTab);
    setActiveTab(newTab);
  };

  const handleConversionClick = (ctaType: string) => {
    console.log('[SmartMoney] Button clicked:', ctaType);
    console.log('[SmartMoney] TrafficLink data:', trafficLink);

    trackClick(`cta-${ctaType}`, 'button');
    trackConversion(ctaType);

    if (trafficLink?.url) {
      console.log('[SmartMoney] Opening URL:', trafficLink.url);
      window.open(trafficLink.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('[SmartMoney] No traffic link URL available. Please create a traffic link in the admin dashboard.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Real-Time Data</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>SEC Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>AI-Powered Analytics</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight">
            Track <span className="text-blue-200">SmartMoney</span> Moves
            <br />Before The Market Reacts
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 text-center max-w-3xl mx-auto mb-12">
            Get instant alerts when top institutional investors make moves. Join 50,000+ traders using SmartMoney Rank to stay ahead.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleConversionClick('hero-primary')}
              className="group px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
            >
              Start Tracking Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleConversionClick('hero-secondary')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200"
            >
              Watch Demo
            </button>
          </div>

          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20">
            <div className="flex items-center gap-4 px-6 py-3 border-b border-white/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Today's Top Movers</span>
            </div>
            <div className="relative overflow-hidden h-12">
              <div className="absolute animate-scroll flex items-center gap-8 px-6 h-12">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                    <span className="font-semibold">{item}</span>
                    <span className="w-1 h-1 rounded-full bg-white/50"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Live Investor Rankings
          </h2>
          <p className="text-xl text-slate-600">
            Updated every 4 hours based on performance and activity
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold text-slate-900">Rank</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold text-slate-900">Investor</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm font-semibold text-slate-900">Score</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm font-semibold text-slate-900 hidden md:table-cell">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {RANKINGS.map((item) => (
                  <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="font-semibold text-slate-900">{item.name}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-lg font-bold text-slate-900">{item.score}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.trend === 'up' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => handleConversionClick('ranking-cta')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            View Full Rankings
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Advanced Tracking Dashboard
            </h2>
            <p className="text-xl text-slate-600">
              Monitor investor activity across multiple timeframes
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <div className="flex border-b border-slate-200 overflow-x-auto">
              {['overview', 'holdings', 'trades', 'performance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-4 font-semibold capitalize whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                      <div className="text-sm text-blue-700 font-semibold mb-2">Total Investors</div>
                      <div className="text-3xl font-bold text-blue-900">2,847</div>
                      <div className="text-sm text-blue-600 mt-2">+127 this month</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                      <div className="text-sm text-green-700 font-semibold mb-2">Active Trades</div>
                      <div className="text-3xl font-bold text-green-900">1,234</div>
                      <div className="text-sm text-green-600 mt-2">+89 today</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
                      <div className="text-sm text-amber-700 font-semibold mb-2">Avg Return</div>
                      <div className="text-3xl font-bold text-amber-900">+18.3%</div>
                      <div className="text-sm text-amber-600 mt-2">Last 90 days</div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-center">
                    Real-time data updated every 15 minutes
                  </p>
                </div>
              )}

              {activeTab === 'holdings' && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Portfolio Holdings Analysis
                  </h3>
                  <p className="text-slate-600 mb-6">
                    View detailed breakdowns of institutional holdings across sectors
                  </p>
                  <button
                    onClick={() => handleConversionClick('holdings-tab-cta')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Unlock Holdings Data
                  </button>
                </div>
              )}

              {activeTab === 'trades' && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Recent Trade Activity
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Get instant notifications when tracked investors make moves
                  </p>
                  <button
                    onClick={() => handleConversionClick('trades-tab-cta')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Enable Trade Alerts
                  </button>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Performance Metrics
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Track ROI, win rate, and performance trends over time
                  </p>
                  <button
                    onClick={() => handleConversionClick('performance-tab-cta')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Performance Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Track SmartMoney
          </h2>
          <p className="text-xl text-slate-600">
            Professional-grade tools trusted by thousands of traders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Monitoring</h3>
            <p className="text-slate-600">
              Track every move from 2,800+ institutional investors in real-time with instant alerts.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced Analytics</h3>
            <p className="text-slate-600">
              AI-powered insights that identify patterns and predict market-moving trades before they happen.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Alerts</h3>
            <p className="text-slate-600">
              Customizable notifications via email, SMS, and push for trades that match your criteria.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">SEC Verified Data</h3>
            <p className="text-slate-600">
              All data sourced directly from official SEC filings with 99.8% accuracy guarantee.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Fast</h3>
            <p className="text-slate-600">
              Sub-second data updates ensure you're always first to know about institutional moves.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Portfolio Tracking</h3>
            <p className="text-slate-600">
              Follow entire portfolios or specific positions with detailed historical performance data.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about SmartMoney Rank
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Track SmartMoney?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 50,000+ traders who are already ahead of the market. Start tracking institutional investors for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleConversionClick('footer-primary')}
              className="px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleConversionClick('footer-secondary')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200"
            >
              View Pricing
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            No credit card required • Cancel anytime • 14-day free trial
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .bg-grid-white\\/\\[0\\.05\\] {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
