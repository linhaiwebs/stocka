import { useState, useEffect } from 'react';
import {
  Zap,
  Target,
  BarChart3,
  Shield,
  Lock,
  CheckCircle,
  Gem,
  Smartphone,
  X,
  MessageSquare
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Instant market data processing'
  },
  {
    icon: Target,
    title: '94% Accuracy',
    description: 'Historical performance metric'
  },
  {
    icon: BarChart3,
    title: 'Market Sentiment',
    description: 'Track investor confidence'
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Comprehensive risk evaluation'
  }
];

const STATS = [
  {
    number: '10,000+',
    label: 'Assets Analyzed'
  },
  {
    number: '500K+',
    label: 'Active Users'
  },
  {
    number: '24/7',
    label: 'Market Coverage'
  }
];

const TRUST_BADGES = [
  {
    icon: Lock,
    label: 'Secure'
  },
  {
    icon: Zap,
    label: 'Instant'
  },
  {
    icon: CheckCircle,
    label: 'Verified'
  },
  {
    icon: Gem,
    label: 'Premium'
  }
];

const ANALYSIS_STEPS = [
  'Connecting to market data feeds',
  'Analyzing price patterns and trends',
  'Evaluating technical indicators',
  'Processing sentiment analysis',
  'Calculating risk metrics',
  'Generating predictive models',
  'Compiling comprehensive report'
];

export default function AIStockOracle({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [stockSymbol, setStockSymbol] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

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
    console.log('[AI Stock Oracle] Analyze Now clicked for symbol:', stockSymbol);

    sendGA4Event('Bdd');
    trackClick('analyze-now-button', 'button');

    setIsLoading(true);
    setAnalysisProgress(0);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + 1;
        const stepIndex = Math.floor((newProgress / 100) * ANALYSIS_STEPS.length);

        if (stepIndex !== currentStep && stepIndex < ANALYSIS_STEPS.length) {
          setCurrentStep(stepIndex);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setShowConversionModal(true);
          }, 500);
        }

        return Math.min(newProgress, 100);
      });
    }, 35);
  };

  const handleWhatsAppClick = () => {
    console.log('[AI Stock Oracle] WhatsApp button clicked');

    trackClick('whatsapp-button', 'button');
    trackConversion('whatsapp-contact');

    if (trafficLink?.url) {
      console.log('[AI Stock Oracle] Opening traffic link URL via WhatsApp:', trafficLink.url);
      window.open(trafficLink.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('[AI Stock Oracle] No traffic link URL available. No action taken.');
    }
  };

  const handleModalWhatsAppClick = () => {
    console.log('[AI Stock Oracle] Modal WhatsApp button clicked');
    console.log('[AI Stock Oracle] TrafficLink data:', trafficLink);

    sendGA4Event('Add');
    trackClick('modal-whatsapp-button', 'button');
    trackConversion('modal-whatsapp-conversion');

    if (trafficLink?.url) {
      console.log('[AI Stock Oracle] Opening traffic link URL:', trafficLink.url);

      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
    } else {
      console.warn('[AI Stock Oracle] No traffic link URL available. No action taken.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            #1 Trading Platform in US
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Stock Market Intelligence
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced real-time analysis platform with predictive analytics for informed trading decisions
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 sm:p-6 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
              >
                <div className="flex items-start gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-1">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">{stat.number}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Input and Primary CTA Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="mb-6">
            <input
              type="text"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeClick()}
              className={`w-full px-6 py-4 bg-slate-900/50 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                isFocused ? 'border-green-400 shadow-lg shadow-green-500/20' : 'border-green-500/30'
              }`}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, NVDA)"
            />
          </div>

          <button
            onClick={handleAnalyzeClick}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/30 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Gem className="w-6 h-6" />
            ANALYZE NOW
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          {TRUST_BADGES.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 bg-slate-800/40 border border-green-500/20 px-4 py-2 rounded-full"
              >
                <Icon className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">{badge.label}</span>
              </div>
            );
          })}
        </div>

        {/* Secondary CTA - WhatsApp */}
        <div className="text-center">
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-3 bg-transparent border-2 border-green-500 hover:bg-green-500/10 text-green-400 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] mb-3"
          >
            <Smartphone className="w-5 h-5" />
            Get Premium Analysis via WhatsApp
          </button>
          <p className="text-sm text-slate-500">Available 24/7</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <p className="text-center text-xs text-slate-500 leading-relaxed max-w-3xl mx-auto">
            This platform is an educational and analytical tool. All data and metrics are for informational purposes only.
            Past performance statistics do not guarantee future results. Users should conduct their own research and consult
            with financial advisors before making investment decisions.
          </p>
        </div>
      </div>

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 animate-pulse" />
              Analyzing Market Data
            </h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300 ease-out shadow-lg shadow-green-500/50"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <p className="text-green-400 text-sm text-center mt-2 font-semibold">{analysisProgress}%</p>
            </div>

            {/* Current Steps */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {ANALYSIS_STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index < currentStep ? 'opacity-100' : index === currentStep ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : index === currentStep ? (
                    <div className="w-5 h-5 border-2 border-green-400 rounded-full flex-shrink-0 animate-pulse"></div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-600 rounded-full flex-shrink-0"></div>
                  )}
                  <span className={`text-sm ${index <= currentStep ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conversion Modal */}
      {showConversionModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/50 rounded-2xl p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowConversionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-3xl font-bold text-white mb-4">
                Analysis Complete!
              </h3>

              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Your comprehensive market intelligence report is ready. Connect with our expert analysts via WhatsApp for detailed insights and personalized trading recommendations.
              </p>

              <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
                <p className="text-green-400 font-semibold mb-2">Premium Features Include:</p>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✓ Real-time price alerts</li>
                  <li>✓ Advanced technical analysis</li>
                  <li>✓ Risk management strategies</li>
                  <li>✓ 24/7 expert support</li>
                </ul>
              </div>

              <button
                onClick={handleModalWhatsAppClick}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/40 active:scale-[0.98] mb-3 flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-6 h-6" />
                Get Report via WhatsApp
              </button>

              <button
                onClick={() => setShowConversionModal(false)}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
