import { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  LineChart,
  User,
  X,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Info
} from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const LEARNING_TOPICS = [
  { icon: LineChart, title: 'Chart Patterns', description: 'Learn to identify common patterns' },
  { icon: TrendingUp, title: 'Trend Analysis', description: 'Understand market trends' },
  { icon: BookOpen, title: 'Technical Indicators', description: 'Study indicator applications' },
];

const ANALYSIS_STEPS = [
  'Loading historical data examples',
  'Demonstrating pattern recognition',
  'Showing indicator calculations',
  'Illustrating volume analysis',
  'Explaining volatility concepts',
  'Preparing educational summary',
];

const STUDENT_REVIEWS = [
  {
    text: 'This learning platform helped me understand the basics of market analysis. Great educational resource for beginners.',
    author: 'Alex Rivera',
    title: 'Finance Student',
    location: 'Boston',
  },
  {
    text: 'Excellent tool for learning about technical analysis concepts. The educational materials are well-structured and easy to follow.',
    author: 'Maria Santos',
    title: 'Business Student',
    location: 'Miami',
  },
  {
    text: 'As someone new to market analysis, this platform provided a helpful introduction to various analytical concepts and methods.',
    author: 'James Wilson',
    title: 'Economics Student',
    location: 'Seattle',
  },
];

const EDUCATIONAL_DISCLAIMERS = [
  {
    title: 'Learning Platform Purpose',
    content: 'This is an educational learning platform designed to teach concepts related to market analysis. All content is created for learning and skill development purposes only.',
  },
  {
    title: 'Not Professional Guidance',
    content: 'This platform provides educational content and should not be interpreted as professional financial advice, recommendations, or guidance. It is a learning tool, not a decision-making service.',
  },
  {
    title: 'Educational Examples Only',
    content: 'All analysis examples, data visualizations, and case studies are presented for educational illustration. They demonstrate analytical concepts and do not predict actual market outcomes or future performance.',
  },
  {
    title: 'Learning vs. Application',
    content: 'Understanding analytical concepts through education does not eliminate market risks or guarantee successful outcomes. Real-world application requires additional research, experience, and professional consultation.',
  },
  {
    title: 'Student Responsibility',
    content: 'Students and users are responsible for their own learning objectives and how they apply educational content. This platform does not direct or recommend specific actions.',
  },
  {
    title: 'No Performance Promises',
    content: 'Past market examples used for educational purposes do not indicate future results. Learning about historical patterns is an educational exercise, not a predictive tool.',
  },
  {
    title: 'Seek Professional Advice',
    content: 'Before applying any concepts learned here, consult with licensed financial professionals and conduct thorough independent research appropriate to your specific situation.',
  },
];

export default function AIStockEduLearn({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [tickerInput, setTickerInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analyzedSymbol, setAnalyzedSymbol] = useState('');
  const [activeReview, setActiveReview] = useState(0);

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
      setActiveReview((prev) => (prev + 1) % STUDENT_REVIEWS.length);
    }, 5500);
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
    }, 32);
  };

  const handleConversionClick = () => {
    sendGA4Event('Add');
    trackClick('learning-cta', 'button');
    trackConversion('access-learning');

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white">
      <section className="relative px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <GraduationCap className="w-7 h-7 text-emerald-400" />
            <span className="text-emerald-400 font-semibold text-lg">Stock Analysis Learning Platform</span>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Educational Resource</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
              Learn Market Analysis
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-emerald-300">
              Interactive Educational Platform
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Study market analysis concepts through interactive examples and educational demonstrations
            </p>

            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-5 py-3">
              <Info className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-slate-300">
                Educational purposes only • Not financial advice • Learn at your own pace
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Try an Educational Example</h3>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <input
                type="text"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-4 text-base"
                placeholder="Enter symbol for learning example (e.g., AAPL)"
              />
              <button
                onClick={handleAnalyzeClick}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/50 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Start Learning Example</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Educational demonstration - Not financial advice or recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-emerald-300">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEARNING_TOPICS.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-all"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{topic.title}</h3>
                  <p className="text-slate-400">{topic.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-emerald-300">
            Student Feedback
          </h2>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeReview * 100}%)` }}
              >
                {STUDENT_REVIEWS.map((review, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-slate-800/60 border border-emerald-500/20 rounded-xl p-6 max-w-2xl mx-auto">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{review.author}</p>
                          <p className="text-sm text-emerald-400">{review.title}</p>
                          <p className="text-xs text-slate-400">{review.location}</p>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">"{review.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {STUDENT_REVIEWS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveReview(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeReview ? 'bg-emerald-500 w-8' : 'bg-slate-600 w-2'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-amber-900/20 border-2 border-amber-500/40 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Important Educational Notice</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  This platform is designed exclusively for educational purposes to teach market analysis concepts.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong>Not Financial Advice:</strong> Content does not constitute financial advice or recommendations.
                  Learning about analytical concepts does not eliminate risks. Always consult licensed professionals before applying knowledge.
                  Past examples do not predict future outcomes.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
            Educational Disclosures
          </h3>

          <div className="space-y-4">
            {EDUCATIONAL_DISCLAIMERS.map((disclaimer, index) => (
              <div key={index} className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-base font-semibold text-emerald-400 mb-2">
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
              © 2025 Stock Analysis Learning Platform. Educational Services.
            </p>
            <p className="text-slate-500 text-xs">
              All content for educational purposes only. Not financial advice. Learn responsibly.
            </p>
          </div>
        </div>
      </footer>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(6, 78, 59, 0.85)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-slate-800 border border-emerald-500/30 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              Learning Example: <span className="text-emerald-400">{analyzedSymbol}</span>
            </h3>

            {isAnalyzing ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-block w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-300">
                    Preparing educational example for <span className="font-semibold text-emerald-400">{analyzedSymbol}</span>
                  </p>
                </div>

                <div className="mb-8">
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300"
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
                        {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />}
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Learning Material Ready</h4>
                  <p className="text-slate-300">
                    Educational example for <span className="font-semibold text-emerald-400">{analyzedSymbol}</span> is prepared
                  </p>
                </div>

                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-300 text-sm mb-2">
                        <strong>Educational Content:</strong> This is a learning demonstration.
                      </p>
                      <p className="text-slate-400 text-xs">
                        Not financial advice. For educational purposes only. Consult professionals before any real-world application.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConversionClick}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/50 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <BookOpen className="w-6 h-6" />
                  Access Learning Materials
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
