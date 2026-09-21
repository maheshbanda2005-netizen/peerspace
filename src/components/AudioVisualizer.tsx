import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color?: string;
  barsCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  color = '#8B5CF6',
  barsCount = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / barsCount - 3;

      for (let i = 0; i < barsCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          // Dynamic wave formula simulating frequencies
          const sinVal = Math.sin(phase + i * 0.45);
          const cosVal = Math.cos(phase * 1.5 + i * 0.2);
          const normalized = (sinVal + cosVal + 2) / 4;
          barHeight = Math.max(4, normalized * height * 0.85);
        }

        const x = i * (barWidth + 3);
        const y = (height - barHeight) / 2;

        // Gradient bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#3B82F6');

        ctx.fillStyle = isPlaying ? gradient : 'rgba(148, 163, 184, 0.25)';
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(2, barWidth), barHeight, [3, 3, 3, 3]);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, color, barsCount]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={32}
      className="w-36 h-7 rounded-lg"
    />
  );
};
