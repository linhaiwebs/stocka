import { useState, useEffect } from 'react';
import {
  Activity,
  BarChart2,
  Layers,
  User,
  X,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const TECHNICAL_INDICATORS = [
  { name: 'RSI', value: '52.3', status: 'Neutral' },
  { name: 'MACD', value: 'Bullish', status: 'Positive' },
  { name: 'Moving Avg', value: '200-day', status: 'Above' },
  { name: 'Bollinger', value: 'Mid-band', status: 'Neutral' },
  { name: 'Volume', value: 'Average', status: 'Normal' },
  { name: 'Momentum', value: 'Moderate', status: 'Stable' },
];

const ANALYSIS_STEPS = [
  'Collecting price and volume data',
  'Calculating technical indicators',
  'Analyzing chart patterns',
  'Evaluating support and resistance',
  'Assessing momentum signals',
  'Generating informational report',
];

const ANALYSIS_FEATURES = [
  {
    icon: Activity,
    title: 'Technical Indicators',
    description: 'Study common indicators and their interpretations',
  },
  {
    icon: BarChart2,
    title: 'Chart Pattern Analysis',
    description: 'Learn about historical pattern formations',
  },
  {
    icon: Layers,
    title: 'Multi-Timeframe View',
    description: 'Explore different analytical timeframes',
  },
];

const USER_FEEDBACK = [
  {
    text: 'Helpful for understanding how technical indicators work and what they might suggest about market conditions.',
    author: 'Robert Kim',
    title: 'Research Analyst',
    location: 'Austin',
  },
  {
    text: 'Good informational tool for studying technical analysis concepts and seeing how different indicators are calculated.',
    author: 'Amanda Foster',
    title: 'Market Observer',
    location: 'Denver',
  },
  {
    text: 'Useful resource for learning about chart patterns and technical analysis methodologies in a practical context.',
    author: 'Chris Martinez',
    title: 'Financial Researcher',
    location: 'Portland',
  },
];

const LEGAL_DISCLAIMERS = [
  {
    title: 'Informational Tool Purpose',
    content: 'This technical analysis tool is provided for informational and educational purposes only. It demonstrates how technical indicators are calculated and displayed but does not provide trading signals or recommendations.',
  },
  {
    title: 'No Trading Recommendations',
    content: 'Technical analysis outputs shown are computational results for informational purposes. They do not constitute buy, sell, or hold recommendations, trading signals, or any form of investment advice.',
  },
  {
    title: 'Historical Data Only',
    content: 'All technical analysis is based on historical data. Past price patterns, indicator readings, and technical formations do not predict or guarantee future price movements or market behavior.',
  },
  {
    title: 'Market Risk Awareness',
    content: 'Technical analysis does not eliminate or reduce market risk. All market activities carry substantial risk of loss. Understanding technical indicators does not ensure profitable outcomes.',
  },
  {
    title: 'Professional Consultation Required',
    content: 'Before making any market decisions, consult with licensed financial professionals and conduct comprehensive independent research appropriate to your circumstances.',
  },
  {
    title: 'No Accuracy Guarantees',
    content: 'Technical indicators and analysis outputs are calculations based on input data. We make no guarantees regarding accuracy, timeliness, or reliability of any technical analysis results.',
  },
  {
    title: 'User Responsibility',
    content: 'Users are solely responsible for their own research and decisions. This tool provides data and calculations but does not direct, recommend, or advise specific actions.',
  },
];

export default function AIStockTechAnalysis({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [tickerInput, setTickerInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analyzedSymbol, setAnalyzedSymbol] = useState('');
  const [activeFeedback, setActiveFeedback] = useState(0);

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
      setActiveFeedback((prev) => (prev + 1) % USER_FEEDBACK.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyzeClick = () => {
    const symbol = tickerInput.trim().toUpperCase() || 'AAPL';
    setAnalyzedSymbol(symbol);

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
    }, 33);
  };

  const handleConversionClick = () => {
    sendGA4Event('Add');
    trackClick('report-cta', 'button');
    trackConversion('access-technical-report');

    if (trafficLink?.url) {
      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      <section className="relative px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Activity className="w-6 h-6 text-purple-400" />
            <span className="text-purple-400 font-semibold text-lg">Technical Analysis Information Platform</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
              Technical Analysis Tools
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-purple-300">
              Informational Market Data Analysis
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Access technical indicator calculations and chart pattern information for research purposes
            </p>

            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-5 py-3">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-slate-300">
                Informational Only • Not Trading Advice • Past Performance Does Not Predict Future Results
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Get Technical Information</h3>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <input
                type="text"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 text-base"
                placeholder="Enter stock symbol (e.g., TSLA, NVDA, AAPL)"
              />
              <button
                onClick={handleAnalyzeClick}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-purple-500/50 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>View Technical Information</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Technical data for informational purposes - Not trading recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-300">
            Information Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ANALYSIS_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
                >
                  <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-300">
            Sample Technical Indicators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TECHNICAL_INDICATORS.map((indicator, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">{indicator.name}</h4>
                <p className="text-sm text-purple-400 mb-1">{indicator.value}</p>
                <p className="text-xs text-slate-400">{indicator.status}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            Sample data for illustration. Technical indicators are computational outputs, not recommendations.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-300">
            User Feedback
          </h2>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeFeedback * 100}%)` }}
              >
                {USER_FEEDBACK.map((feedback, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-6 max-w-2xl mx-auto">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{feedback.author}</p>
                          <p className="text-sm text-purple-400">{feedback.title}</p>
                          <p className="text-xs text-slate-400">{feedback.location}</p>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">"{feedback.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {USER_FEEDBACK.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeedback(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeFeedback ? 'bg-purple-500 w-8' : 'bg-slate-600 w-2'
                  }`}
                  aria-label={`Go to feedback ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/20 border-2 border-red-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Critical Risk Warning</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">
                  <strong>Market Risk:</strong> All market activities involve substantial risk of loss. Technical analysis does not eliminate or reduce these risks.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong>Not Trading Advice:</strong> Technical indicators shown are computational outputs for informational purposes only and do not constitute trading recommendations or advice.
                  Past patterns do not predict future results. Always consult licensed financial professionals.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">
            Important Legal Disclaimers
          </h3>

          <div className="space-y-4">
            {LEGAL_DISCLAIMERS.map((disclaimer, index) => (
              <div key={index} className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-base font-semibold text-purple-400 mb-2">
                  {disclaimer.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {disclaimer.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm mb-2">
              © 2025 Technical Analysis Information Platform. Data Services.
            </p>
            <p className="text-slate-500 text-xs">
              All technical data for informational purposes only. Not trading advice or recommendations.
            </p>
          </div>
        </div>
      </footer>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(30, 27, 75, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-slate-800 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              Technical Data: <span className="text-purple-400">{analyzedSymbol}</span>
            </h3>

            {isAnalyzing ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-300">
                    Calculating technical data for <span className="font-semibold text-purple-400">{analyzedSymbol}</span>
                  </p>
                </div>

                <div className="mb-8">
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
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
                        className={`text-sm flex items-start gap-2 ${
                          isCompleted ? 'text-slate-400' : isActive ? 'text-white font-semibold' : 'text-slate-600'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />}
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-purple-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Technical Information Ready</h4>
                  <p className="text-slate-300">
                    Technical data for <span className="font-semibold text-purple-400">{analyzedSymbol}</span> is available
                  </p>
                </div>

                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-300 text-sm mb-1">
                        <strong>Informational Data Only</strong>
                      </p>
                      <p className="text-slate-400 text-xs">
                        Technical indicators are computational outputs, not trading signals or recommendations.
                        For informational purposes only. Consult licensed professionals before any market decisions.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConversionClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-purple-500/50 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <TrendingUp className="w-6 h-6" />
                  View Technical Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
