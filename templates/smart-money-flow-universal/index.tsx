import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Shield,
  Zap,
  Eye,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Users,
  Brain,
  Lock,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const TICKER_ITEMS = [
  { symbol: 'NVDA', change: '+12.3%', positive: true },
  { symbol: 'TSLA', change: '+8.7%', positive: true },
  { symbol: 'AAPL', change: '+5.2%', positive: true },
  { symbol: 'GOOGL', change: '-2.1%', positive: false },
  { symbol: 'MSFT', change: '+4.1%', positive: true },
  { symbol: 'META', change: '+9.8%', positive: true },
  { symbol: 'AMD', change: '-3.2%', positive: false },
  { symbol: 'AMZN', change: '+7.3%', positive: true },
];

const MARKET_SECTORS = [
  { name: 'Banks', change: '+2.3%', positive: true },
  { name: 'Semi', change: '+5.7%', positive: true },
  { name: 'AI', change: '+8.9%', positive: true },
  { name: 'Auto', change: '-1.2%', positive: false },
  { name: 'Robo', change: '+4.5%', positive: true },
  { name: 'Energy', change: '+3.1%', positive: true },
  { name: 'Bio', change: '-0.8%', positive: false },
  { name: 'Steel', change: '+1.9%', positive: true },
  { name: 'Trading', change: '+6.4%', positive: true },
];

const SURVIVAL_RULES = [
  {
    number: 1,
    title: 'Never predict - Follow the flow',
    content: 'Top traders don\'t make money by predicting market movements. They make money by following institutional money flows. When smart money moves, retail investors often miss it until it\'s too late. Our system tracks these flows in real-time, giving you the edge you need.'
  },
  {
    number: 2,
    title: 'Track holdings over $2M in 13F filings',
    content: 'Institutional investors with over $100M in assets must file 13F reports quarterly. Focus on positions over $2M - these represent significant conviction. We analyze every filing within hours of release, highlighting the most impactful changes before the market reacts.'
  },
  {
    number: 3,
    title: 'Analyze recent flows, not old data',
    content: 'Historical data is important, but recent flows reveal current sentiment. A fund manager buying millions in shares today tells you more than what they held last quarter. Our AI identifies emerging patterns in real-time flow data that traditional analysis misses.'
  },
  {
    number: 4,
    title: 'Fundamentals matter, but timing is everything',
    content: 'Good fundamentals can take years to play out. Smart money knows when to enter and exit. They use advanced analysis to time their entries. We decode their timing signals by analyzing correlations between multiple institutional moves.'
  },
  {
    number: 5,
    title: 'Follow the leaders, not the herd',
    content: 'Not all institutional investors are equal. Top performers like Renaissance, Bridgewater, and select hedge funds consistently outperform. We rank investors by historical performance and give more weight to moves from proven winners.'
  },
  {
    number: 6,
    title: 'Diversify your information sources',
    content: 'Relying on a single analysis method is risky. Combine 13F tracking with insider transactions, options flow, and technical analysis. Our platform integrates multiple data sources to give you a complete picture of smart money activity.'
  }
];

const KEY_LEGENDS = [
  {
    icon: Target,
    title: 'Paul Tudor Jones',
    description: 'Master of macro trading, predicted 1987 crash',
    lessons: [
      'Never risk more than 1% per trade',
      'Cut losses quickly, let winners run',
      'Always have an exit plan before entry'
    ]
  },
  {
    icon: Brain,
    title: 'Steven Cohen',
    description: 'Built SAC Capital into $14B powerhouse',
    lessons: [
      'Information edge is temporary',
      'Speed of execution matters',
      'Adapt or die in changing markets'
    ]
  },
  {
    icon: Users,
    title: 'Michael Burry',
    description: 'Predicted 2008 crisis, featured in "The Big Short"',
    lessons: [
      'Do your own research deeply',
      'Be contrarian when others are greedy',
      'Patience pays in concentrated bets'
    ]
  }
];

export default function SmartMoneyFlowUniversal({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink } = useTemplate();
  const [tickerPosition, setTickerPosition] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerPosition((prev) => prev - 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleConversionClick = (ctaType: string) => {
    console.log('[SmartMoneyFlow] Button clicked:', ctaType);
    console.log('[SmartMoneyFlow] TrafficLink data:', trafficLink);

    trackClick(`cta-${ctaType}`, 'button');
    trackConversion(ctaType);

    if (trafficLink?.url) {
      console.log('[SmartMoneyFlow] Opening URL:', trafficLink.url);
      window.open(trafficLink.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('[SmartMoneyFlow] No traffic link URL available.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .gradient-cta {
          background: linear-gradient(135deg, #06b6d4 0%, #ec4899 100%);
        }
        .gradient-cta:hover {
          background: linear-gradient(135deg, #0891b2 0%, #db2777 100%);
        }
      `}</style>

      <div className="bg-black/50 backdrop-blur-sm border-b border-purple-500/20 overflow-hidden">
        <div className="flex items-center gap-8 py-3">
          <div className="flex items-center gap-2 px-6 text-yellow-400 font-semibold whitespace-nowrap">
            <TrendingUp className="w-5 h-5" />
            <span>Live Markets</span>
          </div>
          <div className="relative overflow-hidden flex-1">
            <div className="animate-scroll flex items-center gap-8 whitespace-nowrap">
              {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-bold text-white">{item.symbol}</span>
                  <span className={item.positive ? 'text-green-400' : 'text-red-400'}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-500/30">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Educational Platform - Not Financial Advice</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Top traders don't make money
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              by predicting
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-4">
            They follow smart money flow. Learn from
            <span className="text-cyan-400 font-semibold"> O'Shman's </span>
            latest discussion on institutional trading patterns.
          </p>

          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-10">
            Track over $2.5 trillion in institutional holdings from 13F filings.
            Join 47,000+ traders learning to identify market-moving patterns before they happen.
          </p>

          <button
            onClick={() => handleConversionClick('hero-primary')}
            className="group gradient-cta px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <MessageCircle className="w-6 h-6" />
            Get WhatsApp → Get the pick
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Free educational content • No credit card required
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
              <h3 className="text-2xl font-bold">$247.3M</h3>
            </div>
            <p className="text-gray-300">Last 7 days trading volume tracked</p>
          </div>

          <div className="bg-gradient-to-br from-pink-800/40 to-pink-900/40 backdrop-blur-sm p-8 rounded-2xl border border-pink-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-pink-400" />
              <h3 className="text-2xl font-bold">834</h3>
            </div>
            <p className="text-gray-300">Institutional investors monitored daily</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-800/40 to-cyan-900/40 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold">94.2%</h3>
            </div>
            <p className="text-gray-300">Accuracy rate on major flow signals</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Today's Market Sectors
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {MARKET_SECTORS.map((sector, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <h3 className="font-bold text-lg mb-2">{sector.name}</h3>
                <p className={`text-2xl font-bold ${sector.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {sector.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-purple-500/30">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">
              What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Smart Money</span>?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Smart Money refers to capital controlled by institutional investors, central banks,
              and other financial professionals. These entities have access to superior information,
              analysis tools, and market intelligence. When smart money moves, markets follow.
              Learning to track these flows is not about copying trades—it's about understanding
              market structure and positioning yourself accordingly.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Key Factors & <span className="text-cyan-400">Legendary Traders</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {KEY_LEGENDS.map((legend, index) => {
              const IconComponent = legend.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-800/30 to-purple-900/30 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <IconComponent className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{legend.title}</h3>
                      <p className="text-sm text-gray-400">{legend.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {legend.lessons.map((lesson, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6">
            Why top traders don't rely
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              on predictions alone
            </span>
          </h2>
          <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
            The market is complex and unpredictable. But one thing remains constant:
            smart money leaves traces. Here's what separates winners from losers.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-cyan-500">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Eye className="w-6 h-6 text-cyan-400" />
                Smart money moves first
              </h3>
              <p className="text-gray-300">
                Institutional investors receive information and conduct analysis well before
                retail traders. By the time news reaches the public, smart money has already
                positioned itself. Following their flows means you're no longer the last to know.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-pink-500">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Brain className="w-6 h-6 text-pink-400" />
                Pattern recognition over prediction
              </h3>
              <p className="text-gray-300">
                Markets don't move randomly. They follow patterns based on participant behavior.
                Learning to recognize these patterns through smart money tracking is far more
                reliable than trying to predict future events.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-purple-500">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                Risk management is key
              </h3>
              <p className="text-gray-300">
                Even smart money gets it wrong sometimes. But they survive because they manage
                risk religiously. Every position is sized appropriately, stops are in place,
                and diversification is maintained. Protection comes first, profits second.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-green-500">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-400" />
                Education builds conviction
              </h3>
              <p className="text-gray-300">
                Understanding why smart money moves helps you hold positions when others panic.
                Knowledge of market mechanics, institutional behavior, and historical patterns
                creates the conviction needed to follow your strategy during volatility.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <button
            onClick={() => handleConversionClick('mid-page')}
            className="group gradient-cta px-10 py-6 rounded-xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            <MessageCircle className="w-7 h-7" />
            Get WhatsApp → Get the pick
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Join 47,000+ traders already learning
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              6 survival rules
            </span>
            <br />
            distilled from every story
          </h2>
          <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
            These aren't get-rich-quick schemes. They're principles that separate
            professional traders from amateurs. Study them. Apply them. Survive.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SURVIVAL_RULES.map((rule) => (
              <div
                key={rule.number}
                className="bg-gradient-to-br from-purple-900/40 to-black/40 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl font-bold">
                    {rule.number}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3">{rule.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{rule.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-gradient-to-br from-cyan-900/40 to-purple-900/40 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-cyan-500/30">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
              Real People, Real Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-2 text-cyan-400">Linda Bradford Raschke</h3>
                <p className="text-sm text-gray-400 mb-3">Professional futures trader since 1981</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Learned to trust price action over opinions</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Developed systematic approach to risk control</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Focused on pattern recognition in market structure</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-pink-400">Michael Marcus</h3>
                <p className="text-sm text-gray-400 mb-3">Turned $30K into $80M over 20 years</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Cut losses immediately, let profits run indefinitely</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Studied market psychology and participant behavior</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Practiced discipline through written trading rules</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Market Psychology Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Emotional Trading Kills Accounts
              </h3>
              <p className="text-gray-300 text-sm">
                Fear and greed override logic. Successful traders follow systems, not emotions.
                Smart money tracking provides objective data to counteract emotional decisions.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                Information Asymmetry Is Real
              </h3>
              <p className="text-gray-300 text-sm">
                Institutions have advantages you can't match. But you can track their moves
                through public filings and flow data. Level the playing field with education.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-pink-400" />
                Patience Separates Winners
              </h3>
              <p className="text-gray-300 text-sm">
                The best trades require waiting. Smart money accumulates positions slowly.
                Learning to identify accumulation patterns helps you enter at better prices.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 backdrop-blur-sm p-12 rounded-3xl border border-purple-500/30">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Want to join these insights into your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                trading toolkit?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get educational content delivered daily. Learn to read market flows like the pros.
            </p>
            <button
              onClick={() => handleConversionClick('final-cta')}
              className="group gradient-cta px-4 py-4 rounded-xl font-bold text-base shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-4"
            >
              <MessageCircle className="w-8 h-8" />
              Get WhatsApp → Get the pick
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-sm text-gray-400 mt-6">
              No spam • Cancel anytime • 100% educational content
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-black border-t border-purple-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Purpose of This Service
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                This platform is designed for <strong>educational purposes only</strong>. We provide information
                and analysis to help you understand market dynamics, institutional trading patterns, and
                investment principles. This is not a trading signal service or investment advisory platform.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Nature of Information
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                All content, analysis, and information provided are for <strong>informational and educational
                purposes only</strong>. Nothing on this platform constitutes financial advice, investment
                recommendations, or trading signals. All data is historical and for learning purposes.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                About Content Reliability
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                While we strive to provide accurate information sourced from public filings and market data,
                we make <strong>no guarantees</strong> about accuracy, completeness, or timeliness. Data may
                contain errors or delays. Always verify information independently before making decisions.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Disclosure
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong>Trading and investing involves substantial risk of loss.</strong> Past performance
                does not guarantee future results. You may lose some or all of your invested capital.
                Only risk capital you can afford to lose. Market conditions change constantly.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Legal Position
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We are <strong>not</strong> registered investment advisors, broker-dealers, or financial
                planners. We do not provide personalized investment advice or recommendations. Consult
                with qualified financial professionals before making investment decisions.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Your Responsibility
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong>You are solely responsible</strong> for your investment and trading decisions.
                Conduct your own due diligence, research, and risk assessment. Seek professional advice
                appropriate to your situation before taking action based on educational content.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
