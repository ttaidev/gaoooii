import React from 'react';
import { Sparkles } from 'lucide-react';

interface IntroGuideProps {
  isVisible: boolean;
}

export const IntroGuide: React.FC<IntroGuideProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="bg-white/75 backdrop-blur-md px-6 py-6 sm:px-8 sm:py-7 rounded-3xl shadow-xl border border-white/60 text-center max-w-sm sm:max-w-md mx-4 animate-float">
        {/* Animated Hand/Touch Icon */}
        <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-200/50 animate-ping" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-rose-200 via-pink-100 to-white flex items-center justify-center shadow-inner">
            {/* Hand Wipe SVG Animation */}
            <svg
              className="w-8 h-8 text-rose-500 animate-[bounce_2s_infinite]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="flex items-center justify-center gap-1.5 text-rose-500 text-xs sm:text-sm font-medium tracking-wide mb-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Có 1 điều xinh đẹp đang chờ phía trước</span>
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
          Dùng tay hoặc chuột lau nhẹ lớp sương để mở món quà nhé ♡
        </p>

        {/* Subtle animated wipe gesture line */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-transparent via-rose-300 to-transparent rounded-full animate-pulse" />
          <span className="text-[11px] text-rose-400 font-light italic">Chạm & vuốt màn hình</span>
          <div className="h-1 w-12 bg-gradient-to-r from-transparent via-rose-300 to-transparent rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
