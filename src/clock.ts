/**
 * Analog clock renderer using requestAnimationFrame for smooth, continuous
 * hand movement. All three hands interpolate sub-second positions so they
 * sweep rather than tick.
 */

export interface ClockTheme {
  background: string;
  faceBackground: string;
  faceStroke: string;
  tickMajor: string;
  tickMinor: string;
  numberColor: string;
  hourHand: string;
  minuteHand: string;
  secondHand: string;
  secondHandTail: string;
  pivot: string;
  centerDot: string;
  shadow: string;
}

export const defaultTheme: ClockTheme = {
  background: '#0f0f13',
  faceBackground: '#1a1a24',
  faceStroke: '#2a2a3a',
  tickMajor: '#e0e0f0',
  tickMinor: '#484860',
  numberColor: '#c0c0d8',
  hourHand: '#e0e0f0',
  minuteHand: '#b0b0cc',
  secondHand: '#ff4466',
  secondHandTail: '#ff4466',
  pivot: '#1a1a24',
  centerDot: '#ff4466',
  shadow: 'rgba(0, 0, 0, 0.6)',
};

interface HandSpec {
  /** Rotation angle in radians (0 = 12 o'clock, clockwise). */
  angle: number;
  length: number;
  tailLength: number;
  width: number;
  color: string;
  tailColor: string;
  /** Rounded cap on the tip */
  rounded: boolean;
}

export class AnalogClock {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private theme: ClockTheme;
  private rafId: number | null = null;
  private lastDrawnSecond = -1;
  private onTimeUpdate?: (timeStr: string) => void;

  constructor(
    canvas: HTMLCanvasElement,
    theme: ClockTheme = defaultTheme,
    onTimeUpdate?: (timeStr: string) => void,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.canvas = canvas;
    this.ctx = ctx;
    this.theme = theme;
    this.onTimeUpdate = onTimeUpdate;
  }

  /** Start the animation loop. Safe to call multiple times. */
  start(): void {
    if (this.rafId !== null) return;
    const loop = () => {
      this.draw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  /** Stop the animation loop and release the RAF handle. */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Resize the canvas to fill its CSS display size (call on window resize). */
  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.scale(dpr, dpr);
    // Force immediate redraw after resize
    this.draw();
  }

  // -------------------------------------------------------------------------
  // Private rendering helpers
  // -------------------------------------------------------------------------

  private draw(): void {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;   // 0–60, fractional
    const m = now.getMinutes() + s / 60;      // 0–60, fractional
    const h = (now.getHours() % 12) + m / 60; // 0–12, fractional

    const dpr = window.devicePixelRatio || 1;
    const size = this.canvas.width / dpr;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const { ctx } = this;
    ctx.clearRect(0, 0, size, size);

    this.drawFace(cx, cy, r);
    this.drawTicks(cx, cy, r);
    this.drawNumbers(cx, cy, r);

    // Hour hand: sweeps through 12 hours → 2π
    this.drawHand(cx, cy, {
      angle: (h / 12) * Math.PI * 2 - Math.PI / 2,
      length: r * 0.50,
      tailLength: r * 0.12,
      width: r * 0.045,
      color: this.theme.hourHand,
      tailColor: this.theme.hourHand,
      rounded: true,
    });

    // Minute hand: sweeps through 60 minutes → 2π
    this.drawHand(cx, cy, {
      angle: (m / 60) * Math.PI * 2 - Math.PI / 2,
      length: r * 0.72,
      tailLength: r * 0.14,
      width: r * 0.03,
      color: this.theme.minuteHand,
      tailColor: this.theme.minuteHand,
      rounded: true,
    });

    // Second hand: sweeps through 60 seconds → 2π (smooth, not tick-tick)
    this.drawHand(cx, cy, {
      angle: (s / 60) * Math.PI * 2 - Math.PI / 2,
      length: r * 0.82,
      tailLength: r * 0.22,
      width: r * 0.015,
      color: this.theme.secondHand,
      tailColor: this.theme.secondHandTail,
      rounded: false,
    });

    this.drawPivot(cx, cy, r);

    // Notify on each new second (avoids excessive string allocations)
    const wholeSec = now.getSeconds();
    if (wholeSec !== this.lastDrawnSecond) {
      this.lastDrawnSecond = wholeSec;
      this.onTimeUpdate?.(this.formatTime(now));
    }
  }

  private drawFace(cx: number, cy: number, r: number): void {
    const { ctx, theme } = this;

    // Outer glow / shadow
    ctx.save();
    ctx.shadowColor = theme.shadow;
    ctx.shadowBlur = r * 0.15;

    // Face background
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = theme.faceBackground;
    ctx.fill();

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.strokeStyle = theme.faceStroke;
    ctx.lineWidth = r * 0.025;
    ctx.stroke();
    ctx.restore();
  }

  private drawTicks(cx: number, cy: number, r: number): void {
    const { ctx, theme } = this;
    const faceR = r * 0.92;

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isMajor = i % 5 === 0;

      const outerR = faceR - r * 0.02;
      const innerR = isMajor ? outerR - r * 0.10 : outerR - r * 0.04;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + Math.PI / 2);

      ctx.beginPath();
      ctx.moveTo(0, -outerR);
      ctx.lineTo(0, -innerR);
      ctx.strokeStyle = isMajor ? theme.tickMajor : theme.tickMinor;
      ctx.lineWidth = isMajor ? r * 0.025 : r * 0.012;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawNumbers(cx: number, cy: number, r: number): void {
    const { ctx, theme } = this;
    const fontSize = r * 0.13;
    ctx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif`;
    ctx.fillStyle = theme.numberColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const numberR = r * 0.70;
    for (let i = 1; i <= 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * numberR;
      const y = cy + Math.sin(angle) * numberR;
      ctx.fillText(String(i), x, y);
    }
  }

  private drawHand(cx: number, cy: number, spec: HandSpec): void {
    const { ctx } = this;
    const { angle, length, tailLength, width, color, tailColor, rounded } = spec;

    const tipX = cx + Math.cos(angle) * length;
    const tipY = cy + Math.sin(angle) * length;
    const tailX = cx - Math.cos(angle) * tailLength;
    const tailY = cy - Math.sin(angle) * tailLength;

    ctx.save();
    ctx.lineCap = rounded ? 'round' : 'butt';
    ctx.lineJoin = 'round';

    // Draw tail segment (from center toward tail end)
    if (tailLength > 0) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = tailColor;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    // Draw main hand segment (from center toward tip)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
  }

  private drawPivot(cx: number, cy: number, r: number): void {
    const { ctx, theme } = this;

    // Outer cap (covers where hands meet)
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.04, 0, Math.PI * 2);
    ctx.fillStyle = theme.pivot;
    ctx.fill();

    // Center accent dot
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.022, 0, Math.PI * 2);
    ctx.fillStyle = theme.centerDot;
    ctx.fill();
  }

  private formatTime(date: Date): string {
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const pad = (n: number) => String(n).padStart(2, '0');
    const period = h < 12 ? 'AM' : 'PM';
    const h12 = h % 12 || 12;
    return `${pad(h12)}:${pad(m)}:${pad(s)} ${period}`;
  }
}
