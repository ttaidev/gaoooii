import React, { useEffect, useRef, useCallback, useState } from 'react';
import { audioManager } from '../utils/audio';

interface MistyCanvasProps {
  revealThreshold?: number; // e.g. 0.70
  brushRadius?: number;     // e.g. 50
  onFirstWipe?: () => void;
  onRevealProgress?: (progress: number) => void;
  onRevealComplete?: () => void;
  onResetReady?: (resetFn: () => void) => void;
}

export const MistyCanvas: React.FC<MistyCanvasProps> = ({
  revealThreshold = 0.70,
  brushRadius = 55,
  onFirstWipe,
  onRevealProgress,
  onRevealComplete,
  onResetReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasStartedWipingRef = useRef(false);
  const hasTriggeredCompleteRef = useRef(false);
  const lastCheckTimeRef = useRef(0);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [isFullyDissolved, setIsFullyDissolved] = useState(false);

  // Buffer brush mềm mại (offscreen canvas tạo radial gradient brush)
  const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tạo cọ lau hình tròn mềm (feathered edge)
  const getBrush = useCallback((radius: number) => {
    if (!brushCanvasRef.current) {
      const brush = document.createElement('canvas');
      brush.width = radius * 2;
      brush.height = radius * 2;
      const bCtx = brush.getContext('2d');
      if (bCtx) {
        const gradient = bCtx.createRadialGradient(
          radius, radius, 0,
          radius, radius, radius
        );
        // Tâm xóa 100%, mép mờ dần ra 0%
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.9)');
        gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        bCtx.fillStyle = gradient;
        bCtx.beginPath();
        bCtx.arc(radius, radius, radius, 0, Math.PI * 2);
        bCtx.fill();
      }
      brushCanvasRef.current = brush;
    }
    return brushCanvasRef.current;
  }, []);

  // Vẽ kết cấu lớp sương mù chân thực phủ lên canvas
  const renderMistyLayer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Lớp phủ sương mờ trắng ngà pha chút hồng phấn pastel ấm
    const mistGradient = ctx.createLinearGradient(0, 0, width, height);
    mistGradient.addColorStop(0, 'rgba(253, 248, 250, 0.96)');
    mistGradient.addColorStop(0.35, 'rgba(247, 240, 246, 0.94)');
    mistGradient.addColorStop(0.7, 'rgba(250, 245, 248, 0.95)');
    mistGradient.addColorStop(1, 'rgba(242, 236, 245, 0.96)');

    ctx.fillStyle = mistGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Thêm các đốm hạt sương ngưng tụ li ti (condensation droplets)
    const dropletCount = Math.floor((width * height) / 3800);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    for (let i = 0; i < dropletCount; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rSize = 0.8 + Math.random() * 2.2;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Vài vệt sương mờ lớn mềm mại tạo chiều sâu thị giác (steamy cloud patches)
    for (let i = 0; i < 7; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const pRadius = 100 + Math.random() * 220;
      const pGrad = ctx.createRadialGradient(px, py, 0, px, py, pRadius);
      pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(px, py, pRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Ánh sáng nhẹ ở góc tạo cảm giác kính phản chiếu
    const lightGrad = ctx.createLinearGradient(0, 0, width * 0.4, height * 0.4);
    lightGrad.addColorStop(0, 'rgba(255, 250, 240, 0.3)');
    lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = lightGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();

    // Chuẩn bị brush cho kích thước hiện tại
    brushCanvasRef.current = null;
    getBrush(brushRadius * dpr);

    hasStartedWipingRef.current = false;
    hasTriggeredCompleteRef.current = false;
    setCanvasOpacity(1);
    setIsFullyDissolved(false);
  }, [brushRadius, getBrush]);

  // Điều chỉnh kích thước canvas theo DPR màn hình
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = Math.floor(displayWidth * dpr);
    canvas.height = Math.floor(displayHeight * dpr);
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    renderMistyLayer();
  }, [renderMistyLayer]);

  // Thiết lập ban đầu và lắng nghe resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, [resizeCanvas]);

  // Cung cấp hàm Reset cho component cha
  useEffect(() => {
    if (onResetReady) {
      onResetReady(() => {
        renderMistyLayer();
      });
    }
  }, [onResetReady, renderMistyLayer]);

  // Xóa sương tại 1 điểm bằng cọ mềm
  const wipeAtPoint = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const brush = getBrush(brushRadius * dpr);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const drawX = x * dpr - brush.width / 2;
    const drawY = y * dpr - brush.height / 2;
    ctx.drawImage(brush, drawX, drawY);
    ctx.restore();
  }, [brushRadius, getBrush]);

  // Nối đường vẽ giữa 2 điểm (Interpolation) để không bị đứt đoạn khi di chuyển nhanh
  const wipeBetweenPoints = useCallback((
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) => {
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const stepSize = Math.max(3, brushRadius * 0.2); // Khoảng cách nhỏ giữa các stamp
    const steps = Math.ceil(dist / stepSize);

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const curX = p1.x + (p2.x - p1.x) * t;
      const curY = p1.y + (p2.y - p1.y) * t;
      wipeAtPoint(curX, curY);
    }
  }, [brushRadius, wipeAtPoint]);

  // Tính toán tỷ lệ diện tích đã được lau một cách tối ưu hiệu năng
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredCompleteRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Lấy mẫu theo lưới 40x40 điểm đại diện (1600 điểm kiểm tra)
    const sampleCols = 40;
    const sampleRows = 40;
    const stepX = Math.floor(canvas.width / sampleCols);
    const stepY = Math.floor(canvas.height / sampleRows);

    let clearedSamples = 0;
    const totalSamples = sampleCols * sampleRows;

    try {
      // Chỉ đọc 1 pixel tại mỗi điểm mẫu
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let r = 0; r < sampleRows; r++) {
        for (let c = 0; c < sampleCols; c++) {
          const px = c * stepX;
          const py = r * stepY;
          const index = (py * canvas.width + px) * 4;
          const alpha = data[index + 3]; // Kênh Alpha: 0 = trong suốt (đã lau)

          if (alpha < 60) {
            clearedSamples++;
          }
        }
      }

      const ratio = clearedSamples / totalSamples;
      if (onRevealProgress) {
        onRevealProgress(ratio);
      }

      // Khi đạt ngưỡng (khoảng 70%), kích hoạt tự tan phần còn lại
      if (ratio >= revealThreshold && !hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        dissolveRemainingMist();
      }
    } catch {
      // Fallback nếu getImageData bị hạn chế
    }
  }, [revealThreshold, onRevealProgress]);

  // Hiệu ứng sương mù tự tan biến mượt mà khi người dùng lau đủ diện tích
  const dissolveRemainingMist = useCallback(() => {
    // Kích hoạt callback chúc mừng
    if (onRevealComplete) {
      onRevealComplete();
    }

    // Làm mờ dần canvas trong 1.2s
    let start: number | null = null;
    const duration = 1200;

    const fadeStep = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);

      // Easing cubic out
      const ease = 1 - Math.pow(1 - progress, 3);
      setCanvasOpacity(1 - ease);

      if (progress < 1) {
        requestAnimationFrame(fadeStep);
      } else {
        setCanvasOpacity(0);
        setIsFullyDissolved(true);
      }
    };

    requestAnimationFrame(fadeStep);
  }, [onRevealComplete]);

  // Pointer Event Handlers (Hỗ trợ Touch, Mouse, Stylus hoàn hảo)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isFullyDissolved) return;

    // Chỉ nhận pointer chính
    if (!e.isPrimary) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    // Bắt con trỏ để kéo không bị trượt ra ngoài
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Bỏ qua nếu trình duyệt không hỗ trợ
    }

    if (!hasStartedWipingRef.current) {
      hasStartedWipingRef.current = true;
      if (onFirstWipe) onFirstWipe();
    }

    wipeAtPoint(x, y);
    audioManager.playWipeSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isFullyDissolved) return;
    if (!e.isPrimary) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastPointRef.current) {
      wipeBetweenPoints(lastPointRef.current, { x, y });
    } else {
      wipeAtPoint(x, y);
    }

    lastPointRef.current = { x, y };
    audioManager.playWipeSound();

    // Throttled kiểm tra tiến độ lau mỗi 200ms
    const now = performance.now();
    if (now - lastCheckTimeRef.current > 200) {
      lastCheckTimeRef.current = now;
      checkScratchPercentage();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Bỏ qua
    }

    // Kiểm tra tỷ lệ ngay khi nhấc tay/chuột
    checkScratchPercentage();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handlePointerUp(e);
  };

  return (
    <div
      className={`fixed inset-0 z-30 transition-opacity duration-300 ${
        isFullyDissolved ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        opacity: canvasOpacity,
        visibility: isFullyDissolved ? 'hidden' : 'visible',
      }}
    >
      <canvas
        ref={canvasRef}
        id="misty-reveal-canvas"
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      />
    </div>
  );
};
