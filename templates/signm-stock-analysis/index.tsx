import { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  Building2,
  Globe,
  Users,
  CheckCircle,
  X,
  MessageCircle,
  Star,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const FLOATING_PRICES = [
  { value: '37.73', position: 'top-[15%] left-[5%]' },
  { value: '78.82', position: 'top-[25%] right-[8%]' },
  { value: '145.67', position: 'top-[45%] left-[3%]' },
  { value: '92.34', position: 'top-[60%] right-[5%]' }
];

const STRATEGY_POINTS = [
  {
    number: '01',
    title: 'Multi-factor assessment',
    description: 'Comprehensive evaluation across technical, fundamental, and sentiment dimensions'
  },
  {
    number: '02',
    title: 'Risk identification',
    description: 'Advanced pattern recognition to identify potential volatility and market risks'
  },
  {
    number: '03',
    title: 'Timing optimization',
    description: 'Strategic entry and exit point analysis based on historical performance data'
  },
  {
    number: '04',
    title: 'Portfolio integration',
    description: 'Assess how new positions align with your overall investment strategy'
  }
];

const DIMENSIONS = [
  {
    icon: BarChart3,
    title: 'Technical Analysis',
    description: 'Chart patterns, momentum indicators, and price action signals for optimal timing'
  },
  {
    icon: Building2,
    title: 'Financial Condition',
    description: 'Balance sheet strength, liquidity ratios, and overall financial health assessment'
  },
  {
    icon: Target,
    title: 'Fundamental Analysis',
    description: 'Earnings quality, revenue growth, and business model sustainability evaluation'
  },
  {
    icon: Globe,
    title: 'Macroeconomic Factors',
    description: 'Interest rates, inflation trends, and broader economic cycle impact analysis'
  },
  {
    icon: Users,
    title: 'Investor Sentiment',
    description: 'Market psychology, positioning data, and crowd behavior pattern analysis'
  },
  {
    icon: Shield,
    title: 'Corporate Governance',
    description: 'Management quality, board effectiveness, and shareholder alignment evaluation'
  },
  {
    icon: TrendingUp,
    title: 'Industry Analysis',
    description: 'Competitive positioning, sector trends, and market share dynamics assessment'
  }
];

const SCAN_STEPS = [
  'Gathering historical price and volume data',
  'Analyzing technical indicators and chart patterns',
  'Evaluating financial statements and ratios',
  'Assessing macroeconomic impact factors',
  'Reviewing investor sentiment indicators',
  'Synthesizing multi-dimensional insights',
  'Generating comprehensive analysis report'
];

const TESTIMONIALS = [
  {
    text: 'The seven-dimensional analysis provides a complete picture I never had before. It covers everything from technicals to governance in one place.',
    author: 'Robert M.',
    role: 'Active Trader'
  },
  {
    text: 'This platform helped me identify risks I would have missed looking at charts alone. The comprehensive approach gives me confidence in my decisions.',
    author: 'Jennifer L.',
    role: 'Portfolio Manager'
  },
  {
    text: 'Finally, a tool that combines technical and fundamental analysis seamlessly. The insights are actionable and easy to understand.',
    author: 'David K.',
    role: 'Individual Investor'
  }
];

export default function SignmStockAnalysis({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [stockSymbol, setStockSymbol] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    console.log('[Signm Stock Analysis] Traffic link data:', trafficLink);
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

  const handleCheckNow = () => {
    console.log('[Signm Stock Analysis] Check Now clicked for symbol:', stockSymbol);

    sendGA4Event('Bdd');
    trackClick('check-now-hero', 'button');

    setIsLoading(true);
    setScanProgress(0);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 1;
        const stepIndex = Math.floor((newProgress / 100) * SCAN_STEPS.length);

        if (stepIndex !== currentStep && stepIndex < SCAN_STEPS.length) {
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
    }, 30);
  };

  const handleConversionClick = (buttonId: string) => {
    console.log('[Signm Stock Analysis] Conversion button clicked:', buttonId);
    console.log('[Signm Stock Analysis] TrafficLink data:', trafficLink);

    sendGA4Event('Add');
    trackClick(buttonId, 'button');
    trackConversion('stock-analysis-conversion');

    if (trafficLink?.url) {
      console.log('[Signm Stock Analysis] Opening traffic link URL:', trafficLink.url);

      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion(trafficLink.url);
      } else {
        window.location.href = trafficLink.url;
      }
    } else {
      console.warn('[Signm Stock Analysis] No traffic link URL available. No action taken.');
    }
  };

  const handleWhatsAppClick = () => {
    console.log('[Signm Stock Analysis] WhatsApp button clicked');
    trackClick('whatsapp-button', 'button');
    trackConversion('whatsapp-contact');

    if (trafficLink?.url) {
      window.open(trafficLink.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('[Signm Stock Analysis] No traffic link URL available. No action taken.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black overflow-hidden">
        {/* Floating Stock Prices */}
        {FLOATING_PRICES.map((price, index) => (
          <div
            key={index}
            className={`absolute ${price.position} text-blue-400/30 font-bold text-2xl sm:text-3xl animate-pulse`}
          >
            {price.value}
          </div>
        ))}

        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Brand Logo/Name */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Signm Intelligent Analysis
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Advanced seven-dimensional stock diagnosis platform for informed investment decisions
            </p>

            {/* Yellow Highlight Text */}
            <div className="mb-4">
              <p className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                Diagnose your stock now for a full report
              </p>
              <p className="text-lg text-yellow-300">
                Assess Profit Potential Instantly
              </p>
            </div>

            {/* Stock Input Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto mt-12">
              <input
                type="text"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleCheckNow()}
                className={`w-full px-6 py-4 bg-blue-950/80 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 mb-4 ${
                  isFocused ? 'border-blue-400 shadow-lg shadow-blue-500/30' : 'border-blue-600/50'
                }`}
                placeholder="Enter stock symbol or name (e.g., AAPL, TSLA)"
              />

              <button
                onClick={handleCheckNow}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <BarChart3 className="w-6 h-6" />
                Check Now
              </button>

              <p className="text-yellow-400 text-sm mt-4">
                Free comprehensive analysis available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Daily Strategy Guide Section */}
      <section className="bg-black py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Market Daily Strategy Guide
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Professional-grade analysis framework designed for both active traders and long-term investors
              </p>

              <div className="space-y-6 mb-8">
                {STRATEGY_POINTS.map((point, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400 font-bold text-lg">{point.number}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{point.title}</h3>
                      <p className="text-gray-400 text-sm">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleConversionClick('strategy-cta')}
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2"
              >
                Free Analysis Experience
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right 3D Graphic */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl transform rotate-12 hover:rotate-6 transition-transform duration-500 shadow-2xl shadow-blue-500/50"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 to-cyan-400 rounded-3xl transform -rotate-12 hover:-rotate-6 transition-transform duration-500 shadow-2xl shadow-cyan-500/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-blue-500/30">
                    <BarChart3 className="w-24 h-24 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seven-Dimensional Analysis Section */}
      <section className="bg-black py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Fully Automated Identification of High Potential Analytics
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Our advanced system evaluates stocks across seven critical dimensions, providing comprehensive insights that go beyond traditional analysis methods
              </p>
              <p className="text-blue-400 font-semibold mt-4">Technical analysis</p>
            </div>

            {/* Seven-Sided Radar Chart */}
            <div className="relative mb-16">
              <svg viewBox="0 0 400 400" className="w-full max-w-2xl mx-auto">
                <defs>
                  <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Heptagon Shape */}
                <polygon
                  points="200,50 330,110 370,230 280,340 120,340 30,230 70,110"
                  fill="url(#radarGradient)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="drop-shadow-2xl"
                />

                {/* Center Circle */}
                <circle cx="200" cy="200" r="80" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />

                {/* Center Text */}
                <text x="200" y="195" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
                  The Seven-Dimensional
                </text>
                <text x="200" y="215" textAnchor="middle" fill="#ffffff" fontSize="14">
                  Stock Diagnosis System
                </text>
              </svg>

              {/* Dimension Labels Around Chart */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold whitespace-nowrap">Technical Analysis</span>
                </div>
                <div className="absolute top-[15%] right-[5%]">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold whitespace-nowrap">Financial Condition</span>
                </div>
                <div className="absolute top-[45%] right-0">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold whitespace-nowrap">Fundamental Analysis</span>
                </div>
                <div className="absolute bottom-[15%] right-[10%]">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold whitespace-nowrap">Macro Factors</span>
                </div>
                <div className="absolute bottom-[15%] left-[10%]">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold whitespace-nowrap">Investor Sentiment</span>
                </div>
                <div className="absolute top-[45%] left-0">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold whitespace-nowrap">Corporate Governance</span>
                </div>
                <div className="absolute top-[15%] left-[5%]">
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold whitespace-nowrap">Industry Analysis</span>
                </div>
              </div>
            </div>

            {/* Dimension Details Grid - 2 columns on mobile, 3 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {DIMENSIONS.map((dimension, index) => {
                const Icon = dimension.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 sm:p-6 hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-white font-semibold text-sm sm:text-base mb-2">{dimension.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">{dimension.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={() => handleConversionClick('seven-dimensional-cta')}
                className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-12 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]"
              >
                Check Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-black py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                What People Say About Us
              </h2>
              <p className="text-gray-400 text-lg">
                Trusted by thousands of investors worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-slate-700 pt-4">
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer/Contact Section */}
      <section className="bg-blue-600 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-5 h-5" />
                  <span>support@signmanalysis.com</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <MapPin className="w-5 h-5" />
                  <span>New York, NY 10001</span>
                </div>
              </div>

              {/* Right CTA */}
              <div className="text-center md:text-right">
                <button
                  onClick={() => handleConversionClick('footer-recommendation-cta')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Contact us for a free recommendation
                </button>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center border-t border-blue-500 pt-8">
              <button
                onClick={() => handleConversionClick('footer-bottom-cta')}
                className="bg-white hover:bg-gray-100 text-blue-600 py-3 px-10 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Contact us for a free recommendation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 z-50"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Analyzing your stock...
            </h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-blue-400 text-sm text-center mt-2">{scanProgress}%</p>
            </div>

            {/* Current Step */}
            <div className="space-y-2">
              {SCAN_STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index < currentStep ? 'opacity-100' : index === currentStep ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-blue-400 rounded-full flex-shrink-0"></div>
                  )}
                  <span className="text-gray-300 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conversion Modal */}
      {showConversionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setShowConversionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Analysis Complete!
              </h3>

              <p className="text-gray-300 mb-6">
                Your comprehensive seven-dimensional stock analysis is ready. Get detailed insights and personalized recommendations from our expert team.
              </p>

              <button
                onClick={() => handleConversionClick('conversion-modal-cta')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] mb-3"
              >
                Get Your Full Report Now
              </button>

              <button
                onClick={() => setShowConversionModal(false)}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
