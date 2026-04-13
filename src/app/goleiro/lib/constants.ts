// ─── Difficulty Configuration ───────────────────────────────────────────────

export interface DifficultyConfig {
  label: string;
  description: string;
  ballSpeed: number;
  speedIncrement: number;
  totalShots: number;
  showArrow: boolean;
  arrowDuration: number;
  hitboxMargin: number;
  countdownDuration: number;
  curveChance: number;
  curveAmount: number;
  defenseThreshold: number;
  color: string;
}

export const DIFFICULTIES: Record<string, DifficultyConfig> = {
  FACIL: {
    label: 'FACIL',
    description: 'Bola lenta, mostra para onde vai',
    ballSpeed: 0.30,
    speedIncrement: 0.005,
    totalShots: 10,
    showArrow: true,
    arrowDuration: 999,
    hitboxMargin: 0.02,
    countdownDuration: 2.0,
    curveChance: 0.0,
    curveAmount: 0.0,
    defenseThreshold: 0.88,
    color: '#50c850',
  },
  MEDIO: {
    label: 'MEDIO',
    description: 'Bola media com curva leve',
    ballSpeed: 0.50,
    speedIncrement: 0.01,
    totalShots: 10,
    showArrow: true,
    arrowDuration: 0.4,
    hitboxMargin: 0.015,
    countdownDuration: 1.3,
    curveChance: 0.6,
    curveAmount: 0.12,
    defenseThreshold: 0.90,
    color: '#dcc828',
  },
  DIFICIL: {
    label: 'DIFICIL',
    description: '5o ao 8o ano - Rapida com curva',
    ballSpeed: 0.70,
    speedIncrement: 0.015,
    totalShots: 10,
    showArrow: false,
    arrowDuration: 0,
    hitboxMargin: 0.01,
    countdownDuration: 1.0,
    curveChance: 0.75,
    curveAmount: 0.18,
    defenseThreshold: 0.92,
    color: '#dc6428',
  },
  IMPOSSIVEL: {
    label: 'IMPOSSIVEL',
    description: 'Muito rapida, curva forte!',
    ballSpeed: 0.90,
    speedIncrement: 0.02,
    totalShots: 10,
    showArrow: false,
    arrowDuration: 0,
    hitboxMargin: 0.005,
    countdownDuration: 0.7,
    curveChance: 0.9,
    curveAmount: 0.25,
    defenseThreshold: 0.94,
    color: '#dc1e1e',
  },
};

export const DIFFICULTY_ORDER = ['FACIL', 'MEDIO', 'DIFICIL', 'IMPOSSIVEL'] as const;

export type DifficultyKey = (typeof DIFFICULTY_ORDER)[number];

// ─── Kick Origins & Shot Zones ──────────────────────────────────────────────

// Ball starts from kicker's foot (center of field where the player sprite is)
export const KICK_ORIGINS: [number, number][] = [
  [0.50, 0.85], [0.48, 0.85], [0.52, 0.85],
  [0.47, 0.83], [0.53, 0.83],
];

export const SHOT_ZONES: Record<string, [number, number]> = {
  canto_sup_esq: [0.15, 0.12],
  canto_sup_dir: [0.85, 0.12],
  canto_inf_esq: [0.15, 0.75],
  canto_inf_dir: [0.85, 0.75],
  centro_sup:    [0.50, 0.15],
  centro_inf:    [0.50, 0.70],
  meio_esq:      [0.22, 0.45],
  meio_dir:      [0.78, 0.45],
  centro:        [0.50, 0.45],
};

export const ZONE_KEYS = Object.keys(SHOT_ZONES);

// ─── Game States ────────────────────────────────────────────────────────────

export const STATE = {
  MENU: 0,
  SELECT: 1,
  COUNTDOWN: 2,
  PLAYING: 3,
  RESULT: 4,
  GAME_OVER: 5,
} as const;

export type GameState = (typeof STATE)[keyof typeof STATE];

// ─── Goal area (percentage of canvas) ───────────────────────────────────────

export const GOL = { xPct: 0.10, yPct: 0.06, wPct: 0.80, hPct: 0.78 };

// ─── Hand data from tracker ─────────────────────────────────────────────────

export interface HandData {
  center: [number, number];
  bbox: [number, number, number, number];
  angle: number;
  side: 'DIREITA' | 'ESQUERDA' | '?';
}

// ─── Difficulty card display data ───────────────────────────────────────────

export interface DiffCardData {
  key: DifficultyKey;
  emoji: string;
  bg: string;
  tags: string[];
}

export const DIFF_CARDS: DiffCardData[] = [
  { key: 'FACIL', emoji: '\u{1F7E2}', bg: 'linear-gradient(135deg, #2d8a4e, #1a5c32)', tags: ['Lenta', 'Mostra alvo'] },
  { key: 'MEDIO', emoji: '\u{1F7E1}', bg: 'linear-gradient(135deg, #b8960f, #8a6d00)', tags: ['Media', 'Curva 60%', 'Seta rapida'] },
  { key: 'DIFICIL', emoji: '\u{1F7E0}', bg: 'linear-gradient(135deg, #c4521a, #8a3510)', tags: ['Rapida', 'Curva 75%', 'Sem dica'] },
  { key: 'IMPOSSIVEL', emoji: '\u{1F534}', bg: 'linear-gradient(135deg, #b81c1c, #7a1010)', tags: ['Muito rapida', 'Curva 90%', 'Sem dica'] },
];
