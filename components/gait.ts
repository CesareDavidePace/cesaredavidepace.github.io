/**
 * A small sagittal-plane gait model that outputs pose keypoints, the way a
 * markerless pipeline would. Phase 0 is right heel strike; the figure faces +x.
 * Units are fractions of body height; y grows downwards.
 */
export type Point = { x: number; y: number };
export type Side = 'left' | 'right';
export interface Pose {
  head: Point; nose: Point; neck: Point; hip: Point;
  limbs: Record<Side, { shoulder: Point; elbow: Point; wrist: Point; hip: Point; knee: Point; ankle: Point; toe: Point }>;
}

const DEG = Math.PI / 180;
const bump = (x: number, mu: number, sigma: number) => {
  const d = Math.min(Math.abs(x - mu), 1 - Math.abs(x - mu));
  return Math.exp(-(d * d) / (2 * sigma * sigma));
};
const wrap = (x: number) => ((x % 1) + 1) % 1;
const along = (from: Point, angle: number, length: number): Point => ({ x: from.x + Math.sin(angle) * length, y: from.y + Math.cos(angle) * length });

const THIGH = 0.245, SHANK = 0.246, FOOT = 0.085, TRUNK = 0.29, UPPER_ARM = 0.17, FOREARM = 0.155;

function leg(hip: Point, phase: number) {
  const p = wrap(phase);
  const thigh = (2.5 + 17.5 * Math.cos(2 * Math.PI * p)) * DEG;
  const knee = (4 + 14 * bump(p, 0.14, 0.06) + 56 * bump(p, 0.72, 0.1)) * DEG;
  const shank = thigh - knee;
  const plantar = (-6 * bump(p, 0.04, 0.04) + 18 * bump(p, 0.62, 0.05)) * DEG;
  const kneePoint = along(hip, thigh, THIGH);
  const ankle = along(kneePoint, shank, SHANK);
  const footAngle = shank - plantar;
  const toe = { x: ankle.x + Math.cos(footAngle) * FOOT, y: ankle.y - Math.sin(footAngle) * FOOT };
  return { knee: kneePoint, ankle, toe };
}

function arm(shoulder: Point, phase: number) {
  const p = wrap(phase);
  const upper = -14 * Math.cos(2 * Math.PI * p) * DEG;
  const fore = upper + (18 + 12 * Math.max(0, -Math.cos(2 * Math.PI * p))) * DEG;
  const elbow = along(shoulder, upper, UPPER_ARM);
  return { elbow, wrist: along(elbow, fore, FOREARM) };
}

export function poseAt(phase: number): Pose {
  const hip = { x: 0, y: 0 };
  const lean = 4 * DEG;
  const neck = { x: Math.sin(lean) * TRUNK, y: -Math.cos(lean) * TRUNK };
  const head = { x: neck.x + 0.012, y: neck.y - 0.085 };
  const nose = { x: head.x + 0.04, y: head.y + 0.014 };
  // Small depth offsets keep both sides legible in a pure side view.
  const depth = { left: -0.012, right: 0.012 };
  const build = (side: Side, legPhase: number) => {
    const sideHip = { x: hip.x + depth[side], y: hip.y };
    const shoulder = { x: neck.x + depth[side], y: neck.y + 0.025 };
    // Each arm swings with the opposite leg.
    return { shoulder, ...arm(shoulder, legPhase + 0.5), hip: sideHip, ...leg(sideHip, legPhase) };
  };
  const limbs = { right: build('right', phase), left: build('left', phase + 0.5) };
  // Keep the lowest foot point on the ground (y = 0) so the body bobs naturally.
  const lowest = Math.max(limbs.left.ankle.y, limbs.left.toe.y, limbs.right.ankle.y, limbs.right.toe.y);
  const shift = (pt: Point) => ({ x: pt.x, y: pt.y - lowest });
  const shiftLimb = (l: Pose['limbs']['left']) => Object.fromEntries(Object.entries(l).map(([k, v]) => [k, shift(v)])) as Pose['limbs']['left'];
  return { head: shift(head), nose: shift(nose), neck: shift(neck), hip: shift(hip), limbs: { left: shiftLimb(limbs.left), right: shiftLimb(limbs.right) } };
}

/** Forward travel per gait cycle, as a fraction of body height. */
export const STRIDE = 0.78;
