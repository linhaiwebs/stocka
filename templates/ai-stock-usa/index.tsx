import { useState, useEffect } from 'react';
import {
  Brain,
  FileText,
  Zap,
  Target,
  CheckCircle,
  X,
  TrendingUp,
  AlertTriangle,
  Shield,
  Users
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const TICKER_ITEMS = [
  { ticker: 'AAPL', price: '$310.28', change: '+1.2%', isUp: true },
  { ticker: 'MSFT', price: '$3,601.79', change: '+0.75%', isUp: true },
  { ticker: 'TSLA', price: '$172.63', change: '-1.45%', isUp: false },
  { ticker: 'AMZN', price: '$175.89', change: '+2.15%', isUp: true },
  { ticker: 'GOOGL', price: '$151.45', change: '-0.32%', isUp: false },
];

const SCAN_STEPS = [
  'Gathering historical price and volume data',
  'Reviewing recent trend and momentum signals',
  'Checking basic volatility and drawdown patterns',
  'Scanning simple technical indicators',
  'Analyzing emotional triggers and patterns',
  'Preparing educational report summary',
];

const PAIN_POINTS = [
  'Making emotional trades based on fear or excitement',
  'Chasing hot tips without understanding fundamentals',
  'Not recognizing clear risk patterns before entering',
  'Holding losing positions too long hoping for recovery',
  'Missing key market trends and momentum shifts'
];

const SOLUTIONS = [
  {
    title: 'Structured Analysis',
    description: 'Get clear, data-driven insights that help you understand what\'s happening before you trade.'
  },
  {
    title: 'Risk Education',
    description: 'Learn to spot volatility patterns and emotional triggers that lead to bad decisions.'
  },
  {
    title: 'Pattern Recognition',
    description: 'AI helps notice recurring market behaviors and technical setups you might miss.'
  }
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Structured market overview',
    description: 'Clear snapshots of price history, volatility, and key ratios presented in an easy-to-scan format.'
  },
  {
    icon: Zap,
    title: 'Fast educational context',
    description: 'Get high-level insights in minutes to understand recent behavior and market positioning.'
  },
  {
    icon: Target,
    title: 'Simple patterns & risk cues',
    description: 'Algorithmic checks surface trend patterns and risk flags as a second view alongside your research.'
  }
];

const TESTIMONIALS = [
  {
    text: 'I was throwing money away on emotional trades. This AI scanner helps me stay grounded and see patterns I missed before.',
    author: 'Michael T.',
    role: 'active trader'
  },
  {
    text: 'Finally, a tool that educates instead of just giving signals. The structured approach changed how I analyze stocks.',
    author: 'Sarah K.',
    role: 'long-term investor'
  },
  {
    text: 'The risk cues and pattern recognition saved me from several bad trades. It\'s like having a second pair of eyes.',
    author: 'David R.',
    role: 'swing trader'
  }
];

export default function AIStockUSA({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [tickerInput, setTickerInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scannedSymbol, setScannedSymbol] = useState('');
  const [showImpressum, setShowImpressum] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    console.log('[AI Stock USA] Traffic link data:', trafficLink);
  }, [trafficLink]);

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


  const handleScanClick = () => {
    const symbol = tickerInput.trim().toUpperCase() || 'AAPL';
    setScannedSymbol(symbol);

    console.log('[AI Stock USA] Scan started for:', symbol);
    console.log('[AI Stock USA] Current traffic link:', trafficLink);

    sendGA4Event('Bdd');
    trackClick('scan-button', 'button');

    setIsLoading(true);
    setShowModal(true);
    setScanProgress(0);
    setCurrentStep(0);
    setCompletedSteps([]);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 1;

        const stepIndex = Math.floor((newProgress / 100) * SCAN_STEPS.length);
        if (stepIndex !== currentStep && stepIndex < SCAN_STEPS.length) {
          if (currentStep > 0) {
            setCompletedSteps(prev => [...prev, currentStep - 1]);
          }
          setCurrentStep(stepIndex + 1);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCompletedSteps(prev => [...prev, SCAN_STEPS.length - 1]);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }, 500);
        }

        return Math.min(newProgress, 100);
      });
    }, 30);
  };

  const handleConversionClick = () => {
    console.log('[AI Stock USA] Conversion button clicked');
    console.log('[AI Stock USA] TrafficLink data:', trafficLink);

    sendGA4Event('Add');
    trackClick('whatsapp-cta', 'button');
    trackConversion('whatsapp');

    if (trafficLink?.url) {
      console.log('[AI Stock USA] Opening traffic link URL:', trafficLink.url);

      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
    } else {
      console.warn('[AI Stock USA] No traffic link URL available. No action taken.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsLoading(false);
    setScanProgress(0);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      <header className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-cyan-500/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                AI STOCK INSIGHTS
              </h1>
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded border border-cyan-500/30">
                New 6 weeks
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 py-2 overflow-hidden relative border-t border-cyan-500/10">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
              <div key={index} className="inline-flex items-center mx-6 text-sm">
                <span className="font-bold text-white mr-2">{item.ticker}</span>
                <span className="text-slate-300 mr-2">{item.price}</span>
                <span className={`font-medium ${item.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-2 text-center">
          <p className="text-sm sm:text-base font-semibold text-white tracking-wide">
            AI ANALYSIS IN STOCK SWAP AN AI STOCKS
          </p>
        </div>
      </header>

      <section className="py-12 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Stop Throwing Money Away.
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-4">
              You're not a bad investor. You're just using the wrong tools. Our AI-based structure
              helps you notice patterns and emotional triggers before they cost you.
            </p>
            <p className="text-sm text-slate-400 mb-8">
              Popular tickers: AAPL · MSFT · TSLA · AMZN · GOOGL
              <br />
              <span className="text-xs">Informational and educational purposes only. Not financial advice.</span>
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 sm:p-8">
            <div className="mb-6">
              <label htmlFor="hero-ticker-input" className="block text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wide">
                Stock Scan Input
              </label>
              <input
                type="text"
                id="hero-ticker-input"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white text-base transition-all placeholder-slate-500"
                placeholder="Enter ticker (e.g., AAPL)"
              />
            </div>
            <button
              onClick={handleScanClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-cyan-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-cyan-500 active:transform active:scale-[0.98] transition-all shadow-lg shadow-cyan-600/30"
            >
              <Target className="w-5 h-5" />
              Run AI Scan
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gradient-to-br from-purple-900/40 via-slate-950 to-blue-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl sm:text-5xl font-bold mb-8">
                Stop Throwing Money{' '}
                <span className="text-cyan-400">Away.</span>
              </h3>
              <ul className="space-y-4 text-lg text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">●</span>
                  <span>Notice emotional triggers before they hurt your portfolio</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">●</span>
                  <span>Understand patterns that separate winners from losers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">●</span>
                  <span>Get AI-assisted structure instead of guessing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">●</span>
                  <span>Make decisions based on data, not hope</span>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-cyan-500/30 p-8 shadow-2xl">
                  <Brain className="w-48 h-48 text-cyan-400 mx-auto mb-4" strokeWidth={1.5} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-purple-500/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  <TrendingUp className="absolute top-8 right-8 w-12 h-12 text-emerald-400" />
                  <AlertTriangle className="absolute bottom-8 left-8 w-10 h-10 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              From emotional trades to structured, AI-assisted decisions
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              For serious investors who are tired of hot tips and want to understand what's really happening in the market.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md">
                AI Stocks
              </button>
              <button className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-all">
                Public data. No insider info
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20 p-8">
              <h4 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                Common pain points of stock investors
              </h4>
              <ul className="space-y-4">
                {PAIN_POINTS.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8">
              <h4 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6" />
                How AI-assisted education helps you
              </h4>
              <div className="space-y-6">
                {SOLUTIONS.map((solution, index) => (
                  <div key={index}>
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      {solution.title}
                    </h5>
                    <p className="text-slate-300 pl-7">{solution.description}</p>
                  </div>
                ))}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    Get educational reports delivered via WhatsApp with clear analysis and risk markers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              What the AI stock scanner shows <span className="text-cyan-400">(ai stocks)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-8 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/30">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              How investors use these summaries <span className="text-cyan-400">(Ai Stocks)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 relative"
              >
                <div className="text-6xl text-cyan-400/20 font-serif absolute top-4 left-4">"</div>
                <p className="text-slate-300 italic mb-6 leading-relaxed relative z-10 pt-8">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm mb-4">
              © 2025 AI Stock Insights. All rights reserved.
            </p>
            <div className="max-w-4xl mx-auto">
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                <strong className="text-slate-400">Educational Purposes Only:</strong> This tool provides general information and educational content about stock market analysis.
                It is NOT financial advice, investment recommendations, or a suggestion to buy or sell any security.
                All analysis is based on publicly available data and algorithmic patterns.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                <strong className="text-slate-400">Risk Warning:</strong> Investing in financial markets involves substantial risk, including possible loss of principal.
                Past performance does not guarantee future results. You should conduct your own research and consult with qualified financial advisors before making any investment decisions.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">
                <strong className="text-slate-400">No Insider Information:</strong> All data used is publicly available.
                We do not provide or claim to provide insider information, proprietary trading signals, or guaranteed returns.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <button
              onClick={() => setShowImpressum(true)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
            >
              Impressum
            </button>
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
            >
              Datenschutzerklärung
            </button>
          </div>
        </div>
      </footer>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative animate-fadeIn shadow-2xl border border-cyan-500/20">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              Scanning: <span className="text-cyan-400">{scannedSymbol}</span>
            </h3>

            {isLoading ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-300">
                    Processing market data for <span className="font-semibold text-cyan-400">{scannedSymbol}</span>
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-300 ease-linear"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {SCAN_STEPS.map((step, index) => {
                    const isActive = currentStep === index + 1;
                    const isCompleted = completedSteps.includes(index);
                    return (
                      <div
                        key={index}
                        className={`text-sm transition-all duration-300 flex items-start gap-2 ${
                          isCompleted
                            ? 'text-slate-400'
                            : isActive
                            ? 'text-cyan-400 font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />}
                        {!isCompleted && <span className="w-4 flex-shrink-0"></span>}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4 border border-emerald-500/30">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Scan Complete!</h4>
                  <p className="text-slate-300">
                    Your AI analysis for <span className="font-semibold text-cyan-400">{scannedSymbol}</span> is ready
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-cyan-500/20">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Click below to receive your educational analysis summary via WhatsApp.
                    The report includes key metrics, trend snapshots, risk markers, and pattern observations.
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    This is educational content only, not investment advice.
                  </p>
                </div>

                <button
                  onClick={handleConversionClick}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-cyan-600/30 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Get Analysis via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showImpressum && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setShowImpressum(false)}
        >
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full p-8 relative my-8 border border-cyan-500/20">
            <button
              onClick={() => setShowImpressum(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-white mb-6">Impressum</h2>

            <div className="space-y-6 text-slate-300 text-sm">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Anbieter / Provider</h3>
                <p>AI Stock Insights</p>
                <p>Educational Analytics Platform</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Kontakt / Contact</h3>
                <p>E-Mail: info@aistockinsights.com</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Zweck der Plattform / Purpose</h3>
                <p>
                  Diese Plattform dient ausschließlich zu Bildungs- und Informationszwecken.
                  Alle bereitgestellten Analysen, Daten und Berichte sind allgemeiner Natur und
                  stellen keine Anlageberatung, Finanzberatung oder Empfehlung zum Kauf oder
                  Verkauf von Wertpapieren dar.
                </p>
                <p className="mt-2">
                  This platform serves exclusively educational and informational purposes.
                  All provided analyses, data and reports are of general nature and do not
                  constitute investment advice, financial consulting or recommendations to
                  buy or sell securities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Haftungsausschluss / Disclaimer</h3>
                <p>
                  Keine Anlageberatung: Die Inhalte dieser Website stellen keine persönliche
                  Anlageberatung dar. Jeder Nutzer muss eigene Recherchen durchführen und sollte
                  vor Investitionsentscheidungen qualifizierte Finanzberater konsultieren.
                </p>
                <p className="mt-2">
                  Risiko: Investitionen in Finanzmärkte sind mit erheblichen Risiken verbunden,
                  einschließlich des möglichen Verlusts des eingesetzten Kapitals. Vergangene
                  Performance ist kein Indikator für zukünftige Ergebnisse.
                </p>
                <p className="mt-2">
                  Öffentliche Daten: Alle verwendeten Daten sind öffentlich verfügbar. Wir bieten
                  keine Insider-Informationen oder garantierten Renditen.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Externe Links</h3>
                <p>
                  Diese Website kann Links zu externen Websites enthalten. Wir haben keinen
                  Einfluss auf deren Inhalte und übernehmen keine Haftung für externe Inhalte.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Urheberrecht / Copyright</h3>
                <p>
                  © 2025 AI Stock Insights. Alle Rechte vorbehalten. Die Inhalte dieser Website
                  sind urheberrechtlich geschützt.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setShowPrivacy(false)}
        >
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full p-8 relative my-8 border border-cyan-500/20">
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-white mb-6">Datenschutzerklärung</h2>

            <div className="space-y-6 text-slate-300 text-sm">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. Verantwortlicher / Controller</h3>
                <p>AI Stock Insights</p>
                <p>E-Mail: privacy@aistockinsights.com</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. Erhebung und Verarbeitung von Daten</h3>
                <p>
                  Wir erheben und verarbeiten personenbezogene Daten nur im Rahmen der gesetzlichen
                  Bestimmungen. Folgende Daten werden verarbeitet:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Technische Daten (IP-Adresse, Browser-Typ, Zugriffszeiten)</li>
                  <li>Nutzungsdaten (besuchte Seiten, geklickte Links)</li>
                  <li>Eingabedaten (eingegebene Börsensymbole)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">3. Zweck der Datenverarbeitung</h3>
                <p>Die Datenverarbeitung erfolgt zu folgenden Zwecken:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Bereitstellung und Verbesserung unserer Dienstleistungen</li>
                  <li>Technische Verwaltung der Website</li>
                  <li>Analyse der Nutzung für statistische Zwecke</li>
                  <li>Bereitstellung von Bildungsinhalten</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">4. WhatsApp-Integration</h3>
                <p>
                  Diese Website bietet die Möglichkeit, Analyseergebnisse über WhatsApp zu erhalten.
                  Wenn Sie diese Funktion nutzen, werden Sie zu WhatsApp weitergeleitet. Die
                  Datenverarbeitung durch WhatsApp unterliegt den Datenschutzbestimmungen von
                  Meta Platforms, Inc.
                </p>
                <p className="mt-2">
                  Wir speichern keine WhatsApp-Nachrichten oder Telefonnummern auf unseren Servern.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">5. Cookies und Tracking</h3>
                <p>
                  Diese Website verwendet Cookies und ähnliche Technologien, um die Funktionalität
                  zu gewährleisten und die Nutzung zu analysieren. Sie können Cookies in Ihren
                  Browser-Einstellungen verwalten.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">6. Speicherdauer</h3>
                <p>
                  Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten
                  Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">7. Ihre Rechte</h3>
                <p>Sie haben folgende Rechte:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Auskunft über Ihre gespeicherten Daten</li>
                  <li>Berichtigung unrichtiger Daten</li>
                  <li>Löschung Ihrer Daten</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Datenübertragbarkeit</li>
                  <li>Widerspruch gegen die Verarbeitung</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">8. Datensicherheit</h3>
                <p>
                  Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre
                  Daten gegen unbeabsichtigte oder unrechtmäßige Löschung, Veränderung oder
                  Offenlegung zu schützen.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">9. Änderungen</h3>
                <p>
                  Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an
                  geänderte Rechtslagen oder Änderungen unserer Dienstleistungen anzupassen.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">10. Kontakt</h3>
                <p>
                  Bei Fragen zum Datenschutz kontaktieren Sie uns bitte unter:
                  privacy@aistockinsights.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
