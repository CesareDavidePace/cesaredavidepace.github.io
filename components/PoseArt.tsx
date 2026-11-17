import { poseAt, STRIDE, type Point, type Pose } from './gait';

const COLORS = { trunk: '#ffffff', left: '#ff4d3d', right: '#2ec4a6' };

function Figure({ pose, dx = 0, opacity = 1, dots = true }: { pose: Pose; dx?: number; opacity?: number; dots?: boolean }) {
  const P = (p: Point) => [p.x + dx, p.y] as const;
  const seg = (a: Point, b: Point, color: string, o = 1, key = '') => {
    const [x1, y1] = P(a), [x2, y2] = P(b);
    return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeOpacity={o} />;
  };
  const sides = (['left', 'right'] as const).map(side => {
    const l = pose.limbs[side];
    const o = side === 'left' ? 0.7 : 1;
    const pairs: [Point, Point][] = [[l.shoulder, l.elbow], [l.elbow, l.wrist], [l.hip, l.knee], [l.knee, l.ankle], [l.ankle, l.toe]];
    return <g key={side}>
      {pairs.map(([a, b], i) => seg(a, b, COLORS[side], o, String(i)))}
      {dots && [l.shoulder, l.elbow, l.wrist, l.hip, l.knee, l.ankle, l.toe].map((p, i) => { const [cx, cy] = P(p); return <circle key={i} cx={cx} cy={cy} r={0.011} fill={COLORS[side]} fillOpacity={o} />; })}
    </g>;
  });
  return (
    <g opacity={opacity} strokeWidth={0.008} strokeLinecap="round">
      {sides}
      {seg(pose.neck, pose.hip, COLORS.trunk, 1, 'trunk')}
      {seg(pose.neck, pose.head, COLORS.trunk, 1, 'neck')}
      {seg(pose.head, pose.nose, COLORS.trunk, 1, 'face')}
      {dots && [pose.nose, pose.head, pose.neck].map((p, i) => { const [cx, cy] = P(p); return <circle key={i} cx={cx} cy={cy} r={0.011} fill={COLORS.trunk} />; })}
    </g>
  );
}

/** Several consecutive frames, the newest in full: what a multi-frame pose estimator reads. */
function Frames() {
  const step = 0.1;
  const frames = [4, 3, 2, 1, 0];
  return <>
    {frames.map(i => <Figure key={i} pose={poseAt(0.3 - i * step)} dx={0.16 - i * step * STRIDE} opacity={i === 0 ? 1 : 0.5 - i * 0.09} dots={i === 0} />)}
  </>;
}

/** Keypoints (filled) mapped to nearby anatomical landmarks (rings). */
function Landmarks() {
  const pose = poseAt(0.18);
  const r = pose.limbs.right;
  const pairs: [Point, Point][] = [
    [r.shoulder, { x: r.shoulder.x + 0.02, y: r.shoulder.y - 0.03 }],
    [r.elbow, { x: r.elbow.x + 0.035, y: r.elbow.y + 0.005 }],
    [r.wrist, { x: r.wrist.x + 0.03, y: r.wrist.y + 0.03 }],
    [r.hip, { x: r.hip.x + 0.06, y: r.hip.y - 0.04 }],
    [r.hip, { x: r.hip.x - 0.06, y: r.hip.y - 0.05 }],
    [r.knee, { x: r.knee.x + 0.04, y: r.knee.y - 0.01 }],
    [r.knee, { x: r.knee.x - 0.035, y: r.knee.y + 0.01 }],
    [r.ankle, { x: r.ankle.x + 0.035, y: r.ankle.y - 0.005 }],
    [r.ankle, { x: r.ankle.x - 0.03, y: r.ankle.y + 0.01 }],
    [r.toe, { x: r.toe.x + 0.02, y: r.toe.y - 0.03 }],
  ];
  return <>
    <Figure pose={pose} opacity={0.9} />
    <g stroke="#ffffff" strokeWidth={0.004} fill="none">
      {pairs.map(([k, l], i) => <g key={i}>
        <line x1={k.x} y1={k.y} x2={l.x} y2={l.y} strokeOpacity={0.45} strokeDasharray="0.008 0.008" />
        <circle cx={l.x} cy={l.y} r={0.014} strokeWidth={0.006} />
      </g>)}
    </g>
  </>;
}

export default function PoseArt({ variant }: { variant: 'frames' | 'landmarks' }) {
  return (
    <svg className="pose-art" viewBox="-0.55 -1.02 1.1 1.1" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1={-0.5} x2={0.5} y1={0.004} y2={0.004} stroke="#ffffff" strokeOpacity={0.15} strokeWidth={0.003} />
      {variant === 'frames' ? <Frames /> : <Landmarks />}
    </svg>
  );
}
