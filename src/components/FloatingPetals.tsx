import React, { useEffect, useRef } from 'react';

interface FloatingPetalsProps {
  isRevealed: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  color: string;
  opacity: number;
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({ isRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Bảng màu cánh hoa hồng pastel lãng mạn
    const petalColors = [
      'rgba(255, 182, 193, 0.75)', // Light pink
      'rgba(255, 192, 203, 0.8)',  // Pink
      'rgba(255, 218, 224, 0.85)', // Pale blush
      'rgba(255, 160, 180, 0.7)',  // Rose
      'rgba(248, 200, 220, 0.75)', // Soft mauve
      'rgba(255, 240, 245, 0.85)', // Lavender blush
    ];

    const petalCount = isRevealed ? 45 : 22;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.5,
        size: 9 + Math.random() * 12,
        speedY: 0.8 + Math.random() * 1.6,
        speedX: -0.5 + Math.random() * 1.0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        oscillationSpeed: 0.01 + Math.random() * 0.02,
        oscillationDistance: 1 + Math.random() * 2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: 0.5 + Math.random() * 0.45,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(frame * p.oscillationSpeed) * p.oscillationDistance + p.speedX;
        p.rotation += p.rotationSpeed;

        // Reset khi bay xuống dưới đáy màn hình
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(Math.cos(frame * 0.02), 1); // 3D flip effect

        // Vẽ hình dáng cánh hoa mềm mại
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          p.size / 2, -p.size / 2,
          p.size, -p.size / 4,
          p.size, p.size / 2
        );
        ctx.bezierCurveTo(
          p.size / 2, p.size,
          0, p.size,
          0, 0
        );
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = 'rgba(255, 192, 203, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isRevealed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};
