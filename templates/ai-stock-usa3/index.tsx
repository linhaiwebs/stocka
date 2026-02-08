import { useState, useEffect } from 'react';
import {
  Search,
  Lock,
  Timer,
  CheckCircle,
  BarChart3,
  X,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const FLOATING_TICKERS = [
  { symbol: 'AAPL', price: '$310.28', change: '+1.2%', left: '10%', top: '15%', delay: '0s' },
  { symbol: 'TSLA', price: '$172.63', change: '-1.45%', left: '85%', top: '25%', delay: '1s' },
  { symbol: 'NVDA', price: '$875.44', change: '+2.8%', left: '15%', top: '70%', delay: '2s' },
  { symbol: 'MSFT', price: '$420.15', change: '+0.9%', left: '80%', top: '65%', delay: '1.5s' },
];

const ANALYSIS_STEPS = [
  'Collecting real-time market data',
  'Analyzing technical indicators',
  'Processing sentiment analysis',
  'Evaluating risk metrics',
  'Generating predictions',
  'Compiling comprehensive report'
];

const FEATURES = [
  {
    icon: Lock,
    title: 'SECURE & PRIVATE',
    gradient: 'from-purple-500 to-purple-700',
    delay: '0s'
  },
  {
    icon: Timer,
    title: 'INSTANT RESULTS',
    gradient: 'from-pink-500 to-rose-600',
    delay: '0.1s'
  },
  {
    icon: CheckCircle,
    title: 'VERIFIED',
    gradient: 'from-amber-500 to-orange-600',
    delay: '0.2s'
  },
  {
    icon: BarChart3,
    title: 'REAL-TIME DATA',
    gradient: 'from-blue-500 to-cyan-600',
    delay: '0.3s'
  }
];

export default function AIStockUSA3({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [stockSymbol, setStockSymbol] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analyzedSymbol, setAnalyzedSymbol] = useState('');

  useEffect(() => {
    console.log('[AI Stock USA3] Traffic link data:', trafficLink);
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

  const handleAnalyzeClick = () => {
    const symbol = stockSymbol.trim().toUpperCase() || 'AAPL';
    setAnalyzedSymbol(symbol);

    console.log('[AI Stock USA3] Analysis started for:', symbol);
    console.log('[AI Stock USA3] Current traffic link:', trafficLink);

    sendGA4Event('Bdd');
    trackClick('analyze-button', 'button');

    setIsAnalyzing(true);
    setShowModal(true);
    setAnalysisProgress(0);
    setCurrentStep(0);
    setCompletedSteps([]);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + 1;

        const stepIndex = Math.floor((newProgress / 100) * ANALYSIS_STEPS.length);
        if (stepIndex !== currentStep && stepIndex < ANALYSIS_STEPS.length) {
          if (currentStep > 0) {
            setCompletedSteps(prev => [...prev, currentStep - 1]);
          }
          setCurrentStep(stepIndex + 1);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCompletedSteps(prev => [...prev, ANALYSIS_STEPS.length - 1]);
            setTimeout(() => {
              setIsAnalyzing(false);
            }, 500);
          }, 500);
        }

        return Math.min(newProgress, 100);
      });
    }, 30);
  };

  const handleConversionClick = () => {
    console.log('[AI Stock USA3] Conversion button clicked');
    console.log('[AI Stock USA3] TrafficLink data:', trafficLink);

    sendGA4Event('Add');
    trackClick('conversion-cta', 'button');
    trackConversion('access-report');

    if (trafficLink?.url) {
      console.log('[AI Stock USA3] Opening traffic link URL:', trafficLink.url);

      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
    } else {
      console.warn('[AI Stock USA3] No traffic link URL available. No action taken.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          ></div>
        ))}
      </div>

      {FLOATING_TICKERS.map((ticker, index) => (
        <div
          key={index}
          className="fixed bg-slate-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2 text-xs font-mono pointer-events-none animate-floatTicker"
          style={{
            left: ticker.left,
            top: ticker.top,
            animationDelay: ticker.delay
          }}
        >
          <span className="text-cyan-400 font-bold">{ticker.symbol}</span>
          <span className="text-slate-300 mx-2">{ticker.price}</span>
          <span className={ticker.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>
            {ticker.change}
          </span>
        </div>
      ))}

      <div className="relative z-10">
        <section className="py-20 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Advanced Market Intelligence
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Unlock powerful insights with cutting-edge algorithms and real-time market analysis for smarter trading decisions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">$2.4B+</div>
                <div className="text-xs sm:text-sm text-slate-400">Assets Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">150.0K+</div>
                <div className="text-xs sm:text-sm text-slate-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-slate-400">Market Coverage</div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6 sm:p-8">
                <div className="mb-6">
                  <label htmlFor="stock-input" className="block text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wide">
                    Enter Stock Symbol
                  </label>
                  <input
                    type="text"
                    id="stock-input"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                    className="w-full px-6 py-4 bg-slate-800/70 border-2 border-cyan-500/40 rounded-2xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 text-white text-lg transition-all placeholder-slate-500 outline-none"
                    placeholder="e.g., AAPL, TSLA, NVDA"
                  />
                </div>
                <button
                  onClick={handleAnalyzeClick}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-cyan-600/40 hover:shadow-cyan-500/60 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Activity className="w-6 h-6" />
                  Analyze Now
                </button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-4 sm:p-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Advanced Market Platform</h3>
                  <p className="text-sm text-slate-400">Powered by sophisticated algorithms and real-time data processing</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: feature.delay }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h4 className="text-center text-sm font-bold text-white">{feature.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-3">Risk Warning</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    <strong>Educational Purposes Only:</strong> This platform provides general information and educational content about stock market analysis.
                    It is NOT financial advice, investment recommendations, or a suggestion to buy or sell any security.
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    <strong>Investment Risk:</strong> Trading and investing in financial markets involves substantial risk, including possible loss of principal.
                    Past performance does not guarantee future results. You should conduct your own research and consult with qualified financial advisors
                    before making any investment decisions.
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <strong>No Guarantees:</strong> All analyses are based on publicly available data and algorithmic patterns.
                    We do not provide or claim to provide insider information, proprietary trading signals, or guaranteed returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-950/80 border-t border-slate-800/50 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 Advanced Market Intelligence. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              For educational and informational purposes only. Not financial advice.
            </p>
          </div>
        </footer>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/50 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative animate-scaleIn shadow-2xl border border-cyan-500/30">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Analyzing: <span className="text-cyan-400">{analyzedSymbol}</span>
            </h3>

            {isAnalyzing ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-20 h-20 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-300 text-lg">
                    Processing market intelligence for <span className="font-semibold text-cyan-400">{analyzedSymbol}</span>
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Analysis Progress</span>
                    <span className="font-mono">{analysisProgress}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transition-all duration-300 ease-linear relative"
                      style={{ width: `${analysisProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {ANALYSIS_STEPS.map((step, index) => {
                    const isActive = currentStep === index + 1;
                    const isCompleted = completedSteps.includes(index);
                    return (
                      <div
                        key={index}
                        className={`text-sm transition-all duration-300 flex items-start gap-3 p-3 rounded-lg ${
                          isCompleted
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : isActive
                            ? 'text-cyan-400 font-semibold bg-cyan-500/10'
                            : 'text-slate-600'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                        {isActive && <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5 animate-pulse" />}
                        {!isCompleted && !isActive && <div className="w-5 h-5 flex-shrink-0"></div>}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-4 border-4 border-emerald-500/40">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3">Analysis Complete!</h4>
                  <p className="text-slate-300 text-lg">
                    Your comprehensive analysis for <span className="font-semibold text-cyan-400">{analyzedSymbol}</span> is ready
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-5 mb-6 border border-cyan-500/20">
                  <p className="text-slate-300 leading-relaxed mb-2">
                    Get instant access to your detailed market intelligence report with technical indicators,
                    sentiment analysis, risk metrics, and actionable insights.
                  </p>
                  <p className="text-slate-400 text-sm">
                    Educational content only. Not investment advice.
                  </p>
                </div>

                <button
                  onClick={handleConversionClick}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white py-5 px-6 rounded-xl font-bold text-lg transition-all shadow-2xl shadow-cyan-600/40 hover:shadow-cyan-500/60 active:scale-95 flex items-center justify-center gap-3"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Get Your Report Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatTicker {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-floatTicker {
          animation: floatTicker 4s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
