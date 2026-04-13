'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Game } from './lib/game';
import { SoundManager } from './lib/sounds';
import { STATE, type DifficultyKey, type HandData } from './lib/constants';
import { useHandTracking } from './hooks/useHandTracking';
import { useGameLoop } from './hooks/useGameLoop';
import MenuScreen from './components/MenuScreen';
import SelectScreen from './components/SelectScreen';
import GameOverScreen from './components/GameOverScreen';
import HUD from './components/HUD';
import CountdownDisplay from './components/CountdownDisplay';
import ResultDisplay from './components/ResultDisplay';
import GameCanvas, { type GameCanvasHandle } from './components/GameCanvas';

// ─── Asset loader ───────────────────────────────────────────────────────────

interface GameAssets {
  fundo: HTMLImageElement | null;
  bola: HTMLImageElement | null;
  luvaDir: HTMLImageElement | null;
  luvaEsq: HTMLImageElement | null;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ─── Screen type ────────────────────────────────────────────────────────────

type Screen = 'menu' | 'select' | 'game' | 'gameover';

// ─── Page Component ─────────────────────────────────────────────────────────

export default function GoleiroPage() {
  // Refs for mutable game objects (no re-renders needed)
  const gameRef = useRef<Game | null>(null);
  const soundRef = useRef<SoundManager | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasHandleRef = useRef<GameCanvasHandle>(null);
  const handsRef = useRef<HandData[]>([]);
  const cameraStartedRef = useRef(false);
  const lastCountdownRef = useRef(0);
  const lastUIUpdateRef = useRef(0);

  // React state for UI (screens, HUD, overlays)
  const [screen, setScreen] = useState<Screen>('menu');
  const [assets, setAssets] = useState<GameAssets>({
    fundo: null, bola: null, luvaDir: null, luvaEsq: null,
  });
  const [hudData, setHudData] = useState({
    defesas: 0, gols: 0, shotsTaken: 0, totalShots: 10,
  });
  const [countdownNum, setCountdownNum] = useState(0);
  const [resultData, setResultData] = useState({
    state: STATE.MENU as number,
    lastResult: '',
    resultStart: 0,
    resultDuration: 1.5,
  });
  const [gameOverData, setGameOverData] = useState({
    defesas: 0, gols: 0, rating: '',
  });
  const [currentConfig, setCurrentConfig] = useState(
    () => ({ label: 'MEDIO', color: '#dcc828', description: '', ballSpeed: 0.5, speedIncrement: 0.01, totalShots: 10, showArrow: true, arrowDuration: 0.4, hitboxMargin: 0.015, countdownDuration: 1.3, curveChance: 0.6, curveAmount: 0.12, defenseThreshold: 0.90 })
  );

  const tracker = useHandTracking(videoRef);

  // ─── Load assets on mount ───────────────────────────────────────────────

  useEffect(() => {
    const game = new Game();
    const sound = new SoundManager();
    gameRef.current = game;
    soundRef.current = sound;

    Promise.all([
      loadImage('/assets/goleiro/FundoGoleirPOV.png'),
      loadImage('/assets/goleiro/Bola.png'),
      loadImage('/assets/goleiro/LuvaDireita.png'),
      loadImage('/assets/goleiro/LuvaEsquerda.png'),
    ]).then(([fundo, bola, luvaDir, luvaEsq]) => {
      setAssets({ fundo, bola, luvaDir, luvaEsq });
    });
  }, []);

  // ─── Camera ─────────────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    if (cameraStartedRef.current) return;
    cameraStartedRef.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        await tracker.init();
      }
    } catch (e) {
      console.error('Camera error:', e);
    }
  }, [tracker]);

  // ─── Game loop callback ─────────────────────────────────────────────────

  const onFrame = useCallback((dt: number, now: number) => {
    const game = gameRef.current;
    const sound = soundRef.current;
    if (!game || !sound) return;

    // Update hand tracking
    if (tracker.readyRef.current) {
      handsRef.current = tracker.update();
    }

    const prevResult = game.lastResult;
    const prevState = game.state;

    game.update(dt, handsRef.current);

    // Sound effects
    if (game.lastResult !== prevResult && game.lastResult) {
      if (game.lastResult.includes('DEFENDEU')) {
        sound.playSave();
        setTimeout(() => sound.playCrowdCheer(), 150);
      } else if (game.lastResult.includes('GOL')) {
        sound.playCrowdBoo();
      }
    }

    if (game.state === STATE.PLAYING && prevState === STATE.COUNTDOWN) {
      sound.playKick();
    }

    const countNum = game.getCountdownNumber();
    if (countNum !== lastCountdownRef.current && countNum > 0) {
      sound.playCountdown();
    }
    lastCountdownRef.current = countNum;

    // Game over transition
    if (game.state === STATE.GAME_OVER && prevState !== STATE.GAME_OVER) {
      setScreen('gameover');
      setGameOverData({
        defesas: game.defesas,
        gols: game.gols,
        rating: game.getRating(),
      });
      setCurrentConfig({ ...game.config });
    }

    // Draw canvas (every frame - no React overhead)
    canvasHandleRef.current?.draw(game, handsRef.current, now);

    // Throttle React state updates to ~20fps (every 50ms) to avoid re-render churn.
    // Countdown and result changes are always immediate for responsiveness.
    const shouldForceUpdate =
      countNum !== lastUIUpdateRef.current ||
      game.state !== resultData.state;

    if (shouldForceUpdate || now - lastUIUpdateRef.current > 50) {
      lastUIUpdateRef.current = now;
      setCountdownNum(countNum);
      setResultData({
        state: game.state,
        lastResult: game.lastResult,
        resultStart: game.resultStart,
        resultDuration: game.resultDuration,
      });
      setHudData({
        defesas: game.defesas,
        gols: game.gols,
        shotsTaken: game.shotsTaken,
        totalShots: game.totalShots,
      });
    }
  }, [tracker, resultData.state]);

  const { start: startLoop } = useGameLoop(onFrame);

  // Start the loop once on mount
  useEffect(() => {
    startLoop();
  }, [startLoop]);

  // ─── Navigation handlers ────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    soundRef.current?.init();
    startCamera();
    setScreen('select');
  }, [startCamera]);

  const handleSelectDifficulty = useCallback((key: DifficultyKey) => {
    const game = gameRef.current;
    const sound = soundRef.current;
    if (!game || !sound) return;

    sound.init();
    sound.playSelect();
    game.setDifficulty(key);
    game.reset();
    setCurrentConfig({ ...game.config });
    setScreen('game');
    sound.playWhistle();
  }, []);

  const handleBack = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleReplay = useCallback(() => {
    setScreen('select');
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hidden video element for camera feed */}
      <video ref={videoRef} autoPlay playsInline className="hidden" />

      {/* Game canvas */}
      <GameCanvas ref={canvasHandleRef} assets={assets} />

      {/* HUD overlay */}
      <HUD
        visible={screen === 'game'}
        config={currentConfig}
        defesas={hudData.defesas}
        gols={hudData.gols}
        shotsTaken={hudData.shotsTaken}
        totalShots={hudData.totalShots}
      />

      {/* Countdown number */}
      <CountdownDisplay number={countdownNum} />

      {/* Result text (DEFENDEU! / GOL!) */}
      <ResultDisplay
        state={resultData.state as typeof STATE[keyof typeof STATE]}
        lastResult={resultData.lastResult}
        resultStart={resultData.resultStart}
        resultDuration={resultData.resultDuration}
      />

      {/* Screen overlays */}
      <MenuScreen visible={screen === 'menu'} onStart={handleStart} />
      <SelectScreen
        visible={screen === 'select'}
        onSelect={handleSelectDifficulty}
        onBack={handleBack}
      />
      <GameOverScreen
        visible={screen === 'gameover'}
        config={currentConfig}
        defesas={gameOverData.defesas}
        gols={gameOverData.gols}
        rating={gameOverData.rating}
        onReplay={handleReplay}
      />
    </>
  );
}
