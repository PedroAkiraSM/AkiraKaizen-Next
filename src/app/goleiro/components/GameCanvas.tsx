'use client';

import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { GOL, STATE, type HandData } from '../lib/constants';
import type { Game } from '../lib/game';

interface GameAssets {
  fundo: HTMLImageElement | null;
  bola: HTMLImageElement | null;
  luvaDir: HTMLImageElement | null;
  luvaEsq: HTMLImageElement | null;
}

export interface GameCanvasHandle {
  canvas: HTMLCanvasElement | null;
  draw: (game: Game, hands: HandData[], now: number) => void;
}

interface GameCanvasProps {
  assets: GameAssets;
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(({ assets }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Resize canvas to viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const draw = useCallback((game: Game, hands: HandData[], now: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (game.state < STATE.COUNTDOWN) return;

    // Background
    if (assets.fundo) {
      ctx.drawImage(assets.fundo, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#1a6b1a';
      ctx.fillRect(0, 0, w, h);
    }

    const golX = w * GOL.xPct;
    const golY = h * GOL.yPct;
    const golW = w * GOL.wPct;
    const golH = h * GOL.hPct;

    // Ball is now rendered in 3D via Ball3D component
    // Only draw the arrow/target indicator here
    const ball = game.ball;
    if (ball && ball.active && game.shouldShowArrow() && ball.progress < 0.5) {
      const tx = golX + ball.targetX * golW;
      const ty = golY + ball.targetY * golH;
      const alpha = Math.max(0, 1 - ball.progress / 0.5);
      const pulse = 30 + 10 * Math.sin(now / 1000 * 8);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tx, ty, pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx - 15, ty);
      ctx.lineTo(tx + 15, ty);
      ctx.moveTo(tx, ty - 15);
      ctx.lineTo(tx, ty + 15);
      ctx.stroke();
      ctx.restore();
    }

    // Gloves
    const gloveH = Math.min(w, h) * 0.15;
    for (const hand of hands) {
      const [hcx, hcy] = hand.center;
      const gx = golX + hcx * golW;
      const gy = golY + hcy * golH;
      const img = hand.side === 'DIREITA' ? assets.luvaDir : assets.luvaEsq;
      if (!img) continue;
      const ratio = gloveH / img.naturalHeight;
      const gloveW = img.naturalWidth * ratio;
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate((hand.angle * Math.PI) / 180);
      ctx.drawImage(img, -gloveW / 2, -gloveH / 2, gloveW, gloveH);
      ctx.restore();
    }
  }, [assets]);

  useImperativeHandle(ref, () => ({
    canvas: canvasRef.current,
    draw,
  }), [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-screen h-screen"
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
