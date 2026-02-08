import { useState, useEffect } from 'react';
import { Radar, Brain, Star, Cpu, Radio, Antenna, ShieldAlert, List } from 'lucide-react';
import { TemplateProps } from '../types';
import { useTemplate } from '../../src/contexts/TemplateContext';
import { getConfig } from '../../src/config/config';

const LINE_ICON_PATH = "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314";

const DIRECTORY_ITEMS = [
  {
    icon: Radar,
    iconColor: 'text-yellow-400',
    title: '情報の「鮮度」と「深度」',
    description: 'ネットや雑誌の推奨銘柄は、プ口が売り抜けるための「手遅れの情報」です。私たちはAIを用い、',
    highlight: '機関投資家が密かに仕込む数兆円の資金流入',
    descriptionEnd: 'をリアルタイムで検知。一般には出回らない「初動の優良株」を特定します。'
  },
  {
    icon: Brain,
    iconColor: 'text-yellow-400',
    title: '感情という「最大の敵」',
    description: '「損切りできない」「利確を急ぎすぎる」という心理は、脳の仕組み上避けられません。Alは',
    highlight: '感情を一切排除した冷徹なデ一タ分析',
    descriptionEnd: 'により、数学的な最適解となる「出口戦略」を提示。あなたの決断から迷いを取り去ります。'
  },
  {
    icon: Star,
    iconColor: 'text-yellow-400',
    title: '孤立無援の「投資判断」',
    description: '相場が急変したとき、一人で悩むのはもう終わりです。私たちは同じ日本人として、',
    highlight: '暴落の兆候や絶好の買い場',
    descriptionEnd: 'をLINEで即座に共有。プロの知見とAlの予測が、あなたの資産を守る「盾」となります。'
  }
];

const SERVICE_CARDS = [
  {
    icon: Cpu,
    iconColor: 'text-blue-400',
    title: '膨大デ一夕解析',
    metric: '99.8%',
    subtitle: '不要情報の除去率'
  },
  {
    icon: Radio,
    iconColor: 'text-green-400',
    title: '市場心理の数値化',
    metric: '即時判定',
    subtitle: '感情に流されない判断'
  },
  {
    icon: Antenna,
    iconColor: 'text-yellow-400',
    title: '大口資金の追跡',
    metric: '深層検知',
    subtitle: '機関投資家の動きを把握'
  },
  {
    icon: ShieldAlert,
    iconColor: 'text-red-400',
    title: '暴落の事前予測',
    metric: '危機回避',
    subtitle: '資産を守る防衛機能'
  }
];

const FAQ_ITEMS = [
  {
    question: '問:なぜ、ここまで有益な情報を無料で出すのか?',
    answer: '答:不透明な投資詐欺が横行する日本で、まずは「本物の基準」を知っていただきたいからです。皆様の成功が私たちの信頼となり、ひいては日本経済の再生に繋がると信じています。',
    borderColor: 'border-blue-600'
  },
  {
    question: '問:優良株、というのはどう証明するのか?',
    answer: '答:公式での配信内容を見ていただければ一目瞭然です。具体的かつ理論的な選定理由、そしてAIによる数値的な根拠。一切の誤魔化しがないことを、結果で証明します。',
    borderColor: 'border-yellow-500'
  }
];

export default function JPStockAI({ templateId, visitorId }: TemplateProps) {
  const { trackConversion, trackClick, trafficLink, sendGA4Event } = useTemplate();
  const [remainingSlots, setRemainingSlots] = useState(3);

  useEffect(() => {
    console.log('[JP Stock AI] Traffic link data:', trafficLink);
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

  const handleFirstCTA = () => {
    console.log('[JP Stock AI] First CTA clicked');
    console.log('[JP Stock AI] TrafficLink data:', trafficLink);

    sendGA4Event('first_cta_click');
    trackClick('first-cta-button', 'button');
    trackConversion('line-cta-top');

    if (trafficLink?.url) {
      console.log('[JP Stock AI] Opening traffic link URL:', trafficLink.url);
      window.open(trafficLink.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('[JP Stock AI] No traffic link URL available. No action taken.');
    }
  };

  const handleMainCTA = () => {
    console.log('[JP Stock AI] Main CTA clicked');
    console.log('[JP Stock AI] TrafficLink data:', trafficLink);

    sendGA4Event('main_cta_click');
    trackClick('main-cta-button', 'button');
    trackConversion('line-cta-bottom');

    if (trafficLink?.url) {
      console.log('[JP Stock AI] Opening traffic link URL:', trafficLink.url);
      window.open(trafficLink.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('[JP Stock AI] No traffic link URL available. No action taken.');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <section className="bg-black py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-breathe"></div>
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center">
            2月：AI選定の [最高級・優良株] 分析完了
          </h1>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="bg-orange-200 text-orange-700 px-6 py-2 rounded-full text-sm font-semibold">
              長期保有を前提に厳選
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black">
              個人投資家のための
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-600">
              長く持ち続けたい
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-black">
              優良銘柄リスト
            </h2>
          </div>

          <div className="text-center text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
            <p>配当·事業内容·財務デ一タなどを総合的に整理。</p>
            <p>短期目線ではなく、</p>
            <p className="text-red-600 font-bold">中長期で検討されやすい注目銘柄</p>
            <p>をまとめました。</p>
          </div>

          <button
            onClick={handleFirstCTA}
            className="w-full max-w-md mx-auto block bg-[#00B900] hover:bg-[#00A000] text-white py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mb-3"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={LINE_ICON_PATH} />
              </svg>
              <span>高配当·優良銘柄リストを受け取る</span>
            </div>
          </button>

          <p className="text-center text-xs text-gray-500">
            ※内容確認用の情報が順次届きます
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-blue-900 to-blue-950 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="border-2 border-yellow-400 text-yellow-400 px-6 py-2 rounded-full text-xs font-semibold">
              AIが導き出す勝機の真実
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
            あなたが 「優良株」 で<br />勝てなかった三つの理由。
          </h3>

          <p className="text-center text-gray-300 text-sm italic mb-12">
            --その壁は、最新の科学で取り払うことが可能です。
          </p>

          <div className="space-y-8 mb-8">
            {DIRECTORY_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-blue-900/30 rounded-xl p-6 border border-blue-800">
                  <div className="flex items-start gap-4 mb-3">
                    <Icon className={`w-8 h-8 ${item.iconColor} flex-shrink-0`} />
                    <h4 className="text-xl font-bold text-white">
                      {index + 1}、{item.title}
                    </h4>
                  </div>
                  <p className="text-blue-200 text-sm leading-relaxed pl-12">
                    {item.description}
                    <span className="text-yellow-400 font-semibold">{item.highlight}</span>
                    {item.descriptionEnd}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6 text-center">
            <p className="text-white text-sm leading-relaxed">
              「もっと早く、この情報に出会っていれば」多くの利用者がそう語る
              <span className="text-yellow-400 font-semibold">異次元の分析精度</span>
              を、次はあなたの目でお確かめください。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-950 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-blue-400"></div>
          <div className="absolute top-0 left-2/4 w-px h-full bg-blue-400"></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-blue-400"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex justify-center mb-6">
            <span className="border-2 border-blue-400 text-blue-400 px-6 py-2 rounded-full text-xs font-semibold">
              最先端·AI解析システム
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
            「誠実さ」を 「科学」で裏付ける。
          </h3>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            全三千八百銘柄を、二十四時間監視。
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {SERVICE_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center">
                    <Icon className={`w-10 h-10 ${card.iconColor} mb-3`} />
                    <h4 className="text-white text-sm font-semibold mb-2">{card.title}</h4>
                    <p className="text-4xl font-bold italic mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {card.metric}
                    </p>
                    <p className="text-gray-400 text-xs">{card.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
            <p className="text-blue-200 text-sm text-center leading-relaxed">
              人間の主観には、必ず 「偏り」が生じます。私たちは独自の投資用AIを駆使し、
              <span className="text-yellow-400 font-semibold">日本人の気質に合わせた優良銘柄の選定</span>
              を完全に数値化。感情に惑わされない、誠実な投資判断を可能にしました。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-blue-600 text-center text-sm font-semibold mb-3">確固たる分析結果</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black mb-8">
              分析の精度が、そのまま「資産の質」に変わる
            </h3>

            <div className="relative rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8 sm:p-12 shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path d="M 0 150 L 50 140 L 100 120 L 150 130 L 200 100 L 250 90 L 300 70 L 350 60 L 400 50" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                  <rect x="50" y="140" width="8" height="10" fill="rgba(255,100,100,0.5)" />
                  <rect x="100" y="120" width="8" height="30" fill="rgba(100,255,100,0.5)" />
                  <rect x="150" y="130" width="8" height="20" fill="rgba(255,100,100,0.5)" />
                  <rect x="200" y="100" width="8" height="50" fill="rgba(100,255,100,0.5)" />
                  <rect x="250" y="90" width="8" height="60" fill="rgba(100,255,100,0.5)" />
                  <rect x="300" y="70" width="8" height="80" fill="rgba(100,255,100,0.5)" />
                </svg>
              </div>

              <div className="relative z-10 text-center">
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-bold italic text-yellow-400 mb-4 leading-tight">
                  2026年度版:厳選された優良銘柄群
                </h4>
                <p className="text-white text-sm sm:text-base">
                  「日本人を裏切らない」と誓ったからこそ、AIと共に辿り着いた、妥協なき数字です。
                </p>
              </div>
            </div>

            <p className="text-gray-500 text-xs text-center">
              ※上記は過去の解析デ一タに基づく結果であり、将来を保証するものではありません。しかし、根拠のない夢物語を語ることは、プロの矜持が許しません。
            </p>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black mb-8">
              実績が証明する、「優良株」という名の盾。
            </h3>

            <div className="flex justify-center mb-4">
              <img
                src="/top1.png"
                alt="AI選定の実績データ"
                className="w-full max-w-2xl rounded-xl shadow-lg"
              />
            </div>

            <p className="text-gray-500 text-xs text-center">
              ※過去の実績であり、将来の結果を保証するものではありません。しかし、根拠のない推測を排除し、誠実なデ一タのみを基軸としています。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-gray-100 py-16 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <List className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl sm:text-3xl font-bold text-black">核心に触れるお答え</h3>
          </div>

          <div className="space-y-6">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className={`text-blue-600 font-bold text-lg mb-3 border-l-4 ${item.borderColor} pl-4`}>
                  {item.question}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed pl-4">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-gray-200 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-breathe"></div>
              <span className="text-red-600 font-semibold">本日の特別配布:残り{remainingSlots}名</span>
            </div>
            <span className="text-gray-500">安全な通信を保護済み</span>
          </div>

          <button
            onClick={handleMainCTA}
            className="w-full bg-[#00B900] hover:bg-[#00A000] text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mb-2"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-100 mb-1">誠実な投資の第一歩をここから</span>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={LINE_ICON_PATH} />
                </svg>
                <span className="text-lg">無料の優良株レポートを受け取る</span>
              </div>
            </div>
          </button>

          <p className="text-center text-xs text-gray-500">
            2026日本株投資·誠実推進ネットワ一ク|日本を、もっと豊かに。
          </p>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        .animate-breathe {
          animation: breathe 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
