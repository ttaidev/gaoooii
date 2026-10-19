import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface CelebrationBadgeProps {
  message: string;
  isVisible: boolean;
}

export const CelebrationBadge: React.FC<CelebrationBadgeProps> = ({ message, isVisible }) => {
  return (
    <div
      className={`transition-all duration-1000 transform flex items-center justify-center gap-2 mb-3 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-100/90 via-pink-100/95 to-rose-100/90 border border-rose-300/70 shadow-sm backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
        <span className="text-xs sm:text-sm font-medium text-rose-700 tracking-wide">
          {message}
        </span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
      </div>
    </div>
  );
};
