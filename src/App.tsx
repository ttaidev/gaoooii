import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { defaultCardConfig, CardConfig } from './config/cardConfig';
import { MistyCanvas } from './components/MistyCanvas';
import { GreetingCard } from './components/GreetingCard';
import { IntroGuide } from './components/IntroGuide';
import { FloatingPetals } from './components/FloatingPetals';
import { MusicController } from './components/MusicController';
import { CelebrationBadge } from './components/CelebrationBadge';
import { CustomizerModal } from './components/CustomizerModal';
import gardenBg from './assets/romantic-garden.jpg';

export function App() {
  const [config, setConfig] = useState<CardConfig>(defaultCardConfig);
  const [isWipingStarted, setIsWipingStarted] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const resetCanvasRef = useRef<(() => void) | null>(null);

  // Người dùng bắt đầu lau lần đầu tiên -> Ẩn dòng hướng dẫn
  const handleFirstWipe = useCallback(() => {
    setIsWipingStarted(true);
  }, []);

  // Cập nhật tiến độ lau (0 đến 1)
  const handleRevealProgress = useCallback((progress: number) => {
    setRevealProgress(progress);
  }, []);

  // Khi lau đủ ~70% -> Kích hoạt hiệu ứng chúc mừng đặc biệt
  const handleRevealComplete = useCallback(() => {
    setIsRevealed(true);

    // Bắn pháo hoa cánh hoa & ánh sáng lung linh kỷ niệm 20/10
    const end = Date.now() + 1500;
    const colors = ['#ff85a2', '#ffb3c6', '#fbb1bd', '#fde2e4', '#ffe5ec', '#f9e79f'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Đăng ký hàm reset từ Canvas
  const handleResetReady = useCallback((resetFn: () => void) => {
    resetCanvasRef.current = resetFn;
  }, []);

  // Khôi phục lớp sương để lau lại từ đầu
  const handleReset = useCallback(() => {
    setIsRevealed(false);
    setIsWipingStarted(false);
    setRevealProgress(0);
    if (resetCanvasRef.current) {
      resetCanvasRef.current();
    }
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-stone-900 select-none">
      
      {/* 1. KHUNG CẢNH NỀN PHÍA SAU LỚP SƯƠNG (Romantic Garden Background) */}
      <div className="absolute inset-0 z-0">
        <img
          src={gardenBg}
          alt="Romantic Garden with morning light and pastel flowers"
          className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.02] transform scale-105 transition-transform duration-[10000ms] ease-out animate-pulseGlow"
        />
        {/* Soft Ambient Pastel Overlay for dreamy atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-rose-200/30 via-pink-100/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. CÁNH HOA BAY CHẬM (Floating Blossom & Rose Petals) */}
      <FloatingPetals isRevealed={isRevealed} />

      {/* 3. NÚT ĐIỀU KHIỂN ÂM THANH */}
      <MusicController />

      {/* 4. KHU VỰC THIỆP CHÚC MỪNG ẨN PHÍA SAU */}
      <div className="relative z-20 w-full max-h-full overflow-y-auto py-8 flex flex-col items-center justify-center">
        
        {/* Dòng chữ chúc mừng nhỏ khi hoàn tất */}
        <CelebrationBadge
          message={config.revealedMessage}
          isVisible={isRevealed}
        />

        {/* Tấm thiệp chúc mừng chính */}
        <GreetingCard
          config={config}
          isRevealed={isRevealed}
          revealProgress={revealProgress}
          onReset={handleReset}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />
      </div>

      {/* 5. MÀN HÌNH MỞ ĐẦU HƯỚNG DẪN */}
      <IntroGuide isVisible={!isWipingStarted && !isRevealed} />

      {/* 6. HIỆU ỨNG SƯƠNG MÙ TƯƠNG TÁC (Canvas Lau Sương) */}
      <MistyCanvas
        revealThreshold={config.mistSettings.revealThreshold}
        brushRadius={config.mistSettings.brushSize}
        onFirstWipe={handleFirstWipe}
        onRevealProgress={handleRevealProgress}
        onRevealComplete={handleRevealComplete}
        onResetReady={handleResetReady}
      />

      {/* 7. MODAL TÙY CHỈNH LỜI CHÚC & NGƯỜI NHẬN */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSave={(newCfg) => setConfig(newCfg)}
        onResetToDefault={() => setConfig(defaultCardConfig)}
      />

    </main>
  );
}

export default App;
