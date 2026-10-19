import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { audioManager } from '../utils/audio';

export const MusicController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Không tự động phát theo yêu cầu trình duyệt và prompt
    // Để người dùng chủ động bật
  }, []);

  const handleTogglePlay = () => {
    const active = audioManager.toggleMusic();
    setIsPlaying(active);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        onClick={handleTogglePlay}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md border ${
          isPlaying
            ? 'bg-rose-500/85 text-white border-rose-300 shadow-rose-200/50'
            : 'bg-white/80 text-slate-700 hover:bg-white/95 border-white/60 hover:shadow-lg'
        }`}
        title={isPlaying ? "Tạm dừng giai điệu" : "Bật nhạc piano"}
      >
        <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
        <span className="text-xs font-medium hidden sm:inline">
          {isPlaying ? "Giai điệu" : "Bật nhạc"}
        </span>

        {/* Animated Sound Wave bars when playing */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
            <span className="w-0.5 bg-white rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-3" />
            <span className="w-0.5 bg-white rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-1.5" />
          </div>
        )}
      </button>

      {isPlaying && (
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white/95 border border-white/60 shadow-md transition-all"
          title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
        </button>
      )}
    </div>
  );
};
