import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Shield,
  Database,
  User,
  X,
  CheckCircle,
  BarChart3,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const MARKET_SECTORS = [
  { name: 'Technology', trend: 'Positive', value: '+1.2%' },
  { name: 'Healthcare', trend: 'Stable', value: '+0.3%' },
  { name: 'Finance', trend: 'Positive', value: '+0.8%' },
  { name: 'Energy', trend: 'Negative', value: '-0.4%' },
  { name: 'Consumer', trend: 'Positive', value: '+0.6%' },
  { name: 'Industrial', trend: 'Stable', value: '+0.2%' },
];

const ANALYSIS_STEPS = [
  'Retrieving historical market data',
  'Processing technical indicators',
  'Analyzing volume patterns',
  'Evaluating market sentiment',
  'Calculating volatility metrics',
  'Compiling educational report',
];

const FEATURES = [
  {
    icon: Database,
    title: 'Data Analysis',
    description: 'Historical pattern recognition for educational purposes',
  },
  {
    icon: BarChart3,
    title: 'Market Insights',
    description: 'Educational market trend information',
  },
  {
    icon: Shield,
    title: 'Research Tools',
    description: 'Learning resources for market research',
  },
];

const TESTIMONIALS = [
  {
    text: 'A helpful educational tool for understanding market patterns and trends. Great for learning purposes.',
    author: 'Jennifer Martinez',
    title: 'Market Researcher',
    location: 'New York',
  },
  {
    text: 'Excellent platform for studying historical market data and understanding technical analysis concepts.',
    author: 'David Thompson',
    title: 'Investment Analyst',
    location: 'Chicago',
  },
  {
    text: 'Useful educational resource that helps me understand different analytical approaches to market research.',
    author: 'Lisa Chen',
    title: 'Financial Student',
    location: 'San Francisco',
  },
];

const COMPLIANCE_DISCLOSURES = [
  {
    title: 'Educational Purpose',
    content: 'This platform is designed exclusively for educational and informational purposes. All content, analysis, and data are provided to enhance understanding of market analysis concepts and should not be used as the sole basis for any decision.',
  },
  {
    title: 'No Financial Advice',
    content: 'The information provided does not constitute financial, investment, trading, or any other type of advice. Users should not construe any information as professional guidance or recommendations.',
  },
  {
    title: 'Historical Data Limitations',
    content: 'Past performance and historical patterns do not predict or guarantee future results. Market conditions change constantly, and historical analysis is provided only for educational understanding of analytical methods.',
  },
  {
    title: 'Risk Acknowledgment',
    content: 'All market activities involve substantial risk. Users should conduct their own research and consult with licensed financial professionals before making any decisions. This tool does not reduce or eliminate market risks.',
  },
  {
    title: 'No Guarantees',
    content: 'We make no representations or warranties regarding accuracy, completeness, or reliability of any information. Analysis results are computational outputs for educational study only.',
  },
  {
    title: 'Independent Research Required',
    content: 'This educational tool is not a substitute for professional guidance. Users must perform independent research and due diligence, and should consult qualified financial advisors.',
  },
];

export default function AIStockProEnterprise({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [tickerInput, setTickerInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analyzedSymbol, setAnalyzedSymbol] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
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
    }, 35);
  };

  const handleConversionClick = () => {
    sendGA4Event('Add');
    trackClick('conversion-cta', 'button');
    trackConversion('access-report');

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <section className="relative px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-semibold text-lg">Professional Stock Research Platform</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
              Advanced Market Analysis
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-blue-300">
              Educational Research Tools
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Professional-grade analytical tools for educational purposes and market research learning
            </p>

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-6 py-3 mb-8">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-300">
                For Educational &amp; Informational Purposes Only - Not Financial Advice
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Enter Symbol for Educational Analysis</h3>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <input
                type="text"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-base"
                placeholder="Stock Symbol (e.g., AAPL, MSFT, TSLA)"
              />
              <button
                onClick={handleAnalyzeClick}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/50 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Start Educational Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Analysis is for learning purposes only and does not constitute investment advice
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-300">
            Educational Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all"
                >
                  <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-400" />
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
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-300">
            Market Sectors Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MARKET_SECTORS.map((sector, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">{sector.name}</h4>
                <p className="text-sm text-slate-400 mb-1">{sector.trend}</p>
                <p className={`text-lg font-bold ${sector.value.startsWith('+') ? 'text-green-400' : sector.value.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                  {sector.value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            Data shown for educational purposes. Past performance does not guarantee future results.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-300">
            User Testimonials
          </h2>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {TESTIMONIALS.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6 max-w-2xl mx-auto">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{testimonial.author}</p>
                          <p className="text-sm text-blue-400">{testimonial.title}</p>
                          <p className="text-xs text-slate-400">{testimonial.location}</p>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">"{testimonial.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-blue-500 w-8' : 'bg-slate-600 w-2'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/20 border-2 border-red-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Important Risk Disclosure</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Market activities involve substantial risk of loss. Past performance does not guarantee future results.
                  This platform is for educational purposes only and does not provide financial, investment, or trading advice.
                  Always consult licensed financial professionals before making any decisions.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-blue-400 mb-6 text-center">
            Legal Disclosures &amp; Compliance Information
          </h3>

          <div className="space-y-4">
            {COMPLIANCE_DISCLOSURES.map((disclosure, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-base font-semibold text-blue-400 mb-2">
                  {disclosure.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {disclosure.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm mb-2">
              © 2025 Professional Stock Research Platform. Educational Services.
            </p>
            <p className="text-slate-500 text-xs">
              All content provided for educational and informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-slate-800 border border-blue-500/30 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              Educational Analysis: <span className="text-blue-400">{analyzedSymbol}</span>
            </h3>

            {isAnalyzing ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-300">
                    Processing educational data for <span className="font-semibold text-blue-400">{analyzedSymbol}</span>
                  </p>
                </div>

                <div className="mb-8">
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
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
                        {isCompleted && <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />}
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-blue-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Educational Report Ready</h4>
                  <p className="text-slate-300">
                    Your educational analysis for <span className="font-semibold text-blue-400">{analyzedSymbol}</span> is available
                  </p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm">
                      This analysis is for educational purposes only. It does not constitute financial advice.
                      Consult licensed professionals before making any decisions.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleConversionClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/50 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <TrendingUp className="w-6 h-6" />
                  Access Educational Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
