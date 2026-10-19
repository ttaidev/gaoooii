import React, { useState } from 'react';
import { RotateCcw, Copy, Check, Edit3, Heart, Sparkles } from 'lucide-react';
import { CardConfig } from '../config/cardConfig';

interface GreetingCardProps {
  config: CardConfig;
  isRevealed: boolean;
  revealProgress: number;
  onReset: () => void;
  onOpenCustomizer: () => void;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({
  config,
  isRevealed,
  revealProgress,
  onReset,
  onOpenCustomizer,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `${config.recipient}\n\n${config.title}\n\n${config.greetingParagraphs.join('\n\n')}\n\n${config.signature}\n${config.madeWithLove}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Card unblurs and brightens as it's revealed
  const cardBlur = isRevealed ? 0 : Math.max(0, (1 - revealProgress) * 6);
  const cardScale = isRevealed ? 1 : 0.98 + revealProgress * 0.02;

  return (
    <div
      className="relative z-20 w-full max-w-xl mx-auto px-4 py-6 sm:py-8 transition-transform duration-500 ease-out"
      style={{
        transform: `scale(${cardScale})`,
        filter: `blur(${cardBlur}px)`,
      }}
    >
      {/* Outer Romantic Glowing Frame */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-white/90 via-rose-200/60 to-white/80 shadow-[0_20px_50px_rgba(255,182,193,0.35)] backdrop-blur-xl">
        {/* Main Glass Card Body */}
        <div className="relative rounded-[22px] bg-white/85 sm:bg-white/88 p-6 sm:p-9 text-slate-800 backdrop-blur-xl border border-white/60 overflow-hidden">
          
          {/* Subtle Decorative Background Watermark Pattern */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-200/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-pink-200/25 blur-3xl pointer-events-none" />

          {/* Delicate Top Accent */}
          <div className="flex items-center justify-between mb-4">
            {config.badge ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase bg-rose-50 border border-rose-200/70 text-rose-600">
                <Sparkles className="w-3 h-3 text-rose-500" />
                {config.badge}
              </span>
            ) : (
              <div />
            )}
            <span className="font-cursive text-xl sm:text-2xl text-rose-400">
              20 • 10
            </span>
          </div>

          {/* Recipient */}
          <div className="text-left mb-3">
            <p className="font-sans font-medium text-sm sm:text-base text-rose-500 tracking-wide">
              {config.recipient}
            </p>
          </div>

          {/* Header Title */}
          <div className="text-center my-4 sm:my-6">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal leading-snug bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 bg-clip-text text-transparent">
              {config.title}
            </h1>
            <p className="font-cursive text-lg sm:text-xl text-rose-400 mt-1">
              {config.subtitle}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-rose-300" />
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-rose-300" />
            </div>
          </div>

          {/* Greeting Paragraphs */}
          <div className="space-y-3.5 sm:space-y-4 text-justify font-sans text-xs sm:text-sm text-slate-700 leading-relaxed sm:leading-loose">
            {config.greetingParagraphs.map((para, index) => (
              <p key={index} className="indent-4">
                {para}
              </p>
            ))}
          </div>

          {/* Signature & Heart */}
          <div className="mt-6 sm:mt-8 pt-4 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="text-center sm:text-left">
              <p className="font-serif italic text-slate-600">
                {config.signature}
              </p>
              <p className="font-cursive text-base text-rose-500">
                {config.madeWithLove}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition"
                title="Sao chép lời chúc"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenCustomizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition"
                title="Tùy chỉnh lời chúc"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Tùy chỉnh</span>
              </button>

              {isRevealed && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 text-white text-xs font-medium shadow-sm transition"
                  title="Lau lại từ đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Lau lại</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
