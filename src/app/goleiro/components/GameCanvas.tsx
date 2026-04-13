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
  // Two canvases: background (z:0) and gloves overlay (z:3, above Ball3D at z:1)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const gloveCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const gloveCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const resize = () => {
      for (const canvasRef of [bgCanvasRef, gloveCanvasRef]) {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      }
      if (bgCanvasRef.current) bgCtxRef.current = bgCanvasRef.current.getContext('2d');
      if (gloveCanvasRef.current) gloveCtxRef.current = gloveCanvasRef.current.getContext('2d');
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const draw = useCallback((game: Game, hands: HandData[], now: number) => {
    const bgCanvas = bgCanvasRef.current;
    const gloveCanvas = gloveCanvasRef.current;
    const bgCtx = bgCtxRef.current;
    const gloveCtx = gloveCtxRef.current;
    if (!bgCanvas || !gloveCanvas || !bgCtx || !gloveCtx) return;

    const w = bgCanvas.width;
    const h = bgCanvas.height;

    // === BACKGROUND CANVAS (z:0) — field + arrow indicator ===
    bgCtx.clearRect(0, 0, w, h);

    if (game.state < STATE.COUNTDOWN) return;

    if (assets.fundo) {
      bgCtx.drawImage(assets.fundo, 0, 0, w, h);
    } else {
      bgCtx.fillStyle = '#1a6b1a';
      bgCtx.fillRect(0, 0, w, h);
    }

    const golX = w * GOL.xPct;
    const golY = h * GOL.yPct;
    const golW = w * GOL.wPct;
    const golH = h * GOL.hPct;

    // Arrow/target indicator
    const ball = game.ball;
    if (ball && ball.active && game.shouldShowArrow() && ball.progress < 0.5) {
      const tx = golX + ball.targetX * golW;
      const ty = golY + ball.targetY * golH;
      const alpha = Math.max(0, 1 - ball.progress / 0.5);
      const pulse = 30 + 10 * Math.sin(now / 1000 * 8);
      bgCtx.save();
      bgCtx.globalAlpha = alpha;
      bgCtx.strokeStyle = '#ff4444';
      bgCtx.lineWidth = 3;
      bgCtx.beginPath();
      bgCtx.arc(tx, ty, pulse, 0, Math.PI * 2);
      bgCtx.stroke();
      bgCtx.beginPath();
      bgCtx.moveTo(tx - 15, ty);
      bgCtx.lineTo(tx + 15, ty);
      bgCtx.moveTo(tx, ty - 15);
      bgCtx.lineTo(tx, ty + 15);
      bgCtx.stroke();
      bgCtx.restore();
    }

    // === GLOVES CANVAS (z:3, transparent) — drawn on top of Ball3D ===
    gloveCtx.clearRect(0, 0, w, h);

    if (game.state < STATE.COUNTDOWN) return;

    const gloveH = Math.min(w, h) * 0.15;
    for (const hand of hands) {
      const [hcx, hcy] = hand.center;
      const gx = golX + hcx * golW;
      const gy = golY + hcy * golH;
      const img = hand.side === 'DIREITA' ? assets.luvaDir : assets.luvaEsq;
      if (!img) continue;
      const ratio = gloveH / img.naturalHeight;
      const gloveW = img.naturalWidth * ratio;
      gloveCtx.save();
      gloveCtx.translate(gx, gy);
      gloveCtx.rotate((hand.angle * Math.PI) / 180);
      gloveCtx.drawImage(img, -gloveW / 2, -gloveH / 2, gloveW, gloveH);
      gloveCtx.restore();
    }
  }, [assets]);

  useImperativeHandle(ref, () => ({
    canvas: bgCanvasRef.current,
    draw,
  }), [draw]);

  return (
    <>
      {/* Background canvas — field, arrow (z:0, behind Ball3D) */}
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 block w-screen h-screen"
        style={{ zIndex: 0 }}
      />
      {/* Gloves canvas — transparent, on top of Ball3D (z:3) */}
      <canvas
        ref={gloveCanvasRef}
        className="fixed inset-0 block w-screen h-screen pointer-events-none"
        style={{ zIndex: 3 }}
      />
    </>
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
