import { useEffect, useRef } from 'react';
import type { Language } from '../types';
import { poseAt, STRIDE, type Point, type Pose } from './gait';

const COLORS = { trunk: '#ffffff', left: '#ff4d3d', right: '#2ec4a6' };
const STATEMENTS = {
  en: ['One camera.', 'No markers.', 'Movement, measured.'],
  it: ['Una camera.', 'Nessun marker.', 'Il movimento, misurato.'],
};
// Scroll windows (fraction of the scene) in which each statement is visible.
const WINDOWS: [number, number, number, number][] = [[0.18, 0.24, 0.36, 0.42], [0.44, 0.5, 0.6, 0.66], [0.7, 0.76, 2, 2]];
const GHOSTS = 8;
const GHOST_STEP = 0.125;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (v: number, a: number, b: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const windowed = (v: number, [a, b, c, d]: [number, number, number, number]) => Math.min(ramp(v, a, b), 1 - ramp(v, c, d));

function drawPose(ctx: CanvasRenderingContext2D, pose: Pose, origin: Point, size: number, bones: number, dots: number[], alpha: number, scale: number) {
  const at = (p: Point) => ({ x: origin.x + p.x * size, y: origin.y + p.y * size });
  const line = (a: Point, b: Point, color: string, a2: number) => {
    if (a2 <= 0) return;
    const A = at(a), B = at(b);
    ctx.globalAlpha = a2;
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
  };
  let i = 0;
  const dot = (p: Point, color: string, sideAlpha: number) => {
    const visible = (dots[i++] ?? 1) * alpha * sideAlpha;
    if (visible <= 0) return;
    const P = at(p);
    ctx.globalAlpha = visible;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(P.x, P.y, 3.2 * scale, 0, Math.PI * 2); ctx.fill();
  };
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = 'round';
  // The far (left) side is drawn first and slightly dimmer.
  (['left', 'right'] as const).forEach(side => {
    const l = pose.limbs[side];
    const color = COLORS[side];
    const s = side === 'left' ? 0.7 : 1;
    [[l.shoulder, l.elbow], [l.elbow, l.wrist], [l.hip, l.knee], [l.knee, l.ankle], [l.ankle, l.toe]].forEach(([a, b]) => line(a, b, color, bones * alpha * s));
  });
  line(pose.neck, pose.hip, COLORS.trunk, bones * alpha);
  line(pose.neck, pose.head, COLORS.trunk, bones * alpha);
  line(pose.head, pose.nose, COLORS.trunk, bones * alpha);
  dot(pose.nose, COLORS.trunk, 1); dot(pose.head, COLORS.trunk, 1); dot(pose.neck, COLORS.trunk, 1);
  (['left', 'right'] as const).forEach(side => {
    const l = pose.limbs[side];
    const s = side === 'left' ? 0.7 : 1;
    [l.shoulder, l.elbow, l.wrist, l.hip, l.knee, l.ankle, l.toe].forEach(p => dot(p, COLORS[side], s));
  });
  ctx.globalAlpha = 1;
}

interface HeroProps { name: string; role: string; tagline: string; lang: Language }

export default function Hero({ name, role, tagline, lang }: HeroProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statementRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const scene = sceneRef.current, canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!scene || !canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let frame = 0, visible = true, smooth = 0, width = 0, height = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    };

    const render = (now: number) => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const target = reduced ? 0.8 : clamp(-rect.top / travel);
      smooth += (target - smooth) * 0.14;
      if (Math.abs(target - smooth) < 0.0005) smooth = target;
      const p = smooth;
      const intro = reduced ? 1 : clamp((now - start) / 1600);

      // Text layers
      if (titleRef.current) {
        const out = reduced ? 0 : ramp(p, 0.08, 0.18);
        titleRef.current.style.opacity = String(1 - out);
        titleRef.current.style.transform = `translateY(${-out * 40}px)`;
      }
      statementRefs.current.forEach((el, i) => {
        if (!el) return;
        const o = reduced ? 0 : windowed(p, WINDOWS[i]);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 16}px)`;
      });

      // Figure
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const size = Math.min(height * 0.52, width * (width < 760 ? 0.8 : 0.62));
      const ground = height * 0.9;
      const trail = reduced ? 1 : ramp(p, 0.62, 0.82);
      const cx = width * 0.5 + trail * STRIDE * size * GHOST_STEP * GHOSTS * 0.5;
      const phase = 0.08 + (reduced ? 0.3 : ramp(p, 0.26, 1) * 2.25);
      // Bones join the keypoints right after they appear, so the figure never reads as loose dots.
      const bones = reduced ? 1 : ramp(intro, 0.45, 1);
      const scale = clamp(size / 380, 0.7, 1.4);

      ctx.globalAlpha = 0.14 + 0.1 * bones;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(width * 0.08, ground + 1, width * 0.84, 1);

      for (let g = GHOSTS; g >= 1; g--) {
        const a = trail * (0.5 - g * 0.05);
        if (a <= 0) continue;
        const ghostPhase = phase - g * GHOST_STEP;
        drawPose(ctx, poseAt(ghostPhase), { x: cx - g * GHOST_STEP * STRIDE * size, y: ground }, size, 1, [], a, scale * 0.85);
      }
      const dots = Array.from({ length: 17 }, (_, i) => ramp(intro, i * 0.04, i * 0.04 + 0.3));
      drawPose(ctx, poseAt(phase), { x: cx, y: ground }, size, bones, dots, 1, scale);

      if (visible && (intro < 1 || smooth !== target)) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(render); };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    io.observe(scene);
    const ro = new ResizeObserver(() => { resize(); schedule(); });
    ro.observe(canvas);
    resize(); schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    return () => { cancelAnimationFrame(frame); io.disconnect(); ro.disconnect(); window.removeEventListener('scroll', schedule); };
  }, []);

  // Statements are re-created on language change; repaint so they pick up the current scroll state.
  useEffect(() => { window.dispatchEvent(new Event('scroll')); }, [lang]);

  return (
    <section ref={sceneRef} id="home" className="hero" aria-labelledby="hero-name">
      <div className="hero-stage">
        <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
        <div ref={titleRef} className="hero-title">
          <h1 id="hero-name">{name}</h1>
          <p>{role}</p>
        </div>
        <p className="visually-hidden">{tagline}</p>
        {STATEMENTS[lang].map((text, i) => <p key={text} ref={el => { statementRefs.current[i] = el; }} className="hero-statement" aria-hidden="true">{text}</p>)}
      </div>
    </section>
  );
}
