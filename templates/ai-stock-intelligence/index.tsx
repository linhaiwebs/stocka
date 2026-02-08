import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Zap,
  BarChart3,
  CheckCircle,
  Lock,
  RefreshCw,
  ShieldCheck,
  Heart,
  AlertTriangle,
  Play,
  LineChart,
  X
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-time Analysis'
  },
  {
    icon: CheckCircle,
    title: 'Advanced Analytics'
  },
  {
    icon: TrendingUp,
    title: 'Market Sentiment'
  },
  {
    icon: BarChart3,
    title: 'Risk Assessment'
  }
];

const TRUST_FEATURES = [
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Bank-level encryption'
  },
  {
    icon: RefreshCw,
    title: 'Instant Results',
    description: 'Real-time processing'
  },
  {
    icon: ShieldCheck,
    title: 'Verified AI',
    description: 'Tested accuracy'
  },
  {
    icon: Heart,
    title: 'Premium Quality',
    description: 'Professional grade'
  }
];

const ANALYSIS_STEPS = [
  'Collecting real-time market data',
  'Analyzing technical indicators',
  'Processing sentiment analysis',
  'Evaluating risk metrics',
  'Generating AI predictions',
  'Compiling comprehensive report'
];

export default function AIStockIntelligence({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [stockSymbol, setStockSymbol] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analyzedSymbol, setAnalyzedSymbol] = useState('');

  useEffect(() => {
    console.log('[AI Stock Intelligence] Traffic link data:', trafficLink);
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

    console.log('[AI Stock Intelligence] Analysis started for:', symbol);
    console.log('[AI Stock Intelligence] Current traffic link:', trafficLink);

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
    console.log('[AI Stock Intelligence] Conversion button clicked');
    console.log('[AI Stock Intelligence] TrafficLink data:', trafficLink);

    sendGA4Event('Add');
    trackClick('conversion-cta', 'button');
    trackConversion('access-report');

    if (trafficLink?.url) {
      console.log('[AI Stock Intelligence] Opening traffic link URL:', trafficLink.url);

      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
    } else {
      console.warn('[AI Stock Intelligence] No traffic link URL available. No action taken.');
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a4d5c] to-[#083344] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center">
              <LineChart className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-sm text-slate-400">Advanced AI Market Platform</span>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-100 mb-3">
              AI Stock Intelligence
            </h1>
            <p className="text-lg sm:text-xl text-slate-400">
              Advanced Market Intelligence & Predictive Analysis
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-10">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-900/40 border border-cyan-500/30 rounded-xl p-4 sm:p-6 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-cyan-100">{feature.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">$2.4B+</div>
              <div className="text-xs sm:text-sm text-slate-400">Assets Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">150.0K+</div>
              <div className="text-xs sm:text-sm text-slate-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-slate-400">Market Coverage</div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto mb-10">
          <div className="bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 mb-8">
            <label className="block text-sm font-semibold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Stock Symbol
            </label>
            <input
              type="text"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              placeholder="Enter symbol (e.g., AAPL)"
              className="w-full px-4 py-3 mb-4 bg-slate-800/50 border-2 border-cyan-500/30 focus:border-cyan-500 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleAnalyzeClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-purple-500/50 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5" />
              Analyze Now
            </button>
          </div>

          <div className="bg-slate-900/40 border-2 border-cyan-500/30 rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-semibold text-cyan-400 mb-2">Risk Warning:</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Trading and investing in financial markets involves substantial risk of loss and is not suitable for every investor.
                  The valuation of stocks and other securities may fluctuate, and investors may lose all or more than their original investment.
                  Past performance is not indicative of future results. This information is provided for educational purposes only and does not constitute
                  financial advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/40 border border-cyan-500/20 rounded-xl p-4 text-center hover:border-cyan-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">{feature.title}</h4>
                <p className="text-xs text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </footer>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-slate-800 border-2 border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl shadow-cyan-500/20">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              Analyzing: <span className="text-cyan-400">{analyzedSymbol}</span>
            </h3>

            {isAnalyzing ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-300">
                    Processing advanced intelligence for <span className="font-semibold text-cyan-400">{analyzedSymbol}</span>
                  </p>
                </div>

                <div className="mb-8">
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 ease-linear"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {ANALYSIS_STEPS.map((step, index) => {
                    const isActive = currentStep === index + 1;
                    const isCompleted = completedSteps.includes(index);
                    return (
                      <div
                        key={index}
                        className={`text-sm transition-all duration-300 flex items-start gap-2 ${
                          isCompleted
                            ? 'text-slate-400'
                            : isActive
                            ? 'text-white font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />}
                        {!isCompleted && <span className="w-4 flex-shrink-0"></span>}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-cyan-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Analysis Complete!</h4>
                  <p className="text-slate-300">
                    Your AI intelligence report for <span className="font-semibold text-cyan-400">{analyzedSymbol}</span> is ready
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-5 mb-6 border border-cyan-500/20">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Access your comprehensive market intelligence report featuring advanced predictive analytics,
                    sentiment analysis, technical indicators, risk assessments, and AI-powered recommendations
                    tailored specifically for {analyzedSymbol}.
                  </p>
                </div>

                <button
                  onClick={handleConversionClick}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-purple-500/50 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <TrendingUp className="w-6 h-6" />
                  Access Full Intelligence Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
