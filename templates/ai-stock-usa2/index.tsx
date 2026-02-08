import { useState, useEffect } from 'react';
import {
  Bot,
  Zap,
  TrendingUp,
  MessageCircle,
  CheckCircle,
  Shield,
  Gift,
  X
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Analysis',
  },
  {
    icon: TrendingUp,
    title: 'Market Insights',
  },
  {
    icon: MessageCircle,
    title: 'Expert Advice',
  },
];

const TRUST_BADGES = [
  {
    icon: Shield,
    label: 'Secure',
  },
  {
    icon: Zap,
    label: 'Instant',
  },
  {
    icon: Gift,
    label: 'Free',
  },
];

const SCAN_STEPS = [
  'Analyzing historical price data',
  'Evaluating market trends and patterns',
  'Calculating technical indicators',
  'Assessing risk factors',
  'Generating AI predictions',
  'Preparing your personalized report',
];

export default function AIStockUSA2({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [stockSymbol, setStockSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scannedSymbol, setScannedSymbol] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

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
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyzeClick = () => {
    const symbol = stockSymbol.trim().toUpperCase() || 'AAPL';
    setScannedSymbol(symbol);

    sendGA4Event('Bdd');
    trackClick('analyze-button', 'button');

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

  const handleGetReportClick = () => {
    sendGA4Event('Add');
    trackClick('get-report', 'button');
    trackConversion('stock-analysis');

    if (trafficLink?.url) {
      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
    } else {
      console.warn('[AI Stock USA2] No traffic link URL available. No action taken.');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-600">StockAI</h1>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4">
          AI Stock Prediction
        </h2>

        <p className="text-slate-500 text-center mb-8 text-lg">
          Enter any stock symbol for instant AI-powered insights
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;
            return (
              <div
                key={index}
                className={`bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive ? 'ring-2 ring-indigo-600 bg-indigo-50' : ''
                }`}
              >
                <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`text-sm font-medium text-center ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
                  {feature.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {FEATURES.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeFeature ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'
              }`}
            ></div>
          ))}
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeClick()}
            className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-slate-50 placeholder-slate-400 transition-all"
            placeholder="Enter stock symbol (e.g. AAPL, TSLA)"
          />
          <p className="text-center text-sm text-slate-400 mt-3">
            Enter any stock symbol to analyze
          </p>
        </div>

        <button
          onClick={handleAnalyzeClick}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 mb-6"
        >
          <TrendingUp className="w-6 h-6" />
          Analyze with AI
        </button>

        <div className="flex items-center justify-center gap-4 mb-8">
          {TRUST_BADGES.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
                <Icon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-600">{badge.label}</span>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 leading-relaxed">
          This tool is for educational purposes only. Past performance is not indicative of future results.
        </p>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative animate-fadeIn shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Analyzing: <span className="text-indigo-600">{scannedSymbol}</span>
            </h3>

            {isLoading ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600">
                    Processing AI analysis for <span className="font-semibold">{scannedSymbol}</span>...
                  </p>
                </div>

                <div className="mb-8">
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-linear"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-slate-500 mt-2">{scanProgress}% Complete</p>
                </div>

                <div className="space-y-3">
                  {SCAN_STEPS.map((step, index) => {
                    const isActive = currentStep === index + 1;
                    const isCompleted = completedSteps.includes(index);
                    return (
                      <div
                        key={index}
                        className={`text-sm transition-all duration-300 flex items-start gap-3 ${
                          isCompleted
                            ? 'text-slate-600'
                            : isActive
                            ? 'text-slate-900 font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />}
                        {isActive && <div className="w-5 h-5 border-2 border-indigo-600 rounded-full animate-pulse mt-0.5 flex-shrink-0"></div>}
                        {!isCompleted && !isActive && <div className="w-5 h-5 border-2 border-slate-300 rounded-full mt-0.5 flex-shrink-0"></div>}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h4 className="text-3xl font-bold text-slate-900 mb-2">Analysis Complete!</h4>
                  <p className="text-slate-600 text-lg">
                    Your AI prediction for <span className="font-semibold text-indigo-600">{scannedSymbol}</span> is ready
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-xl p-6 mb-6 border-2 border-indigo-100">
                  <p className="text-slate-700 leading-relaxed">
                    Your comprehensive stock analysis report is ready! Click below to access detailed predictions, market insights, and AI-powered recommendations.
                  </p>
                </div>

                {trafficLink?.url && (
                  <button
                    onClick={handleGetReportClick}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <TrendingUp className="w-6 h-6" />
                    Get Your Analysis Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
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
