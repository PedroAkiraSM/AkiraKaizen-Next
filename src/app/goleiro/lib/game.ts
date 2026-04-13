import {
  type DifficultyConfig,
  type DifficultyKey,
  type GameState,
  type HandData,
  DIFFICULTIES,
  KICK_ORIGINS,
  SHOT_ZONES,
  ZONE_KEYS,
  STATE,
} from './constants';

// ─── Shot definition ────────────────────────────────────────────────────────

interface ShotDef {
  zone: string;
  speed: number;
  origin: [number, number];
  curveX: number;
  curveY: number;
}

// ─── Ball ───────────────────────────────────────────────────────────────────

export class Ball {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  speed: number;
  curveX: number;
  curveY: number;
  progress: number;
  active: boolean;
  defended: boolean;
  scored: boolean;
  birthTime: number;
  rotation: number;
  rotationSpeed: number;
  baseRadius: number;

  constructor(
    sx: number, sy: number,
    tx: number, ty: number,
    speed: number,
    curveX = 0, curveY = 0,
  ) {
    this.startX = sx;
    this.startY = sy;
    this.targetX = tx;
    this.targetY = ty;
    this.speed = speed;
    this.curveX = curveX;
    this.curveY = curveY;
    this.progress = 0;
    this.active = true;
    this.defended = false;
    this.scored = false;
    this.birthTime = performance.now() / 1000;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 400);
    this.baseRadius = 0.02;
  }

  get x(): number {
    const t = this.progress;
    const midX = (this.startX + this.targetX) / 2 + this.curveX;
    return (1 - t) ** 2 * this.startX + 2 * (1 - t) * t * midX + t ** 2 * this.targetX;
  }

  get y(): number {
    const t = this.progress;
    const midY = (this.startY + this.targetY) / 2 + this.curveY;
    return (1 - t) ** 2 * this.startY + 2 * (1 - t) * t * midY + t ** 2 * this.targetY;
  }

  get radius(): number {
    return this.baseRadius * (0.3 + this.progress * 2.5);
  }

  update(dt: number): void {
    if (!this.active) return;
    this.progress += this.speed * dt;
    this.rotation += this.rotationSpeed * dt;
    if (this.progress >= 1.0) {
      this.progress = 1.0;
      if (!this.defended) this.scored = true;
      this.active = false;
    }
  }

  checkDefense(hands: HandData[], margin = 0.01): boolean {
    if (!this.active || this.defended) return false;
    const bx = this.x;
    const by = this.y;
    const br = this.radius;

    for (const hand of hands) {
      let [hxMin, hyMin, hxMax, hyMax] = hand.bbox;
      hxMin -= margin;
      hyMin -= margin;
      hxMax += margin;
      hyMax += margin;

      const closestX = Math.max(hxMin, Math.min(bx, hxMax));
      const closestY = Math.max(hyMin, Math.min(by, hyMax));
      const dist = Math.sqrt((bx - closestX) ** 2 + (by - closestY) ** 2);

      if (dist <= br) {
        this.defended = true;
        this.active = false;
        return true;
      }
    }
    return false;
  }
}

// ─── Game ───────────────────────────────────────────────────────────────────

export interface GameSnapshot {
  state: GameState;
  difficulty: DifficultyKey;
  config: DifficultyConfig;
  totalShots: number;
  shotsTaken: number;
  defesas: number;
  gols: number;
  ball: Ball | null;
  lastResult: string;
  resultStart: number;
  resultDuration: number;
}

export class Game {
  state: GameState;
  difficulty: DifficultyKey;
  config: DifficultyConfig;
  totalShots: number;
  shotsTaken: number;
  defesas: number;
  gols: number;
  ball: Ball | null;
  countdownStart: number;
  resultStart: number;
  resultDuration: number;
  lastResult: string;
  prevState: GameState;

  private shotSequence: ShotDef[];

  constructor() {
    this.state = STATE.MENU;
    this.difficulty = 'MEDIO';
    this.config = DIFFICULTIES.MEDIO;
    this.totalShots = 10;
    this.shotsTaken = 0;
    this.defesas = 0;
    this.gols = 0;
    this.ball = null;
    this.countdownStart = 0;
    this.resultStart = 0;
    this.resultDuration = 1.5;
    this.lastResult = '';
    this.shotSequence = [];
    this.prevState = STATE.MENU;
  }

  setDifficulty(key: DifficultyKey): void {
    this.difficulty = key;
    this.config = DIFFICULTIES[key];
    this.totalShots = this.config.totalShots;
  }

  reset(): void {
    this.state = STATE.COUNTDOWN;
    this.shotsTaken = 0;
    this.defesas = 0;
    this.gols = 0;
    this.ball = null;
    this.lastResult = '';
    this.totalShots = this.config.totalShots;
    this._generateShots();
    this._startCountdown();
  }

  private _generateShots(): void {
    this.shotSequence = [];
    const cfg = this.config;
    let lastZone: string | null = null;

    for (let i = 0; i < this.totalShots; i++) {
      const available = ZONE_KEYS.filter(z => z !== lastZone);
      const zone = available[Math.floor(Math.random() * available.length)];
      lastZone = zone;
      const speed = cfg.ballSpeed + i * cfg.speedIncrement;
      const origin = KICK_ORIGINS[Math.floor(Math.random() * KICK_ORIGINS.length)];
      let curveX = 0;
      let curveY = 0;
      if (Math.random() < cfg.curveChance) {
        curveX = (Math.random() * 2 - 1) * cfg.curveAmount;
        curveY = (Math.random() * 2 - 1) * cfg.curveAmount;
      }
      this.shotSequence.push({ zone, speed, origin, curveX, curveY });
    }
  }

  private _startCountdown(): void {
    this.state = STATE.COUNTDOWN;
    this.countdownStart = performance.now() / 1000;
  }

  private _launchBall(): void {
    if (this.shotsTaken >= this.totalShots) {
      this.state = STATE.GAME_OVER;
      return;
    }
    const shot = this.shotSequence[this.shotsTaken];
    let [tx, ty] = SHOT_ZONES[shot.zone];
    tx += (Math.random() - 0.5) * 0.06;
    ty += (Math.random() - 0.5) * 0.06;
    tx = Math.max(0.10, Math.min(0.90, tx));
    ty = Math.max(0.08, Math.min(0.80, ty));

    const [sx, sy] = shot.origin;
    this.ball = new Ball(sx, sy, tx, ty, shot.speed, shot.curveX, shot.curveY);
    this.state = STATE.PLAYING;
  }

  private _showResult(text: string): void {
    this.lastResult = text;
    this.resultStart = performance.now() / 1000;
    this.state = STATE.RESULT;
    this.shotsTaken++;
  }

  update(dt: number, hands: HandData[]): void {
    this.prevState = this.state;
    const cfg = this.config;
    const now = performance.now() / 1000;

    if (this.state === STATE.COUNTDOWN) {
      if (now - this.countdownStart >= cfg.countdownDuration) {
        this._launchBall();
      }
    } else if (this.state === STATE.PLAYING) {
      if (this.ball) {
        this.ball.update(dt);
        if (this.ball.progress >= cfg.defenseThreshold) {
          if (this.ball.checkDefense(hands, cfg.hitboxMargin)) {
            this.defesas++;
            this._showResult('DEFENDEU!');
            return;
          }
        }
        if (!this.ball.active && this.ball.scored) {
          this.gols++;
          this._showResult('GOL!');
        }
      }
    } else if (this.state === STATE.RESULT) {
      if (now - this.resultStart >= this.resultDuration) {
        if (this.shotsTaken >= this.totalShots) {
          this.state = STATE.GAME_OVER;
        } else {
          this._startCountdown();
        }
      }
    }
  }

  getCountdownNumber(): number {
    if (this.state !== STATE.COUNTDOWN) return 0;
    const elapsed = performance.now() / 1000 - this.countdownStart;
    const remaining = this.config.countdownDuration - elapsed;
    if (remaining <= 0) return 0;
    return Math.floor(remaining) + 1;
  }

  shouldShowArrow(): boolean {
    if (!this.config.showArrow || !this.ball) return false;
    const elapsed = performance.now() / 1000 - this.ball.birthTime;
    return elapsed < this.config.arrowDuration;
  }

  getRating(): string {
    const perc = (this.defesas / this.totalShots) * 100;
    if (perc >= 80) return 'GOLEIRO CRAQUE!';
    if (perc >= 60) return 'Otima defesa!';
    if (perc >= 40) return 'Boa tentativa!';
    if (perc >= 20) return 'Precisa treinar mais!';
    return 'O gol ficou aberto!';
  }

  getSnapshot(): GameSnapshot {
    return {
      state: this.state,
      difficulty: this.difficulty,
      config: this.config,
      totalShots: this.totalShots,
      shotsTaken: this.shotsTaken,
      defesas: this.defesas,
      gols: this.gols,
      ball: this.ball,
      lastResult: this.lastResult,
      resultStart: this.resultStart,
      resultDuration: this.resultDuration,
    };
  }
}
