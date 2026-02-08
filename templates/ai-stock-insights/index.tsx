import { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Target,
  CheckCircle,
  X
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const TICKER_ITEMS = [
  { ticker: 'AAPL', price: '$185.64', change: '+1.23%', isUp: true },
  { ticker: 'MSFT', price: '$403.78', change: '+0.87%', isUp: true },
  { ticker: 'GOOGL', price: '$151.45', change: '-0.32%', isUp: false },
  { ticker: 'AMZN', price: '$175.89', change: '+2.15%', isUp: true },
  { ticker: 'TSLA', price: '$172.63', change: '-1.45%', isUp: false },
  { ticker: 'META', price: '$473.32', change: '+3.21%', isUp: true },
  { ticker: 'NVDA', price: '$878.37', change: '+5.67%', isUp: true },
];

const SCAN_STEPS = [
  'Gathering historical price and volume data',
  'Reviewing recent trend and momentum signals',
  'Checking basic volatility and drawdown patterns',
  'Scanning simple technical indicators',
  'Summarizing key observations',
  'Preparing an educational report snapshot',
];

const BENEFITS = [
  {
    icon: BarChart3,
    title: 'Structured market overview',
    description: 'The system reviews historical prices, volatility and basic ratios to give you a clear, easy-to-scan snapshot before you dive deeper into your own analysis.',
  },
  {
    icon: TrendingUp,
    title: 'Fresh context in minutes',
    description: 'High-level insights are generated quickly so you can understand how a ticker has been behaving recently relative to its own history and broad market trends.',
  },
  {
    icon: Target,
    title: 'Patterns & risk markers',
    description: 'Algorithmic checks surface simple trend patterns and risk flags that may be useful as a second view alongside your research, screeners or broker tools.',
  },
];

const TESTIMONIALS = [
  {
    text: 'I open the AI summary before reviewing a new idea — it quickly reminds me of recent price moves and volatility so I can stay grounded.',
    author: 'Michael T., active trader',
  },
  {
    text: 'As a long-term investor, I treat the output as a checklist: long-term trend, drawdowns and basic risk markers in one place, then I continue my own research.',
    author: 'Sarah K., long-term investor',
  },
  {
    text: 'The pattern and risk hints help me decide which tickers deserve a deeper look — it\'s a useful second opinion next to my usual tools.',
    author: 'David R., swing trader',
  },
];

export default function AIStockInsights({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [tickerInput, setTickerInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scannedSymbol, setScannedSymbol] = useState('');

  // Debug logging for traffic link
  useEffect(() => {
    console.log('[AI Stock Insights] Traffic link data:', trafficLink);
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

    console.log('[AI Stock Insights] Scan started for:', symbol);
    console.log('[AI Stock Insights] Current traffic link:', trafficLink);

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
    console.log('[AI Stock Insights] Button clicked');
    console.log('[AI Stock Insights] TrafficLink data:', trafficLink);

    sendGA4Event('Add');
    trackClick('whatsapp-cta', 'button');
    trackConversion('whatsapp');

    if (trafficLink?.url) {
      console.log('[AI Stock Insights] Opening traffic link URL:', trafficLink.url);

      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
    } else {
      console.warn('[AI Stock Insights] No traffic link URL available. No action taken.');
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
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-cover"></div>

      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="#" className="text-2xl font-bold">
              <span className="text-blue-600">AI</span>
              <span className="text-emerald-600">Stock</span>
              <span className="text-slate-900">Insights</span>
            </a>
            <nav>
              <a
                href="#insights-anchor"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                How it works
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="bg-slate-900 text-white py-3 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <div key={index} className="inline-flex items-center mx-8 text-sm">
              <span className="font-bold mr-2">{item.ticker}</span>
              <span className="mr-2">{item.price}</span>
              <span className={`font-medium ${item.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="py-12 sm:py-16 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              AI-Driven Snapshot for US Stocks
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-4">
              Enter a US ticker to generate an AI-powered educational overview of price history,
              momentum and basic risk markers — designed to support your own research, not to
              replace it.
            </p>
            <p className="text-sm text-slate-500">
              For informational and learning purposes only. No personalized investment advice.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
            <div className="mb-6">
              <label htmlFor="ticker-input" className="block text-sm font-semibold text-slate-700 mb-2">
                Type a US stock ticker symbol:
              </label>
              <input
                type="text"
                id="ticker-input"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-base transition-colors"
                placeholder="Example: AAPL, MSFT, TSLA"
              />
            </div>
            <button
              onClick={handleScanClick}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 active:transform active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
            >
              Run AI Scan
            </button>
            <p className="text-center text-sm text-slate-500 mt-4">
              Popular symbols: AAPL · MSFT · TSLA · AMZN · GOOGL
            </p>
          </div>
        </div>
      </section>

      <section id="insights-anchor" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What the AI Stock Scanner Highlights
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive analysis in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How investors use these summaries
            </h2>
            <p className="text-lg text-slate-600">
              Real feedback from active traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-slate-200"
              >
                <p className="text-slate-700 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <p className="text-sm font-semibold text-slate-900">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300 text-sm mb-3">
            © 2025 AIStockInsights. All rights reserved. This tool is for general information and
            education only and should not be considered investment advice or a recommendation.
          </p>
          <p className="text-slate-400 text-xs">
            Investing in financial markets involves risk, including possible loss of principal. Past
            market behaviour and back-tested data do not guarantee future results.
          </p>
        </div>
      </footer>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative animate-fadeIn shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Scanning: <span className="text-blue-600">{scannedSymbol}</span>
            </h3>

            {isLoading ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600">
                    Processing market data for <span className="font-semibold">{scannedSymbol}</span>…
                  </p>
                </div>

                <div className="mb-8">
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 ease-linear"
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
                            ? 'text-slate-600'
                            : isActive
                            ? 'text-slate-900 font-semibold'
                            : 'text-slate-400'
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Analysis Complete!</h4>
                  <p className="text-slate-600">
                    Your AI-generated summary for <span className="font-semibold text-blue-600">{scannedSymbol}</span> is ready
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {trafficLink?.url
                      ? 'Click below to access your complete analysis report with detailed insights, metrics, and recommendations.'
                      : 'Click below to receive your analysis summary via WhatsApp with key metrics, trend snapshot and risk notes.'
                    }
                  </p>
                </div>

                <button
                  onClick={handleConversionClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {trafficLink?.url ? (
                    <>
                      <Target className="w-6 h-6" />
                      Get Full Analysis Report
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Get Summary via WhatsApp
                    </>
                  )}
                </button>
              </div>
            )}
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
